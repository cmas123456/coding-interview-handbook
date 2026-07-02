# Your Story Bank

> Pre-fill 2-3 stories per theme. The goal is that any prompt maps to a story you can tell in 90 seconds without hesitation.

**How to use**: fill in the outlines. During interviews, don't recite — use these as anchors so you can adapt on the fly.

---

## Theme 1 — Tough technical decision

### Story A: MSA shadow-tenant identity model (recent, hot)
- **Situation**: signup flow for MSA users needed to create AAD "shadow tenants" so IW/Org users get identical downstream identity. Legacy path did it differently for each; PR4D consolidated.
- **Ambiguity**: unclear whether MSA-with-Org and MSA-IW should share the same MFA path. The old config short-circuited IW to skip MFA — no comment explaining why.
- **Decision**: routed both to `SetupMicrosoftAuthenticator` for parity, since the underlying identity (MSA principal + AAD shadow tenant) is identical; only the billing account type differs.
- **Trade-off**: risk of adding a step to a flow that "worked" vs correctness/consistency. Chose correctness — asymmetric MFA is a security smell.
- **Result**: unified flow, one less "why is this different?" question for the next engineer.
- **What I'd change**: caught it by pushing back on my own rationalization — should have questioned the asymmetry immediately instead of first accepting "it's by design".

### Story B: [fill in — a decision from a different domain / older role]
- Situation:
- Options considered:
- Criteria + decision:
- Trade-off:
- Result + reflection:

---

## Theme 2 — Cross-team / influence

### Story A: [fill in — align on API contract, deprecation, standard, etc.]
- Who: which teams, what did each care about?
- Conflict: whose interests were at odds?
- How you built the case: doc, prototype, data, 1:1s?
- Alignment moment: the meeting / doc review that landed it
- Outcome:

### Story B: [fill in]

---

## Theme 3 — Ambiguity

### Story A: Polaris IW signup gap investigation
- **Situation**: reports that IW signup wasn't working end-to-end in PR4D, but no clear repro, spread across services.
- **Approach**: traced the config-driven flow engine, mapped each step to backend calls, isolated the broken hop (poll routing landing on wrong next-step).
- **Reframe**: the "bug" was actually two bugs in one — post-poll routing was wrong for the bootstrap path, AND the MFA branch had an unjustified IW short-circuit.
- **Outcome**: two surgical fixes shipped in one branch.

### Story B: [fill in — a project without clear requirements]

---

## Theme 4 — Disagreement

### Story A: [fill in — technical disagreement with peer / manager]
- Substance:
- How you engaged (data? prototype? escalation?):
- Resolution:
- Relationship afterward:

### Story B: [fill in]

---

## Theme 5 — Failure

### Story A: [fill in — incident or shipped bug you owned]
- What happened (specific, own it):
- Root cause (technical + process):
- Personal lesson:
- Systemic fix (runbook, monitor, process change):

### Story B: [fill in]

---

## Theme 6 — Mentoring / multiplier

### Story A: [fill in — specific person you leveled up]
- Their starting point:
- What you did concretely (not just "gave advice"):
- Their growth outcome:
- Team-level impact:

### Story B: [fill in — process or norm you established]

---

## Theme 7 — Scope / prioritization

### Story A: [fill in — a time you cut scope or said no]
- What was proposed:
- What you cut and why:
- Who you convinced:
- What happened as a result:

### Story B: [fill in — deprecation, sunset, or feature kill]

---

## Theme 8 — Learning / growth

### Story A: [fill in — skill deliberately developed in last year]
- What: (system design study, ML fundamentals, leadership book, etc.)
- How: (course, book, side project, mentor)
- Applied where:

### Story B: "I used to think X, now I think Y"
- Old belief:
- What changed my mind:
- New view:

---

## Fast-recall matrix (fill this in, print it, review pre-interview)

| Theme | Story A one-liner | Story B one-liner | Numbers/impact |
|-------|-------------------|-------------------|----------------|
| Tough tech decision | MSA shadow-tenant MFA parity | | 2 fixes, 1 PR |
| Cross-team | | | |
| Ambiguity | IW signup gap investigation | | 2 root causes found |
| Disagreement | | | |
| Failure | | | |
| Mentoring | | | |
| Scope | | | |
| Learning | | | |

**Print this. Fill it in tonight. Reference it in your last 5 min of prep.**
