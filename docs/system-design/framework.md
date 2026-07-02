# System Design Framework

> A repeatable 45-min script. Run it in order; don't skip steps. Signal you know the process.

---

## The 7 steps (say them out loud)

| # | Step | Time | What you actually do |
|---|------|------|----------------------|
| 1 | **Requirements** | 5 min | Functional + non-functional. Ask, don't assume. |
| 2 | **Estimation** | 3 min | QPS, storage, bandwidth. Back-of-envelope. |
| 3 | **API design** | 3 min | Endpoints + request/response shapes. |
| 4 | **Data model** | 4 min | Entities, relationships, SQL vs NoSQL choice. |
| 5 | **High-level design** | 8 min | Boxes + arrows. Client → LB → service → DB, plus cache/queue/CDN. |
| 6 | **Deep dives** | 15 min | Pick 2-3 areas the interviewer cares about. |
| 7 | **Trade-offs + wrap** | 5 min | Bottlenecks, what you'd change with more time. |

---

## Step 1 — Requirements (the highest-leverage 5 min)

**Functional** — what does it do?
- "Users can post, follow, see a feed" — enumerate concretely.
- Get 3-5 core features. Don't accept "everything".
- Explicitly **cut scope**: "I'll design posting + feed; auth and payments out of scope — sound good?"

**Non-functional** — how well?
- Scale: DAU, QPS, read:write ratio
- Latency: p50/p99 target
- Consistency: strong or eventual?
- Availability: 99.9%? 99.99%?
- Durability: can we lose data?

!!! tip "Ask these 4 questions every time"
    1. "How many users? Reads vs writes?"
    2. "What's the latency target?"
    3. "Consistency: is eventual OK, or must reads see the latest write?"
    4. "Any specific SLAs on availability?"

---

## Step 2 — Estimation (show the math)

Do it out loud. Interviewers grade on the *process*, not the number.

**Template**:
```
DAU: 100M
Actions/user/day: 10 → 1B/day
QPS avg: 1B / 86,400 ≈ 12K QPS
Peak (3x): ~36K QPS
Read:write = 100:1 → writes 360 QPS, reads 36K QPS
Storage/action: 1KB → 1TB/day → 365TB/yr
```

Numbers to memorize: see [Estimation Numbers](estimation-numbers.md).

---

## Step 3 — API design

Keep it minimal. REST is fine unless they push you.

```http
POST /posts             { text, mediaUrl? }        → { postId }
GET  /users/{id}/feed?cursor=X&limit=20            → { posts[], nextCursor }
POST /users/{id}/follow                            → 204
```

- **Cursor pagination**, not offset (scales, stable).
- Idempotency keys on writes if retries matter.
- Auth: assume bearer token in header; don't rat-hole on it.

---

## Step 4 — Data model

Two questions to answer:
1. **SQL or NoSQL?** — SQL if you need joins, transactions, or strong consistency. NoSQL if you need horizontal write scale + flexible schema.
2. **What's the primary access pattern?** — Design the schema/keys around it.

Sketch 3-5 tables. For NoSQL, sketch the partition key + sort key.

---

## Step 5 — High-level design

Draw this backbone every time, then adapt:

```
Client → CDN → LB → API Gateway → [Service] → Cache → DB
                                       ↓
                                    Queue → Worker → DB/Search
```

Announce the pieces as you draw. Then say: **"Now let me trace a write and a read through this."**

---

## Step 6 — Deep dives (where you win or lose)

Interviewer will nudge you toward 2-3 of:
- **Scaling the DB** — sharding key choice, replication, read replicas
- **Cache strategy** — cache-aside vs write-through, invalidation, TTL
- **Feed generation** — fan-out on write vs read (see [Patterns](patterns.md))
- **Rate limiting** — token bucket vs sliding window
- **Search** — inverted index, Elasticsearch
- **Consistency** — quorum reads, leader election, CRDTs
- **Hot keys / celebrities** — replication, per-key fanout

Pick the deep dive **they** care about. If unclear, ask: "Which area would you like me to go deeper on?"

---

## Step 7 — Trade-offs + wrap

End strong with 3 bullets:
1. **Current bottleneck**: "At 10x scale, the feed DB writes become the choke — I'd shard by userId."
2. **Consistency trade-off**: "I chose eventual consistency on feed reads for latency; the cost is stale reads for up to N seconds."
3. **What I'd do with more time**: "Add a search service, harden the abuse pipeline, run a load test."

---

## Anti-patterns (don't do these)

- ❌ Jumping to boxes before clarifying requirements
- ❌ Adding Kafka/Redis/microservices without justifying them
- ❌ Ignoring the interviewer's hints ("what if X was 100x?")
- ❌ Silent thinking — narrate constantly
- ❌ Perfectionism on one area — cover the whole board first, deep-dive second
