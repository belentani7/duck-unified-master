# Canonical Demonstrations

These scenarios are the acceptance tests for the ecosystem narrative.

## 01 — Prepare a track for Duck

Intent: prepare a selected song for production review.

Expected flow:

`identify project → inspect versions → inspect stems → analyze → propose plan → approval → execute/simulate → create result → audit`

## 02 — Review a mix

`project → latest version → analysis → findings → timestamp comments → task creation → event`

## 03 — Deliver to client

`approved version → delivery package → portal → notification → provenance`

## 04 — Local studio action

`intent → local capability discovery → DAW/plugin adapter → permission → action → verification`

## 05 — AI-assisted production

`creative request → context retrieval → agent planning → human approval → specialist capability → result → memory`

## 06 — Capability unavailable

The system must show `SIMULATED` or `PLANNED`, never fake execution.

## 07 — Failure recovery

A failed adapter emits a failure event and leaves the source state intact. Retry must be safe where the action is idempotent.
