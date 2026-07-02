# Building Blocks

> One-liner "when to use / when not to" for every component you'll draw on the whiteboard.

---

## Load Balancer

**Use for**: horizontal scaling, health checks, TLS termination.

| Layer | Type | Use when |
|-------|------|----------|
| L4 | TCP (HAProxy, NLB) | Raw throughput, non-HTTP protocols |
| L7 | HTTP (nginx, ALB, Envoy) | Path/header routing, rate limiting, auth offload |

**Algorithms**: round-robin (default), least-connections (long-lived conns), consistent-hash (sticky sessions / cache affinity).

**Don't**: put a single LB with no failover in your diagram — always mention "and a standby / DNS-level failover".

---

## Cache

**Use for**: read-heavy workloads, expensive computations, session storage.

| Strategy | How | When |
|----------|-----|------|
| **Cache-aside** (lazy) | App checks cache → miss → read DB → populate | Default. Simple. |
| **Write-through** | Write to cache + DB atomically | Read-after-write consistency matters |
| **Write-behind** | Write to cache, async flush to DB | Absorb write bursts, accept data loss risk |
| **Refresh-ahead** | Refresh before TTL for hot keys | Predictable hot keys, low tail latency |

**Redis vs Memcached**:
- **Redis** — data structures (lists, sets, sorted sets), persistence, pub/sub, Lua scripts. Default choice.
- **Memcached** — pure KV, multithreaded, slightly faster for simple string cache. Rare pick today.

**Invalidation** (the hard problem):
- TTL — easiest, accepts staleness
- Write-through — strong consistency, more code
- Explicit invalidation on write — leaks abstractions but precise

**Don't**: cache without a TTL. Ever.

---

## Database — SQL vs NoSQL

| Pick SQL when | Pick NoSQL when |
|---------------|-----------------|
| Need ACID transactions | Need horizontal write scale |
| Complex joins / ad-hoc queries | Known access patterns |
| Strong consistency required | Flexible/evolving schema |
| Moderate scale (<100K QPS) | Massive scale (>100K QPS) |

**SQL flavors**: PostgreSQL (default), MySQL (large ecosystem), CockroachDB / Spanner (SQL + horizontal scale).

**NoSQL flavors**:
| Type | Example | Use for |
|------|---------|---------|
| KV | DynamoDB, Redis | Session, config, hot lookups |
| Document | MongoDB | Nested objects, flexible schema |
| Wide-column | Cassandra, HBase | Time series, high write throughput |
| Graph | Neo4j | Relationship traversals (social, fraud) |

---

## Sharding

**When**: data or write throughput exceeds single-node capacity.

**Strategies**:
- **Range** — easy scans, hot-spot risk (e.g., latest tweets all hit one shard)
- **Hash** — even distribution, no range scans
- **Consistent hash** — minimal reshuffling on add/remove nodes
- **Directory** — lookup table maps key→shard; flexible but adds a hop

**Pick the shard key carefully**: high cardinality, matches your primary access pattern, avoids hot users.

**Watch**: cross-shard joins (avoid), rebalancing pain, hot shards.

---

## Replication

- **Leader-follower (single-leader)** — writes to one, reads from many. Default. Followers may lag → stale reads.
- **Multi-leader** — writes anywhere, conflict resolution needed. Multi-region actives.
- **Leaderless (Dynamo-style)** — quorum reads/writes (R+W>N). Eventual consistency + tunable.

**Sync vs async replication**:
- **Sync** — no data loss, higher write latency
- **Async** — fast writes, risk losing recent writes on failover

---

## Message Queue

**Use for**: decoupling, absorbing spikes, async processing, retries.

| Broker | Model | Use when |
|--------|-------|----------|
| **Kafka** | Log-based (durable, replayable) | High throughput, event sourcing, stream processing |
| **RabbitMQ** | Traditional queue (ack-based) | Task queues, complex routing |
| **SQS** | Managed queue | AWS default, dead simple |
| **Redis Streams / Pub-Sub** | In-memory | Low latency, willing to lose messages on crash |

**Guarantees to ask about**:
- Delivery: at-most-once / at-least-once / exactly-once
- Ordering: per-partition (Kafka) / none (SQS standard) / FIFO (SQS FIFO)
- Durability: replicated? disk-flushed?

**Don't**: forget the dead-letter queue for failed messages.

---

## CDN

**Use for**: static assets, video, geo-distributed reads, DDoS absorption.

- **Push** — you upload; CDN stores. Fine for small, rarely-changing assets.
- **Pull** — CDN fetches on first miss, caches per edge. Default for dynamic sites.

**Cache-Control** matters: `max-age`, `s-maxage`, `stale-while-revalidate`.

---

## Search

**Use for**: full-text, faceted, ranked queries. Don't do `LIKE '%foo%'` in your primary DB.

- **Elasticsearch / OpenSearch** — inverted index, near-real-time, faceting.
- **Meilisearch / Typesense** — small/medium apps, dev-friendly.
- **Postgres FTS** — good enough for <1M docs, saves ops overhead.

**Pattern**: primary DB is source of truth → CDC / async pipeline → search index.

---

## API Gateway

**Use for**: auth, rate limiting, request/response transformation, routing to services.

- Offload cross-cutting concerns from services.
- Don't put business logic here.
- Examples: Kong, Envoy, AWS API Gateway.

---

## Object Storage

**Use for**: blobs (images, videos, backups, logs).

- S3 / GCS / Azure Blob.
- Cheap, durable (11 nines), scales infinitely.
- **Don't** store metadata here — put it in a DB and reference the object URL.

---

## Coordination / Consensus

- **ZooKeeper / etcd / Consul** — distributed config, leader election, service discovery, distributed locks.
- **Raft / Paxos** — the algorithms under the hood.

If you say "we need a leader", mention "elected via Raft in etcd/ZK, with a lease".
