# Senior / Staff Discussion Framework

> The bar shifts at senior+. They're testing judgment, scope, and influence — not just execution.

---

## The 5 lenses interviewers evaluate

For every story you tell, hit as many as you can.

| Lens | Signal | Questions to answer |
|------|--------|---------------------|
| **Scope** | Beyond your desk | Who else was affected? What was the blast radius? |
| **Trade-offs** | Judgment under constraint | What did you weigh? What did you give up? |
| **Ambiguity** | Comfort with unclear problems | What wasn't specified? How did you decide? |
| **Influence** | Getting alignment | Who did you need to convince? How? |
| **Impact** | Measurable outcome | What changed? For whom? By how much? |

---

## STAR, upgraded for senior

Basic STAR is fine for junior. At senior+, expand:

**S — Situation**
- Context (team size, timeline, stakes)
- **Ambiguity** — what was unclear or contested
- Stakeholders — who cared about the outcome

**T — Task**
- Your specific role (not "the team did X" — what did *you* do?)
- The **constraint** that made it interesting (deadline, budget, unknown scope)

**A — Action**
- The decision you made and **why** (trade-offs)
- Who you brought in / influenced
- What you did differently than obvious approach

**R — Result**
- Quantified impact (users, latency, revenue, incidents avoided)
- **Second-order effects** — what changed downstream
- **What you'd do differently** — self-reflection is a senior signal

!!! tip "The senior-level tell"
    Junior stories end at "R". Senior stories add: "…and looking back, the thing I underweighted was X. Next time I'd Y."

---

## The 3 questions that separate senior from staff

Be ready to answer these in *any* discussion:

1. **"What was the trade-off?"** — every real engineering decision has one.
2. **"Who else did you need to align?"** — solo heroics don't score at staff level.
3. **"What would you do differently?"** — hindsight + humility.

---

## How to talk about tech decisions (not implementations)

Interviewer asks: "Tell me about a hard technical decision."

**Bad answer**: "We chose Postgres because it's reliable." *(no trade-off, no context)*

**Good answer** (structure):
1. **Constraint** — "We had 3 weeks and 2 engineers, needed to handle 5K writes/sec."
2. **Options considered** — "I evaluated Postgres, DynamoDB, and keeping MySQL."
3. **Criteria** — "Ranked on: dev velocity, ops burden, cost, scale headroom, migration risk."
4. **Decision + trade-off** — "Chose Postgres. Traded scale ceiling (would need sharding at 50K writes/sec) for team familiarity + no ops learning curve."
5. **Validation** — "Load-tested at 3x expected. Documented the sharding decision point for future."
6. **Outcome** — "Shipped in 2.5 weeks, ran clean for 18 months. Still hasn't needed sharding."

---

## Common trap: hero mode

Interviewers will bait you with: "Tell me about a time you saved the day."

**Trap**: launch into a solo firefighting story. Signals: doesn't scale, doesn't develop others, single point of failure.

**Better frame**: "Here's the incident. Here's what I did in the moment. Here's what I did *after* to make sure the team wouldn't need me next time." Bonus: mention a runbook you wrote, a monitor you added, a person you mentored to own it.

---

## Discussing failures

**Rule**: 1 real failure, 2 lessons, 1 systemic change.

Structure:
1. What happened (be specific, own it)
2. Root cause (technical + process)
3. What you learned personally
4. What you changed systemically (process, tooling, docs, team norm)

**Avoid**: blaming others, "failures" that are humblebrags, vague "we learned to communicate better".

---

## The 90-second story format (memorize this)

Every story you tell should fit in ~90 seconds unless they ask for more:

- **10s** — context: what/when/where, why it mattered
- **15s** — the interesting constraint
- **40s** — what you did, the key decision, why
- **15s** — outcome + numbers
- **10s** — reflection / what you'd change

Practice out loud. Time yourself. Trim ruthlessly.
