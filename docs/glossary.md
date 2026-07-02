# Glossary

> Acronyms used across this handbook, grouped by category. Ctrl-F to look up; skim before an interview.

---

## Interview / process

| Acronym | Full form | What it means |
|---------|-----------|---------------|
| **STAR** | Situation, Task, Action, Result | Behavioral answer structure. Upgrade for senior: add trade-offs + reflection. |
| **HM** | Hiring Manager | The person you'd report to. Second round, usually behavioral. |
| **JD** | Job Description | The posting. Mine your talking points from it. |
| **IC** | Individual Contributor | Engineer track (vs. management). Staff/Principal/Distinguished. |
| **SDE / SWE** | Software Development / Software Engineer | Same role, different companies. Microsoft = SDE, Google/Meta = SWE. |
| **JTBD** | Jobs To Be Done | Product framework: "what job is the user hiring the product to do?" |

---

## System-design fundamentals

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **QPS** | Queries Per Second | Request rate. Anchor: 100M events/day ≈ 1,160 avg QPS, ~3,500 peak. |
| **TPS** | Transactions Per Second | Same as QPS for write-heavy systems. |
| **RPS** | Requests Per Second | Same as QPS. |
| **DAU / MAU** | Daily / Monthly Active Users | Scale anchor. Ratio DAU:MAU = stickiness. |
| **SLA** | Service Level Agreement | Contractual uptime (e.g. 99.9%). |
| **SLO** | Service Level Objective | Internal target, usually tighter than SLA. |
| **SLI** | Service Level Indicator | The metric you measure (e.g. p99 latency). |
| **RTT** | Round Trip Time | Full network round-trip. Same-DC ~500μs, cross-continent ~150ms. |
| **RPO** | Recovery Point Objective | Max data loss you'll tolerate in a disaster. |
| **RTO** | Recovery Time Objective | Max downtime you'll tolerate in a disaster. |
| **p50 / p99 / p999** | 50th / 99th / 99.9th percentile | Latency at that percentile. p99 = 1% of requests are slower. |
| **TTL** | Time To Live | How long a cache entry / DNS record / token stays valid. |
| **CRUD** | Create, Read, Update, Delete | Basic DB operations. |
| **ETL** | Extract, Transform, Load | Batch data-pipeline pattern. |
| **CDC** | Change Data Capture | Stream DB changes to downstream consumers (search index, cache, warehouse). |

---

## Distributed systems theory

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **ACID** | Atomicity, Consistency, Isolation, Durability | Transactional DB guarantees. |
| **BASE** | Basically Available, Soft state, Eventual consistency | NoSQL-friendly alternative to ACID. |
| **CAP** | Consistency, Availability, Partition-tolerance | Pick 2 of 3 during a network partition. In practice: CP or AP. |
| **PACELC** | Partition → A or C, Else → Latency or Consistency | CAP extended for the non-partition case. |
| **CRDT** | Conflict-free Replicated Data Type | Data structure that merges cleanly across replicas without coordination. |
| **2PC** | Two-Phase Commit | Distributed transaction protocol. Prepare → commit. Blocks on coordinator failure. |
| **3PC** | Three-Phase Commit | 2PC + timeout phase. Rarely used. |
| **MVCC** | Multi-Version Concurrency Control | Postgres/InnoDB: reads see a snapshot, writes create new versions. Enables readers-don't-block-writers. |
| **WAL** | Write-Ahead Log | DB durability mechanism: log the intent before applying. |
| **LSM** | Log-Structured Merge tree | Storage engine (Cassandra, RocksDB). Write-optimized. |
| **B-tree** | Balanced tree | Storage engine (Postgres, MySQL InnoDB). Read-optimized. |

---

