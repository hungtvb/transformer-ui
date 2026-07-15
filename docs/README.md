# PROJECT TITAN — Documentation Hub

> The browser is not your window. It is theirs.

PROJECT TITAN is an interactive cinematic WebGL experience built around presence, physical interaction, mystery, and first contact with a colossal living machine. This documentation is the single source of truth for product, story, design, engineering, production, and AI-assisted development decisions.

## Current product state

The repository currently contains two playable vertical slices:

- **Sprint Alpha — Station Awakening**: calibration, power restoration, signal tuning, and the first visual reveal.
- **Sprint Beta — Tracking & Contact**: radar tracking, target lock, hand-to-glass synchronization, and deliberate response from the entity.

These sprints prove the core premise, but they are not yet the final experience. The project is transitioning from a compact Three.js prototype into a structured experience engine with clear creative direction, production rules, and performance budgets.

## Documentation structure

### Foundation

- [`vision/00_VISION.md`](vision/00_VISION.md) — North Star, product identity, emotional goals, success metrics, and non-goals.
- [`vision/01_EXPERIENCE_PRINCIPLES.md`](vision/01_EXPERIENCE_PRINCIPLES.md) — Mandatory design principles for story, interaction, motion, UI, audio, and platform behavior.
- [`production/ROADMAP.md`](production/ROADMAP.md) — Milestones from the current vertical slice to public v1.0.

### Planned design documentation

- Story and act structure
- Gameplay and interaction bible
- Emotion curve
- Art, camera, motion, and audio bibles
- World and entity lore

### Planned technical documentation

- Experience architecture
- State machine
- Render pipeline
- Asset pipeline
- Performance budgets
- Mobile adaptation
- Accessibility strategy

### Planned production documentation

- Sprint audit history
- Product backlog
- Definition of Done
- Review scorecard
- PR checklist
- AI agent guide
- Release checklist

## How to use these documents

Every meaningful feature must reference at least one foundation document before implementation.

A feature is valid only when it can answer:

1. What emotion is it designed to create?
2. What user action unlocks or influences it?
3. What feedback makes that action feel physical?
4. What consequence changes the world or story?
5. What is the performance and accessibility cost?
6. Which roadmap milestone owns it?

Features that cannot answer these questions should remain in ideation rather than enter production.

## Product language

Use these terms consistently:

- **Experience**: the complete interactive work, not a website or landing page.
- **Station**: the user’s physical point of view and primary playable environment.
- **Entity**: the colossal machine outside the station. Its final name and lore are intentionally unresolved.
- **Mission**: one focused interaction objective, such as restoring power or tracking a signal.
- **Act**: a narrative phase containing one or more missions.
- **World UI**: controls, monitors, radar, levers, lights, glass, and readouts that exist inside the fiction.
- **Overlay UI**: browser-level interface placed above the world. Use only when required for accessibility, calibration, legal text, or recovery.
- **Presence**: the feeling that the entity exists independently and is aware of the user.
- **Consequence**: a visible, audible, or narrative change caused by user input.

## Decision hierarchy

When documents or implementation ideas conflict, use this priority order:

1. User safety and accessibility
2. Vision and emotional intent
3. Interaction clarity
4. Story continuity
5. Performance and platform stability
6. Visual spectacle
7. Implementation convenience

Visual quality never overrides usability, comfort, or performance.

## Development workflow

The expected production flow is:

```text
Creative Brief
    ↓
Experience Design
    ↓
Prototype
    ↓
Playable Vertical Slice
    ↓
Review and Measurement
    ↓
Refactor
    ↓
Production
    ↓
Polish
    ↓
Release
```

Large features must not skip the prototype and vertical-slice stages.

## Current engineering constraints

The current implementation is intentionally lightweight and procedural. The final production version will require a modular architecture and better asset quality.

Current constraints include:

- Most scene geometry is procedural Three.js geometry.
- Core logic remains concentrated in a small number of files.
- Sound is synthesized with Web Audio rather than built from a complete cinematic asset library.
- Visual fidelity is limited by the absence of production-ready models, PBR textures, authored animation, and environmental assets.
- Mobile currently receives reduced visual complexity rather than a fully authored platform-specific interaction path.

These constraints are acceptable for vertical slices but not for v1.0.

## Quality gate

Every sprint is reviewed on a 100-point scorecard:

| Category | Weight |
|---|---:|
| First impression | 20 |
| Interaction | 20 |
| Storytelling | 15 |
| Visual quality | 15 |
| Motion and physicality | 10 |
| Audio | 5 |
| Performance | 5 |
| Accessibility | 5 |
| Code quality | 5 |

A production sprint should not be considered complete below **85/100**, unless the sprint is explicitly labeled as an experiment or technical spike.

## Status labels

- **Idea** — not validated.
- **Prototype** — validates a mechanic or emotion.
- **Vertical Slice** — complete enough to judge the final direction.
- **Production** — approved architecture and quality target.
- **Polish** — final tuning, optimization, and accessibility work.
- **Released** — production-ready and monitored.

## Contribution rule

Before editing experience code, read:

1. `vision/00_VISION.md`
2. `vision/01_EXPERIENCE_PRINCIPLES.md`
3. `production/ROADMAP.md`

Future AI coding agents must also read the planned `production/AI_AGENT_GUIDE.md` once available.
