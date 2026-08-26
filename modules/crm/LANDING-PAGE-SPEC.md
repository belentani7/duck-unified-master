# DUCK ECOSYSTEM — LANDING PAGE SPEC

## Purpose

The landing page is the visual map for humans and future coding agents. It must explain the ecosystem before exposing implementation detail.

## Hero

**DUCK ECOSYSTEM**

**THE CREATIVE MACHINE.**

_Subtitle:_ A unified operating context for music production, creative tools, local systems and intelligent automation — without replacing the systems that already work.

Primary CTA: `ENTER THE MACHINE`
Secondary CTA: `VIEW ARCHITECTURE`

Hero visual: dark studio/control-room scene transformed into a living systems diagram. Avoid generic AI imagery.

## Section A — The problem

“Your studio is already built. It is just distributed.”

Show independent nodes: Studio Pro, Zion, Gema, Local, Omega, AION, existing repositories and future tools. Lines should initially be disconnected.

## Section B — The thesis

“Duck Ecosystem does not merge everything into one giant application. It gives existing systems a common language.”

Animation: nodes retain their identities while a central contract layer appears.

## Section C — The machine

Display a cinematic pipeline:

`INTENT → MEMORY → PLAN → CAPABILITIES → APPROVAL → ADAPTERS → ACTION → EVENTS → PROVENANCE → MEMORY`

Each stage expands on hover/focus with its contract name and purpose.

## Section D — System constellation

Cards:

- DUCK STUDIO — projects, stems, versions, comments, delivery
- ZION — experience, portal, presentation, automation
- GEMA — creative toolkit and instruments
- LOCAL — workstation, plugins, local knowledge
- OMEGA — reasoning and automation
- AION — agents and orchestration
- NOIACORE — experimentation and AI laboratory

Every card must show repository, domain, capabilities, mode and evidence status.

## Section E — One intent, many systems

Demo scenario:

“Prepare a track for Duck.”

The page animates the intent into a plan, discovers project/stem/version capabilities, checks approval, calls adapters, emits events and produces an auditable result.

The demo must be deterministic and honest. If execution is simulated, the UI says `SIMULATED` everywhere relevant.

## Section F — Reality layer

Large three-way state display:

REAL — connected and evidence-backed.
SIMULATED — executable model without pretending to have external side effects.
PLANNED — defined future capability.

Optional fourth state: UNKNOWN — evidence missing.

## Section G — The archive principle

**REFERENCE. DON'T REPLACE.**

Original repositories remain authoritative. Duck Ecosystem stores identity, contracts, relationships, provenance and orchestration; it does not silently fork or absorb source systems.

Visual: original repositories remain as independent physical modules connected by a central bus.

## Section H — Built for other tools

“Claude. Codex. OpenHands. Local agents. Future tools.”

All enter through the same contracts. The landing page should visualize a tool entering through `Intent / Capability / Action / Event / Provenance / Approval` rather than getting direct database access.

## Section I — Trust layer

Show a provenance chain:

`CLAIM → SOURCE → VERSION → EVIDENCE → TRACE → RESULT`

Explain that the ecosystem refuses to convert UI into evidence. A rendered card is not proof of execution.

## Section J — Developer surface

Expose links/labels for:

- Visual DNA
- Architecture
- Contracts
- Registry
- Operation Map
- Truth Model
- Adapter SDK
- Event Model
- Security Model
- Roadmap

## Closing

**ONE CREATIVE SYSTEM. MANY INSTRUMENTS.**

“Keep the originals. Connect the capabilities. Make the machine useful.”

CTA: `OPEN DUCK ECOSYSTEM`

## Responsive behavior

Desktop: cinematic control-room composition.
Tablet: constellation collapses to structured cards.
Mobile: vertical story; no horizontal overflow; machine pipeline becomes a vertical sequence.

## Implementation rules

- Respect `docs/VISUAL-DNA.md`.
- Reuse existing design tokens before adding new ones.
- No fake live data.
- No irreversible mutation from the landing page.
- Every interactive demo has a deterministic fallback.
- Reduced-motion mode replaces animation with state transitions.
