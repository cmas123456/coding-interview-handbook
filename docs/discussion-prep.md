# Discussion Round — Prep for Today

> Read this once. Skim the "Talking-point moves" section right before you dial in. **This is a conversation, not a whiteboard test.**

---

## Format expectations (calibrate your energy)

**What it IS**:
- A conversation. They want to see how you think, not how much you've memorized.
- Usually starts with "tell me about a system you've built" → probes → maybe a light "what if scale went 100x?" extension.
- 45-60 min. Expect **~60% you talking, ~40% them talking/probing**. If you're at 90%, slow down.
- Trade-off reasoning >> textbook answers. Every real system has trade-offs; junior candidates skip past them.

**What it ISN'T**:
- A whiteboard "design Twitter in 45 min" exercise (unlikely at this stage).
- A pop quiz on latency numbers or definitions.
- Somewhere you need to have every canonical design memorized.

**Signal to send**:
- Fluency (you don't need to look up basics)
- Real scars (you've operated systems, not just built them)
- Trade-off reasoning (you name what you gave up, not just what you chose)
- Curiosity (you ask them good questions back)

---

## The 5 numbers to actually memorize

That's it. Don't waste memory on more.

| # | Anchor | Value |
|---|--------|-------|
| 1 | Same-datacenter round trip | **~500 μs** |
| 2 | Cross-continent round trip | **~150 ms** |
| 3 | Seconds in a day | **~10⁵** (86,400) |
| 4 | Availability: 99.9% downtime/year | **~9 hours** (99.99% = ~1 hour, 99.999% = ~5 min) |
| 5 | App server capacity | **~1-10K QPS** per instance |

**QPS shortcut**: `daily events ÷ 10⁵ = avg QPS`. Multiply by 3 for peak.

---

## The 5 concepts to have ready (with the trade-off)

Not the definition — the **trade-off**. That's the seniority tell.

| Concept | The trade-off |
|---------|---------------|
| **Cache-aside vs write-through** | Cache-aside is simple, tolerates staleness. Write-through is consistent, adds write latency + failure modes. |
| **SQL vs NoSQL** | SQL for joins/transactions/complex queries. NoSQL for horizontal write scale + flexible schema. Most apps are SQL until proven otherwise. |
| **Sync vs async replication** | Sync = no data loss, slower writes. Async = fast writes, risk losing recent writes on failover. |
| **Fan-out on write vs read** (feeds) | Write-fan-out = fast reads, expensive for celebrities. Read-fan-out = cheap writes, slow reads. Real answer: hybrid. |
| **CAP** | During a partition, pick C or A. In practice: most systems are AP + retry. Bring up CAP only if partitions are relevant. |

---

## Talking-point moves — redirect prompts to your real experience

The strongest thing you can do: **relate every prompt to something you've actually shipped**. Interviewers grade higher when you say "I've been on both sides of that one — here's what happened" than when you recite a textbook answer.

| If they ask about... | Redirect to your story |
|----------------------|------------------------|
| Auth / identity systems | MSA shadow-tenant work — MSA vs AAD, altSec, JWT validation, WS-Fed/OIDC coexistence |
| Debugging distributed systems | WS-Fed `kid` mismatch → discovered it was a **metadata cache freshness** bug, not the validator |
| Trade-offs in code review | Auth split (tenantedAuthority vs altSecAuthority) — the version I first proposed had more branches; the split had fewer, less to test |
| Cross-team API design | Aloha ↔ Polaris body-claim discussion — pushed back with a threat model, not opinion |
| Scaling legacy code | Polaris Angular → React migration, gated cutovers, feature flags |
| Accessibility / quality bars | axe a11y checks wired into unit test suite — a11y regressions fail PRs |
| CI/CD, deployment safety | EV2 gated rollouts, ring-based deployment, PPE → PRV pattern |
| Handling failure / incidents | MSA IW `PutBillingProfile` debug — telemetry-only was too slow, added local-repro-first to my debug checklist |
| Team leverage / mentorship | Copilot review prompts, PR review turnaround 1 wk → 1-2 days |
| Modernization strategy | Migrated sovereign-cloud + country-expansion flows to modern React with gated cutovers |
| Security | Removed identity-in-body duplication (confused-deputy risk); CWE-346 third-party fix |

---

## Phrases that sound senior (use naturally, don't force)

- *"The trade-off there is…"* — the single most powerful phrase in a design round.
- *"I've been on both sides of that one — we tried X first, hit Y, ended up with Z."*
- *"It depends on the read:write ratio / consistency requirements / SLA — do you know which?"* (**ask clarifying questions**; don't assume)
- *"I'd start with the simplest thing that works and see where it hurts."*
- *"That's a class of problem I'd solve with [pattern] — but if we had [constraint], I'd revisit."*
- *"I'd verify that assumption with a load test / spike / prototype before committing."*
- *"The failure mode I'd worry about is…"* (shows operational thinking)
- *"That's roughly [rough number] — I'd sanity-check the math but the shape is [order of magnitude]."*

---

## Phrases to AVOID (junior tells)

- ❌ *"Best practice is…"* — real engineering is context-dependent; "best practice" signals you haven't lived it
- ❌ Buzzword dropping without a why ("we'd use Kafka" — why?)
- ❌ *"That should be fine"* / *"That should work"* — hedges that show no operational experience
- ❌ Jumping to microservices / Kubernetes / event sourcing unprompted
- ❌ *"I would just…"* — nothing in distributed systems is *just*
- ❌ Over-explaining basics they didn't ask about (they can tell you know; move on)
- ❌ *"Yes, exactly!"* if they push back — engage with the substance instead

---

## When they pose a design prompt

Even a light "how would you build X?" — use this micro-script:

1. **Clarify (30 sec)** — "Before I answer: how many users? Reads vs writes? Consistency requirements? Any SLA?"
2. **Frame (30 sec)** — "OK, so the core problem is X. The interesting bit is Y. Let me sketch a rough shape and we can dive where you're curious."
3. **Rough shape (2 min)** — Client → LB → service → cache → DB. Name the pieces, don't over-detail.
4. **Invite their steer (10 sec)** — "Where would you like me to go deeper?"
5. **Deep-dive one area** — the one they picked, or the interesting trade-off.

**Not doing this = you monologue for 20 min and they haven't gotten to their real question.**

---

## Questions to ask THEM (pick 3-4)

These signal senior; softballs signal junior.

1. **"What's the biggest technical bet the team is making right now, and what would make it fail?"** (operational thinking + curiosity)
2. **"How do decisions get made when senior engineers disagree on architecture?"** (culture)
3. **"What's a project that failed here in the last year, and what did the org learn from it?"** (self-awareness signal)
4. **"How do senior engineers spend their time — more code, more design, more mentorship?"** (role clarity)
5. **"What would make me successful in the first 90 days that isn't in the JD?"** (close-the-loop signal)

**Skip**: work-life balance, tech stack (Google it), "what's the culture" (too generic).

---

## Pre-call checklist (60 min before)

- [ ] Water, no caffeine spike
- [ ] Re-read the **Talking-point moves** table above
- [ ] Re-read your **Fast-recall matrix** in [Your Stories](senior-discussion/your-stories.md)
- [ ] Skim the **5 numbers + 5 concepts** — say them out loud once
- [ ] One fresh fact about the company from their blog/news
- [ ] JD open on second monitor
- [ ] Camera/audio test

## Opening line (when they say "tell me about yourself")

Reuse your phone-screen 60-second opener. End with:

> *"…happy to go deeper on any of that — where would you like to start?"*

Hands them control. Avoids the monologue trap.

## Closing line

> *"This has been a great conversation. What's the next step on your side, and is there anything you'd like me to follow up on in writing?"*

---

## If you go blank

- **Ask a clarifying question** — buys you 20 sec + shows engagement.
- **Restate the problem** — "So what you're asking is X — let me think about it in terms of Y."
- **Reason from first principles** — "I'd start with what the user needs, then work backward: what data, what queries, what SLA."
- **It's OK to say "I don't know"** — if you follow with "here's how I'd find out" or "here's the closest analog I've dealt with."

---

## The one thing to internalize

**They already know you can code.** This round is about whether they want to work with you and whether you can shape decisions that matter. Every answer should signal one of: judgment, ownership, trade-off reasoning, curiosity, humility.

You've shipped real distributed identity systems at Microsoft for 6 years. You have the scars. Let them show.

Good luck. 🎯
