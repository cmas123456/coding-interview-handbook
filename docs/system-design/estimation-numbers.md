# Estimation Numbers

> Memorize these. Recite them mid-interview to make your estimates credible.

---

## Latency numbers every SWE should know

| Operation | Time | Mental model |
|-----------|------|--------------|
| L1 cache reference | 0.5 ns | Instant |
| Branch mispredict | 5 ns | |
| L2 cache reference | 7 ns | |
| Mutex lock/unlock | 25 ns | |
| Main memory reference | 100 ns | 200x L1 |
| Compress 1KB (Zippy) | 3 μs | |
| Send 1KB over 1 Gbps | 10 μs | |
| Read 4KB from SSD | 150 μs | |
| Read 1MB sequentially from memory | 250 μs | |
| Round trip within same datacenter | **500 μs** | ← anchor |
| Read 1MB sequentially from SSD | 1 ms | |
| Disk seek (spinning) | 10 ms | |
| Read 1MB sequentially from spinning disk | 20 ms | |
| **Round trip US East ↔ US West** | **70 ms** | ← anchor |
| **Round trip US ↔ Europe** | **150 ms** | ← anchor |

**Rules of thumb**:
- Memory: **~ns**
- SSD: **~100 μs**
- Same-DC network: **~ms**
- Cross-continent network: **~100 ms**

---

## Powers of 2 / 10

| Power of 2 | Value | ≈ Power of 10 |
|-----------|-------|---------------|
| 2^10 | 1,024 | 10^3 (thousand, KB) |
| 2^20 | ~1M | 10^6 (million, MB) |
| 2^30 | ~1B | 10^9 (billion, GB) |
| 2^32 | ~4B | (max unsigned int) |
| 2^40 | ~1T | 10^12 (trillion, TB) |
| 2^50 | ~1000T | 10^15 (PB) |

---

## Time cheatsheet

| Interval | Seconds |
|----------|---------|
| 1 minute | 60 |
| 1 hour | 3,600 |
| 1 day | **86,400** ≈ 10^5 |
| 1 month (30d) | ~2.5M ≈ 2.5 × 10^6 |
| 1 year | ~31.5M ≈ 3 × 10^7 |

---

## QPS math (do it in your head)

**Trick**: `QPS = daily_events / 86,400 ≈ daily_events / 10^5`

| Daily events | Avg QPS | Peak QPS (3x) |
|--------------|---------|---------------|
| 1M | 12 | 36 |
| 10M | 116 | 350 |
| 100M | 1,160 | 3,500 |
| 1B | 11,600 | 35,000 |
| 10B | 116,000 | 350,000 |

**Assume peak = 2–3x average** unless told otherwise.

---

## Storage math

Template:
```
DAU × actions_per_user × bytes_per_action × retention_days
```

Example — 100M DAU, 10 posts/day, 1KB per post, 5 years:
```
100M × 10 × 1KB × 365 × 5 = 1.8 PB
```

**Multiplier for indexes + replication (×3)**: ~5.5 PB total storage cost.

---

## Bandwidth math

**Per-request bandwidth**: `QPS × avg_bytes`

Example — 10K QPS × 5KB response = 50 MB/s = **400 Mbps** egress.

Common numbers:
- 1 Gbps ≈ 125 MB/s
- 10 Gbps ≈ 1.25 GB/s
- A modern server NIC: 10-40 Gbps

---

## Single-machine capacity rules of thumb

| Component | Ballpark |
|-----------|----------|
| CPU cores per server | 16–64 |
| RAM per server | 64–512 GB |
| SSD per server | 1–10 TB |
| Nginx QPS (static) | 50K+ |
| Web app QPS (JSON) | 1K–10K per instance |
| Postgres writes/sec | 10K–50K (single node) |
| Postgres reads/sec | 100K+ (with read replicas) |
| Redis ops/sec | 100K+ per instance |
| Kafka throughput | 100K+ msg/sec per broker |

**Read**: "How many machines do I need?" → total QPS ÷ per-machine capacity, then ×1.5 headroom.

---

## Availability

| SLA | Downtime/year | Downtime/month |
|-----|---------------|----------------|
| 99% | 3.65 days | 7.2 hours |
| 99.9% ("three 9s") | 8.76 hours | 43.2 min |
| 99.99% ("four 9s") | 52.6 min | 4.3 min |
| 99.999% ("five 9s") | 5.26 min | 26 sec |

**Rule**: adding a 9 = 10x harder + 10x more cost.

---

## Character/byte sizing

- 1 ASCII char = 1 byte
- 1 UTF-8 char = 1–4 bytes (assume 2 for mixed content)
- Tweet (280 chars) ≈ 300 bytes
- Typical JSON object ≈ 500 B – 2 KB
- Thumbnail image ≈ 20–50 KB
- Full-res photo ≈ 500 KB – 5 MB
- 1 min HD video ≈ 50 MB
- 1 min 4K video ≈ 300 MB
