# Common System Designs

> Canonical designs at bullet-depth. Enough to speak fluently, not to implement.

---

## URL Shortener (bit.ly)

**Scale**: read-heavy (100:1), low storage.

**API**:
```
POST /shorten { longUrl } → { shortUrl }
GET  /{code}                → 301 redirect
```

**Code generation** — pick one:
- **Base62 counter** — auto-increment ID → base62 encode. Simple, sequential (guessable).
- **Hash + collision retry** — MD5(longUrl)[:7]. Deterministic but collisions possible.
- **Pre-generated pool** — background worker fills a "next codes" table. Best for high write throughput.

**Storage**: KV store (DynamoDB / Redis) keyed by shortcode. Values tiny.

**Cache**: hot codes in Redis with TTL. 90%+ hit rate typical.

**Deep dives**: analytics (async log → Kafka → warehouse), custom URLs, expiration, abuse detection.

---

## Rate Limiter

**Algorithms**:
| Algorithm | How | Trade-off |
|-----------|-----|-----------|
| **Token bucket** | Refill N tokens/sec, deduct per request | Allows bursts, simple |
| **Leaky bucket** | Fixed drain rate | Smooth output, no bursts |
| **Fixed window** | Counter per minute | Simple, edge burst at window boundary |
| **Sliding window log** | Timestamp per request | Exact, expensive |
| **Sliding window counter** | Weighted avg of 2 windows | Approx exact, cheap ← usually best |

**Storage**: Redis with atomic ops (`INCR` + `EXPIRE`, or Lua for sliding window).

**Where it lives**: API gateway (edge) — reject early, don't waste service capacity.

**Distributed**: sync counters via Redis; accept slight over-count vs per-node counters (which under-count).

**Deep dives**: per-user vs per-IP vs per-endpoint, tiered limits (free/paid), graceful degradation (429 + `Retry-After`).

---

## News Feed (Twitter / Instagram)

**Two strategies**:

| | Fan-out on write (push) | Fan-out on read (pull) |
|---|---|---|
| **How** | On post, push to N follower inboxes | On read, query recent posts from followees |
| **Read latency** | Fast (pre-computed) | Slow (fanout at query time) |
| **Write cost** | High for celebrities (millions of writes/post) | Cheap |
| **Storage** | High (N copies) | Low |
| **Best for** | Users with small-to-medium followings | Everyone (with hybrid) |

**Hybrid (real answer)**:
- Push for normal users.
- **Pull for celebrities** (>10K followers) — merge celebrity posts into user's inbox at read time.
- Best of both worlds.

**Storage**:
- Posts → Cassandra / DynamoDB, partitioned by userId.
- Timeline → Redis sorted set per user (score = timestamp).

**Deep dives**: ranking (ML score), pagination cursors, media handling (S3 + CDN), edit/delete propagation.

---

## Chat (WhatsApp / Slack)

**Scale**: billions of messages/day, real-time delivery, offline support.

**Delivery model**:
- **WebSocket / long-lived connection** from client to a "connection service".
- Message goes: client → API → **message service** → **fanout** → recipient's connection service → device.
- If offline: persist + push notification (APNs/FCM).

**Storage**:
- Messages: Cassandra, partitioned by conversationId, sorted by timestamp.
- Group metadata: SQL.
- Delivery receipts: separate table (async writes).

**1-on-1 vs group**:
- 1-on-1: single conversationId, 2 participants.
- Group: fan-out to N recipients. For large groups (>1K), consider write-to-shared-log + read-on-connect.

**Consistency**: eventual is fine — messages get an ID + timestamp; clients dedupe.

**Deep dives**: end-to-end encryption (Signal protocol), presence, typing indicators, message ordering.

---

## Notification Service

**Requirements**: multi-channel (push, email, SMS, in-app), templated, retryable, rate-limited per user.

**Architecture**:
```
Publisher → Kafka → Notification Service → [Channel Workers] → Provider APIs
                          ↓
                    Template DB, User Prefs DB
```

**Key concerns**:
- **Idempotency** — dedupe key per (userId, event) to avoid duplicates on retry.
- **User preferences** — quiet hours, channel opt-outs, frequency caps.
- **Provider failover** — APNs down? Queue and retry with backoff.
- **Priority queues** — transactional (OTP) > engagement.

**Deep dives**: DLQ + replay, batch/digest emails, delivery tracking.

---

## Top-K / Trending

**Approaches by scale**:
- **Small (<1M events/day)**: sort in memory / SQL `ORDER BY count DESC LIMIT K`.
- **Medium**: Redis sorted set (`ZINCRBY` + `ZREVRANGE`).
- **Large (Twitter-scale)**: **approximate counting** — Count-Min Sketch + heap for top-K. Trades exactness for O(1) memory per item.

**Real-time**: sliding window over event stream (Flink, Kafka Streams).

**Deep dives**: preventing gaming (bots inflating counts), decay (weight recent > old), personalization.

---

## Geo-search (Uber / Yelp "nearby")

**Problem**: given (lat, lng), find K nearest points in <100ms.

**Approaches**:
| Approach | How | When |
|----------|-----|------|
| **Geohash** | Encode lat/lng → prefix string; nearby = shared prefix | Simple, works well |
| **Quadtree** | Recursive spatial subdivision | Uneven density (cities vs rural) |
| **S2 (Google)** | Sphere → cells, hierarchical | Production-grade geo |
| **PostGIS / MongoDB 2dsphere** | DB-native geo index | Small-medium apps |

**Uber-specific twist**: driver locations change every few seconds → in-memory geo-index (Redis GEO or custom S2), updated on driver heartbeat.

**Deep dives**: matching (ETA + surge pricing), consistency during hand-off, city-level sharding.
