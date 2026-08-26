# Canonical Contract Model

This is the shared language between every future tool and adapter.

## Intent

```json
{
  "intentId": "intent_<unique>",
  "actorId": "duck|belentani|agent:<id>",
  "goal": "prepare_track_for_duck",
  "context": {"projectId": "..."},
  "constraints": [],
  "approval": "auto|human_required",
  "truth": "OBSERVED"
}
```

## Plan

```json
{
  "planId": "plan_<unique>",
  "intentId": "...",
  "steps": [
    {"stepId":"1","capability":"studio.project.read","action":"READ","mode":"real"}
  ],
  "risk":"low|medium|high",
  "requiresApproval": true
}
```

## Action

Every action declares capability, target, mode, permissions and idempotency key.

## Event

```json
{
  "eventId":"evt_<unique>",
  "type":"action.executed",
  "occurredAt":"ISO-8601",
  "actorId":"...",
  "systemId":"...",
  "actionId":"...",
  "traceId":"...",
  "truth":"VERIFIED",
  "payload":{},
  "provenance":{}
}
```

## Provenance

Every external result should identify repository/system, ref, commit when available, path/resource identifier, adapter version and retrieval/execution timestamp.

## Capability naming

Use dotted, stable, domain-oriented names:

- `studio.project.read`
- `studio.project.create`
- `studio.track.read`
- `studio.stem.read`
- `studio.version.create`
- `studio.comment.create`
- `studio.analysis.run`
- `studio.delivery.prepare`
- `local.daw.open`
- `local.daw.render`
- `local.plugin.inspect`
- `gema.toolkit.use`
- `zion.experience.render`
- `ai.analysis.run`
- `ai.agent.plan`
- `ecosystem.event.emit`

Capabilities describe what a system can do; they do not grant permission to do it.

## Compatibility

Contracts are versioned. Breaking changes require a new major version and an explicit migration document.
