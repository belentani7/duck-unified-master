# Adapter Specification v1

An adapter is the only sanctioned bridge between Duck Ecosystem and an external repository, application, device or service.

## Required manifest

```json
{
  "adapterVersion":"1.0.0",
  "systemId":"duck-studio-pro",
  "repository":"belentani7/duck-full-studio-pro",
  "mode":"simulated",
  "capabilities":[],
  "permissions":{"read":true,"write":false},
  "health":"unknown",
  "preserveOriginal":true
}
```

## Required behavior

1. Never silently mutate the source system.
2. Never claim an action executed unless verified.
3. Return canonical errors.
4. Emit an event for consequential actions.
5. Include provenance in results.
6. Respect ecosystem policy and approval requirements.
7. Support dry-run/simulation where possible.
8. Be idempotent for retriable mutations.

## Adapter lifecycle

`DISCOVER → REGISTER → HEALTHCHECK → AUTHORIZE → INVOKE → VERIFY → EMIT → CLOSE`

## Health states

`healthy`, `degraded`, `offline`, `unauthorized`, `unknown`.

## Security boundary

Credentials belong to the adapter/runtime environment, never to prompts, manifests or generated documentation. Do not commit secrets.
