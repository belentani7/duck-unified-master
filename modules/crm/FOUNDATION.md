# DUCK ECOSYSTEM — FOUNDATION

## Non-negotiable architectural laws

### 1. Reference, don't replace
Existing repositories are preserved. Integration occurs through registry entries, contracts and adapters.

### 2. Contract before connector
No future integration gets privileged direct access to internal state. It must expose a declared adapter and capabilities.

### 3. Evidence before claim
The ecosystem never promotes a UI state into a factual claim. Execution requires evidence.

### 4. Explicit modes
Every capability is `real`, `simulated`, `planned`, or `unknown`. Mode must propagate into UI, events and reports.

### 5. Human approval at the boundary
Read-only and analysis operations may be automated according to policy. External side effects require explicit permissions and, where configured, human approval.

### 6. Event-first history
Meaningful actions emit immutable event records with actor, source, timestamp, trace ID, mode, result and provenance.

### 7. Provenance is first-class
Every imported capability, asset, claim and action can identify its origin and version.

### 8. Idempotency
Repeated commands must not create accidental duplicate side effects. Mutating actions require idempotency keys.

### 9. Least privilege
Adapters receive only the permissions needed for their declared capabilities.

### 10. Fail closed
If identity, permission, provenance or capability evidence is missing, the system refuses to claim success and falls back to simulation/planning where safe.

## Canonical domain model

`Actor → Intent → Plan → Capability → Resource → Action → Approval → Execution → Event → Provenance → State`

## Canonical actors

- human
- assistant
- agent
- system
- adapter
- external-service

## Canonical truth states

- `VERIFIED`: evidence available and current
- `OBSERVED`: directly observed but not independently verified
- `INFERRED`: derived from available evidence
- `SIMULATED`: modeled execution, no external side effect claimed
- `PLANNED`: intended future behavior
- `UNKNOWN`: insufficient evidence

## Canonical action lifecycle

`requested → validated → authorized → planned → started → executed | simulated | failed | rejected`

A lifecycle transition must be monotonic and auditable. A simulated action can never silently become an executed action.

## Adapter contract

Every adapter should declare:

```text
id
version
provider
repository
capabilities
mode
permissions
health
readOperations
writeOperations
sideEffects
idempotencySupport
provenanceSupport
```

## Security baseline

- secrets never committed to the repository
- credentials referenced by secret IDs, never plaintext
- RBAC and ownership enforced server-side
- external write operations denied by default
- audit events exclude unnecessary sensitive payloads
- webhook/event ingestion must validate origin/signature where supported
- adapters have explicit timeouts and failure states

## Compatibility

Contracts are versioned. Breaking changes require a new major contract version and a migration note. Additive changes should remain backward compatible.

## Definition of done for a new system

A system is not “integrated” because its name appears in the registry. It requires:

1. registry entry
2. declared capabilities
3. adapter or documented integration boundary
4. truth/mode declaration
5. provenance strategy
6. permission model
7. health check
8. event mapping
9. tests for success and failure
10. documentation

## Definition of done for a new UI feature

The feature must identify its source of truth, read/write operations, persistence, truth state, permission boundary and failure behavior. This extends the discipline already established in `OPERATION-MAP.md`.
