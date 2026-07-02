# Your Story Bank

> Pre-filled from your actual work at Microsoft (M365 sign-up — Aloha + Polaris teams, 6 years). Use these as anchors; adapt tone/depth on the fly.

**Refine before the interview**: fill in exact metrics (users, latency, dates) where you have them. Numbers > adjectives.

---

## Theme 1 — Tough technical decision

### Story A: Splitting `tenantedAuthority` from `altSecAuthority` (auth architecture)
- **Situation**: MSA users signing up needed AAD "shadow tenants". Existing code overloaded one authority config for both the tenanted AAD flow and the MSA altSec flow, causing intermittent token-cache bugs and country-extraction failures.
- **Options considered**:
  1. Patch the shared code with more conditionals (fast, adds tech debt)
  2. Split into two distinct authorities with a clear predicate (slower, correct)
  3. Runtime-switch via feature flag (most flexible, hardest to reason about)
- **Criteria**: correctness > velocity, since token bugs are silent and hit production before you know. Also: reduce cognitive load for the next engineer.
- **Decision**: Option 2 — introduced `altSecAuthority` alongside `tenantedAuthority`, made the predicate config-independent so it can't drift.
- **Trade-off**: bigger diff, more review cycles with Sung (tech lead), but the resulting mental model is simple: "if MSA → altSec, else → tenanted." No more `if (config.flag && account.type === X && ...)` chains.
- **Result**: shipped as its own PR (checkpoint 28-29). Downstream MSA work (PR4D shadow-tenant resume) built cleanly on top. Zero token-cache bugs since.
- **Reflection**: I initially proposed Option 1; Sung pushed for the split during review. Changed my mind after prototyping — the "smaller" fix required more branching everywhere it was consumed. Lesson: cheap-looking diffs can hide expensive-to-maintain shapes.

### Story B: MSA-IW MFA parity (recent, judgment under ambiguity)
- **Situation**: while landing PR4D, noticed the config short-circuited MSA-IW users straight to `SummaryV2`, skipping the `SetupMicrosoftAuthenticator` step that MSA-with-Org users hit.
- **Ambiguity**: no code comment explaining the asymmetry. Initial rationalization: "must be by design." User (product owner) pushed back: MSA-with-Org and MSA-IW produce identical shadow-tenant identity — only billing account type differs. Why the asymmetric security posture?
- **Decision**: removed the IW-only short-circuit, routed both to MFA setup. Filed the change as a "parity fix" so reviewers understood the intent.
- **Trade-off**: risk of adding a step to a flow that PMs thought "worked" vs correctness/security. Chose correctness.
- **Result**: unified flow (commit `1574a99`), one less "why is this different?" question for the next engineer.
- **Reflection**: I nearly accepted "it's by design" without evidence. Lesson: when routing rules branch on identity type, demand a written justification — silent asymmetry in auth is a code smell.

---

## Theme 2 — Cross-team / influence

### Story A: Aloha ↔ Polaris MSA integration (multi-service, multi-team)
- **Situation**: MSA signup required coordinated changes across **Polaris** (React front-end + config-driven flow engine) and **Aloha** (.NET back-end / tenant provisioning). Different owners, different repos, different release cadences.
- **Who cared**: Polaris team (UX + config), Aloha team (Sung + tenant infra), identity/AAD team (token semantics), PM (release timeline).
- **Conflict**: Aloha wanted MSA identity claims (puid, email) in the request body for "convenience"; I pushed back — the `x-ms-msa-token` JWT already carries verified claims, and body-side identity is spoofable via Fiddler (confused-deputy risk).
- **How I built the case**: wrote a short doc showing (a) the JWT claim set, (b) the Fiddler attack path if we trusted body claims, (c) the minimal body change (just `UserIdentity.type = LiveID` as a routing marker). Walked Sung through it in a 30-min sync.
- **Alignment**: Sung agreed on the security argument, we removed the identity duplication. That norm ("don't duplicate verified-token claims in the body") is now a project convention.
- **Result**: shipped end-to-end MSA-IW flow; Aloha PR merged clean; no security review pushback.
- **Reflection**: framing this as "here's the attack" — not "here's my opinion" — was what landed it. Concrete threat models beat abstract principles in cross-team reviews.

