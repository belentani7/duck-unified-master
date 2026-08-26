# DUCK ECOSYSTEM — BUILD ROADMAP

## Phase 0 — Foundation

- [x] Registry with original repositories preserved
- [x] REAL / SIMULATED / PLANNED modes
- [x] Operation map
- [x] Visual DNA
- [x] Landing-page narrative
- [x] Foundation laws
- [ ] Canonical JSON schemas
- [ ] Contract test suite

## Phase 1 — Canonical runtime

- Intent schema
- Resource schema
- Capability schema
- Action schema
- Approval schema
- Event schema
- Provenance schema
- Truth-state schema
- Correlation/trace IDs
- Idempotency keys

## Phase 2 — Registry and adapters

- Adapter SDK
- health checks
- capability discovery
- permission declaration
- repository provenance
- adapter conformance tests
- read-only first integration for each system

## Phase 3 — Event and memory layer

- append-oriented event ledger
- project memory
- resource graph
- provenance index
- replayable execution traces
- retention policy
- redaction policy

## Phase 4 — Orchestrator

- intent parser
- capability resolver
- deterministic planner
- policy engine
- approval gates
- executor
- simulation engine
- failure recovery

## Phase 5 — Music machine

First canonical end-to-end scenario:

`prepare_track_for_duck`

Expected path:

`Intent → Project → Versions → Stems → Analysis → Plan → Approval → Production action → Delivery → Audit`

Only real integrations are marked REAL. Everything else remains SIMULATED.

## Phase 6 — Tool ecosystem

Expose the same contracts to:

- Codex
- Claude
- OpenHands
- local agents
- future AION agents

No tool-specific business logic in the core.

## Phase 7 — Visual operating layer

- cinematic landing page
- ecosystem map
- live/simulated system constellation
- project command center
- event stream
- provenance viewer
- approval console
- adapter health
- truth inspector

## Phase 8 — Local / DAW integration

- workstation adapter
- plugin inventory
- DAW project bridge
- local analysis
- render/export actions
- safe write permissions

## Phase 9 — Production hardening

- threat model
- rate limits
- secret management
- observability
- backup/restore
- migration strategy
- contract compatibility tests
- disaster recovery

## Guiding principle

Do not add features merely because they look impressive. Every feature must make the machine more useful, more truthful, more interoperable or safer.