## Infrastructure / networking

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **LB** | Load Balancer | Distributes traffic across backends. L4 = TCP, L7 = HTTP. |
| **L4 / L7** | OSI Layer 4 / 7 | Transport (TCP) vs. Application (HTTP). |
| **CDN** | Content Delivery Network | Edge cache for static (and some dynamic) content. |
| **DNS** | Domain Name System | Name → IP resolution. |
| **TLS / SSL** | Transport Layer Security / Secure Sockets Layer | HTTPS encryption. SSL is the old name. |
| **VPC** | Virtual Private Cloud | Isolated network in cloud. |
| **NAT** | Network Address Translation | Maps private IPs to public. |
| **CIDR** | Classless Inter-Domain Routing | IP range notation (e.g. `10.0.0.0/16`). |
| **NIC** | Network Interface Card | Physical/virtual network adapter. Server NICs: 10-40 Gbps. |
| **DDoS** | Distributed Denial of Service | Traffic-flooding attack. Mitigate at CDN/edge. |
| **NLB / ALB** | Network / Application Load Balancer | AWS: NLB = L4, ALB = L7. |
| **API** | Application Programming Interface | The contract between systems. |
| **REST** | Representational State Transfer | HTTP + resources + verbs. Default web API style. |
| **RPC** | Remote Procedure Call | Function-call style over network (gRPC, Thrift). |
| **gRPC** | Google RPC | Protobuf-based RPC. Efficient, typed, bidirectional streams. |
| **HTTP** | Hypertext Transfer Protocol | Web protocol. HTTP/1.1, HTTP/2, HTTP/3. |
| **JSON** | JavaScript Object Notation | Default web-API data format. |
| **XML** | Extensible Markup Language | Older data format. Still used in SOAP, config files. |

---

## Data / storage

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **SQL** | Structured Query Language | Relational DB query language. Also shorthand for "relational DB". |
| **NoSQL** | Not Only SQL | Non-relational DBs (KV, document, wide-column, graph). |
| **KV** | Key-Value | Simplest data model. Redis, DynamoDB, Memcached. |
| **OLTP** | Online Transaction Processing | Row-oriented, low-latency, transactional (Postgres, MySQL). |
| **OLAP** | Online Analytical Processing | Column-oriented, batch analytics (Snowflake, BigQuery, Redshift). |
| **KB / MB / GB / TB / PB** | Kilo / Mega / Giga / Tera / Peta byte | Powers of 10^3. Or 2^10, 2^20, ... in binary. |
| **IOPS** | Input/Output Operations Per Second | Storage throughput metric. SSD ~10K-100K, NVMe ~1M. |
| **SSD / HDD** | Solid State Drive / Hard Disk Drive | SSD ~100μs, HDD ~10ms seek. |
| **RAID** | Redundant Array of Inexpensive Disks | RAID 1 mirror, RAID 5/6 parity, RAID 10 mirror+stripe. |

---

## Cloud (AWS / Azure / GCP)

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **IAM** | Identity and Access Management | Who can do what. AWS IAM, Azure RBAC, GCP IAM. |
| **RBAC** | Role-Based Access Control | Permissions via roles. |
| **VM** | Virtual Machine | EC2 in AWS, VM in Azure, Compute Engine in GCP. |
| **EC2 / ECS / EKS** | Elastic Compute Cloud / Container Service / Kubernetes Service | AWS compute tiers. |
| **S3 / GCS / Blob** | Simple Storage Service / Google Cloud Storage / Azure Blob | Object storage. |
| **SQS / SNS** | Simple Queue Service / Simple Notification Service | AWS queue / pub-sub. |
| **RDS** | Relational Database Service | AWS managed SQL. |
| **DDB** | DynamoDB | AWS managed NoSQL KV. |
| **CDN / EDN** | Content / Edge Delivery Network | CloudFront (AWS), Fastly, Cloudflare, Akamai. |
| **AZ** | Availability Zone | Isolated datacenter within a region. 3 AZs per region typical. |
| **CI / CD** | Continuous Integration / Continuous Delivery (or Deployment) | Automated build + test + release. |

---

## Auth / identity (relevant for interviews and your MS background)

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **AAD / Entra** | Azure Active Directory (renamed Entra ID) | Microsoft's cloud identity provider. |
| **MSA** | Microsoft Account | Consumer identity (outlook.com, hotmail, etc.). Distinct from AAD. |
| **AltSecId** | Alternative Security Identifier | Non-primary identity claim, e.g., MSA puid in an AAD context. |
| **IW** | Individual (User) | In M365 signup: an "IW" (individual worker) user, contrasted with "Org" (organization) user. Different billing account type. |
| **MFA** | Multi-Factor Authentication | Password + second factor (authenticator app, SMS, hardware key). |
| **SSO** | Single Sign-On | One login → many apps. |
| **OIDC** | OpenID Connect | Auth layer on top of OAuth 2.0. JSON-native. |
| **OAuth** | Open Authorization | Authorization framework (grant scoped access). Not authentication by itself. |
| **SAML** | Security Assertion Markup Language | XML-based SSO protocol. Older, enterprise-heavy. |
| **WS-Fed** | WS-Federation | Microsoft SSO protocol predating OIDC. Enterprise-heavy. |
| **JWT** | JSON Web Token | Signed token: header.payload.signature. |
| **JWK / JWKS** | JSON Web Key / Key Set | Public keys published by an OIDC provider to verify JWT signatures. |
| **kid** | Key ID | JWT header field pointing to which JWK signed the token. |
| **PKCE** | Proof Key for Code Exchange | OAuth extension protecting the auth-code flow for public clients. |
| **puid** | Passport Unique ID | Stable MSA user identifier. |
| **oid / upn** | Object ID / User Principal Name | AAD user identifiers. |
| **iss / aud / sub** | Issuer / Audience / Subject | Standard JWT claims. |