### Story B: Copilot AI review prompts (org-wide leverage)
- **Situation**: AI-generated PRs were slow to review — reviewers had to re-derive intent from diffs alone. Team-wide review turnaround was ~1 week for AI-assisted changes.
- **Task**: not assigned to me — I noticed the pattern in my own PRs.
- **Action**: authored a set of reusable Copilot review prompts (a "review checklist" prompt, a "trace call sites" prompt, a "check for security regressions" prompt). Shared in the team channel, then pitched to broader signup org.
- **Result**: PR review turnaround on AI-assisted changes dropped from ~1 week to 1-2 days. Multiple teams adopted the prompts.
- **Reflection**: the influence angle here isn't authority — I had none. It's that I made a template someone else could pick up in 30 seconds and get value from. Ergonomics wins adoption.

---

## Theme 3 — Ambiguity

### Story A: WS-Fed signing-key `kid` mismatch (the hardest debug of the year)
- **Situation**: Aloha MSA OIDC integration failing intermittently with token validation errors. WS-Fed metadata declared one signing key set; JWTs were signed by a different `kid`. No clear repro.
- **Approach**: no one on the team had seen this before. Traced from failing token backward — pulled the metadata doc, dumped the JWT header, compared the `kid` values. Confirmed the discrepancy. Then figured out *why*: the metadata endpoint was refreshing at a different cadence than the signing keys themselves.
- **Reframe**: the "OIDC validator bug" was actually a **cache-freshness bug in the metadata layer**, not a validation bug. Different fix location.
- **Action**: amended the OIDC validator PR to include the correct key-refresh path; documented the freshness contract so the next person doesn't chase the same red herring.
- **Result**: intermittent failures went to zero. Doc lives in the repo for future oncalls.
- **Reflection**: I spent ~2 days on the wrong hypothesis (validator logic) before questioning the framing. Lesson: when the framing has been "the validator is wrong" for two days, explicitly step back and ask "what if the input is wrong?"

### Story B: Polaris IW signup gap investigation (recent)
- **Situation**: reports that IW signup wasn't working end-to-end in PR4D. No clear repro, spread across config, front-end, and backend.
- **Approach**: traced the config-driven flow engine step-by-step, mapped each step to its backend call, isolated the two broken hops (post-poll routing landed on wrong next-step; MFA branch had an unjustified IW short-circuit).
- **Reframe**: the "one bug" was actually **two independent bugs** — bootstrap-vs-legacy poll routing AND MFA parity. Both shipped in the same PR (commits `f246f37` + `1574a99`).
- **Result**: unblocked PR4D; downstream QA scenarios pass.
- **Reflection**: I almost stopped after finding the first bug. Lesson: when the symptom is "flow doesn't work end-to-end", verify **all remaining hops** before claiming fixed — one root cause is a hypothesis, not a conclusion.

---

## Theme 4 — Disagreement

### Story A: OIDC vs WS-Fed for Aloha MSA (design disagreement with tech lead)
- **Situation**: choosing the auth protocol for Aloha's MSA integration. My initial preference: OIDC (modern, JSON-native, easier to debug). Sung's preference: WS-Fed (matches existing enterprise integrations, less migration risk).
- **How I engaged**: asked Sung to walk me through his concern in a 1:1. Restated it back. Ran a small spike on both to compare debug-ability with actual production-shaped tokens.
- **What changed my mind**: the WS-Fed path had lower blast radius on the existing enterprise plumbing, and OIDC would have required a parallel key-management story we didn't have time for. His concern about "not introducing a second protocol we have to maintain" was real, not abstract.
- **Resolution**: went with WS-Fed for the initial integration, agreed to revisit OIDC once we had bandwidth for the key-management work. Later on I did land the OIDC validator (checkpoint 24) — so both paths coexist now, but we sequenced them correctly.
- **Result**: shipped on time; no protocol-migration incidents; relationship with Sung strengthened (he trusted me on later architecture calls, e.g., the auth split in Story 1A).
- **Reflection**: "strong opinions, weakly held" works only if you actually test the opinions. The spike is what let me change my mind honestly, not just deferentially.

