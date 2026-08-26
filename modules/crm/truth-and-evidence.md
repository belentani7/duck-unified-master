# Truth, Evidence and Provenance

Duck Ecosystem separates appearance from reality.

## Truth states

| State | Meaning |
|---|---|
| OBSERVED | Directly seen from a source but not independently verified |
| VERIFIED | Confirmed by an authoritative runtime/source |
| INFERRED | Derived from evidence; not directly confirmed |
| SIMULATED | Demonstrated inside the ecosystem without external execution |
| PROPOSED | Design intention |
| UNKNOWN | No sufficient evidence |

## Evidence levels

`E0` no evidence
`E1` documentation/reference
`E2` source inspection
`E3` successful runtime check
`E4` external side effect independently confirmed

Claims about real-world side effects should normally require E3/E4.

## Provenance minimum

```text
source
ref
commit/version
resource/path
adapter
adapterVersion
retrievedAt
traceId
truth
```

## Anti-fabrication rule

A polished interface is never evidence of a working capability. A README is never evidence of runtime state. A generated file is never evidence of an external side effect.