---

## Microsoft-internal (from your background — cite naturally, don't over-explain)

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **M365** | Microsoft 365 | The Office + Teams + Windows + security bundle. |
| **PR** | Pull Request | Code review unit. |
| **PPE** | Pre-Production Environment | Staging tier before PROD. |
| **PRV** | Production Validation | Post-deploy verification in PROD. |
| **EV2** | Express V2 | Microsoft's internal deployment orchestrator. |
| **ARM** | Azure Resource Manager | Azure's deployment/config plane. |
| **ADO** | Azure DevOps | Repos, boards, pipelines. |
| **WI** | Work Item | ADO ticket (bug, task, deliverable). |
| **1P / 3P** | First-party / Third-party | 1P = Microsoft-owned app; 3P = external. |
| **CWE** | Common Weakness Enumeration | Standardized security-flaw taxonomy (e.g., CWE-346 = origin validation error). |

**How to handle these in an Edmentum/non-MS interview**: expand once, then use the acronym. E.g., "MSA — Microsoft Account, the consumer identity — is distinct from AAD, which is enterprise." After that they'll follow along. Don't assume they know; don't over-explain either.

---

## Observability / monitoring

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **OTel** | OpenTelemetry | Vendor-neutral tracing/metrics/logs SDK + protocol. |
| **APM** | Application Performance Monitoring | End-to-end tracing (Datadog, New Relic, Dynatrace). |
| **SIEM** | Security Information and Event Management | Security log aggregation + alerting. |
| **MTTR** | Mean Time To Recovery (or Repair, or Resolve) | Avg incident duration. Lower = better. |
| **MTBF** | Mean Time Between Failures | Avg uptime between incidents. Higher = better. |
| **SRE** | Site Reliability Engineering | Google-originated ops discipline. Error budgets, SLOs, toil reduction. |
| **RCA** | Root Cause Analysis | Post-incident writeup. |

---

## Software engineering / architecture

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **DDD** | Domain-Driven Design | Model software around business domain; bounded contexts, aggregates, ubiquitous language. |
| **CQRS** | Command Query Responsibility Segregation | Separate read model from write model. Pairs well with event sourcing. |
| **DRY** | Don't Repeat Yourself | Consolidate duplication. Overapplied → tight coupling. |
| **YAGNI** | You Aren't Gonna Need It | Don't build for imagined future needs. |
| **KISS** | Keep It Simple, Stupid | Prefer simple designs. |
| **SOLID** | Single-resp / Open-closed / Liskov / Interface-seg / Dependency-inv | OO design principles. |
| **TDD / BDD** | Test-Driven / Behavior-Driven Development | Tests first (TDD) or scenario-based tests (BDD). |
| **MVP** | Minimum Viable Product | Smallest thing that validates the hypothesis. |
| **POC** | Proof of Concept | Throwaway prototype to prove feasibility. |

---

## Common ML / data (in case they come up)

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **ML** | Machine Learning | Models trained on data. |
| **LLM** | Large Language Model | Transformer-based text model (GPT, Claude). |
| **RAG** | Retrieval-Augmented Generation | Fetch docs → stuff into LLM prompt → generate. |
| **A/B** | A/B test | Split-traffic experiment. |
| **KPI** | Key Performance Indicator | The metric leadership cares about. |

---

## Accessibility (relevant to your Edmentum pitch)

| Acronym | Full form | One-liner |
|---------|-----------|-----------|
| **a11y** | Accessibility | "a" + 11 letters + "y". Same for i18n (internationalization), l10n (localization), k8s (Kubernetes). |
| **WCAG** | Web Content Accessibility Guidelines | The a11y spec. Levels A, AA, AAA. |
| **ARIA** | Accessible Rich Internet Applications | HTML attributes for a11y semantics. |
| **508** | Section 508 (US Rehabilitation Act) | US federal a11y requirement — matters for ed-tech / gov contracts. |