### Story B: PR cleanup per Sung's review rules
- **Situation**: Aloha PR came back from Sung's review with substantial restructuring feedback — not bugs, but organizational (file placement, naming, one-concern-per-PR).
- **How I engaged**: pushed back on **one** item (didn't want to split a change I'd verified as atomic). Accepted the rest.
- **Resolution**: split the PR I'd resisted splitting; Sung was right — it made the second half reviewable as its own thing, and the first half landed a day faster.
- **Reflection**: not every disagreement resolves with you being right. When a senior reviewer has strong conventions, the cost of following them is low and the trust dividend is high. Save your capital for real disagreements.

---

## Theme 5 — Failure

### Story A: Two rounds on the MSA gate PR (self-created rework)
- **Situation**: first cut of the MSA gate PR was built on top of pr4d. Sung asked why it wasn't off master; I'd assumed pr4d was landing "soon" and stacked on top.
- **What went wrong**: pr4d slipped by weeks. My PR was blocked on it and couldn't be reviewed independently.
- **Personal lesson**: I optimized for my own local convenience (rebase later) at the cost of the team's review velocity.
- **Systemic fix**: adopted a rule — any PR that could plausibly land on master should be built on master, even if it's slightly more work to rebase later. Trades my time for reviewer time; reviewers are the bottleneck.
- **Result**: redid the PR off master (checkpoint 11), it landed within a week. Applied this rule since — no repeats.

### Story B: MSA IW `PutBillingProfileIWUser` debug (slower than it should have been)
- **Situation**: MSA IW polling was failing on `PutBillingProfileIWUser`. Spent significant time hypothesizing wrong root causes before finding the real one.
- **Root cause (technical)**: mismatch between the billing-account-type wiring and what the backend expected.
- **Root cause (process)**: I'd been debugging from telemetry alone without running the flow locally. Once I ran it locally with fresh logs, root cause surfaced in 30 min.
- **Systemic fix**: added local-repro-first as a step in my personal debug checklist. Also added better telemetry field so the next person can diagnose from logs alone.
- **Reflection**: telemetry is a lagging indicator during active investigation. Local repro is faster if you have it available — I'd deprioritized it because "logs should be enough."

---

## Theme 6 — Mentoring / multiplier

### Story A: Copilot review prompts (leverage without authority)
- **Situation**: team was newly leaning into AI-assisted PRs; nobody had a system for reviewing them efficiently.
- **What I did**: authored 3-4 reusable Copilot prompts (review checklist, call-site tracer, security regression check), documented them in the team wiki, and demoed in a team meeting.
- **Concrete artifact**: not just "gave advice" — shipped a template file people could copy/paste.
- **Team-level outcome**: PR review turnaround on AI-assisted changes went from ~1 week to 1-2 days across the team.
- **Broader outcome**: prompts got picked up by adjacent teams in the signup org.

### Story B: [fill in — a specific person you leveled up]
- Their starting point:
- What you did concretely (pair coding, review depth, doc, brownbag):
- Their growth outcome:
- Team-level impact:

---

## Theme 7 — Scope / prioritization

### Story A: Dropping existing-shadow-tenant scenarios from PR4D scope
- **Situation**: PR4D shadow-tenant work had a 4-scenario matrix (no-tenant/existing-tenant × Org/IW). Existing-tenant scenarios hadn't been tested end-to-end and needed additional infra work.
- **What I proposed**: cut existing-tenant from the PR4D landing scope. Ship the two no-tenant scenarios first, defer existing-tenant to a follow-up.
- **Criteria**: (a) no-tenant unblocks the primary customer segment now, (b) existing-tenant needs test infra we don't have, (c) stacking scope risks slipping both.
- **Who I convinced**: PM (wanted the full matrix), Sung (needed the code paths designed to accommodate future existing-tenant work without churn).
- **Result**: no-tenant Org + IW shipped, PPE tested (WI 533326, 533190 completed). Existing-tenant tracked as a future deliverable with clear entry criteria. If we'd stacked, we'd still be in review.
- **Reflection**: the hardest part wasn't the technical scope call — it was writing down the deferral criteria explicitly so it didn't feel like "just cutting." Documented deferrals are principled; undocumented ones look like giving up.

### Story B: [fill in — deprecation or feature kill]

---

## Theme 8 — Learning / growth

### Story A: Building the interview handbook (deliberate practice, current)
- **Context**: after the layoff notice, I built a MkDocs site (`coding-interview-handbook`) as my own study tool — Blind 75 by-pattern, complexity cheatsheet, pattern atlas, drill lists.
- **Why it matters**: rather than passively grinding LeetCode, I forced myself to organize problems by *pattern* — the meta-skill that transfers across problems. Teaching (even to future-me) is the highest-signal way I learn.
- **Applied where**: the pattern-recognition mental model is exactly how I approach system-design problems now (recognize the shape → apply the framework → adapt).
- **Reflection**: I used to think "practice = volume of problems solved." Now I think practice = **depth of pattern extraction from fewer problems**.

### Story B: "I used to think X, now I think Y"
- **Old belief**: correctness is achieved through more edge-case tests.
- **New belief**: correctness is mostly achieved through **simpler models** — if the code has fewer branches, most edge cases don't exist. Tests catch what's left.
- **What changed my mind**: the `tenantedAuthority` / `altSecAuthority` split (Story 1A). The version I initially wanted to ship had more test coverage; the version I ended up shipping had fewer branches and needed less test coverage because the branches were gone.

---

## Fast-recall matrix (print this + review pre-interview)

| Theme | Story A (primary) | Story B (backup) | Numbers/impact |
|-------|-------------------|------------------|----------------|
| Tough tech decision | Auth split (tenantedAuth / altSecAuth) | MSA-IW MFA parity fix | Shipped clean; zero token bugs since |
| Cross-team | Aloha ↔ Polaris MSA (threat-model doc) | Copilot review prompts adopted org-wide | Security norm established; adoption crossed team lines |
| Ambiguity | WS-Fed `kid` mismatch → cache-freshness | IW signup gap → two independent bugs | Failures → zero; unblocked PR4D |
| Disagreement | OIDC vs WS-Fed spike w/ Sung | PR structure pushback + concession | Both protocols later coexist; PR landed faster |
| Failure | MSA gate PR stacked on pr4d (weeks of wasted queueing) | IW `PutBillingProfile` debug (telemetry-only was too slow) | Adopted "build on master" + "local-repro-first" rules |
| Mentoring | AI review prompts → 1wk → 1-2 days | (fill in specific person) | Team-wide + adjacent-team adoption |
| Scope | Cut existing-tenant from PR4D | (fill in) | 2 scenarios shipped + PPE completed vs 0 |
| Learning | Interview handbook — pattern extraction | Fewer branches > more tests | Applied to current system-design prep |

---

## Delivery notes for tomorrow

- Numbers > adjectives. If you don't have the exact number, say "roughly" — never make one up.
- Use **"I"** for actions, **"we"** for outcomes.
- Pause 2 seconds before answering — deliberate pace reads as senior.
- End every story with **"what I learned was X"** — one sentence, then stop.
- If they ask a question your story doesn't fit — say so, and adapt: "That's not exactly what I have, but the closest analog is…"
