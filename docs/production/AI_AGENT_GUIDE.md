# AI Agent Guide

## Purpose

This guide defines how AI coding agents should contribute to PROJECT TITAN without weakening its narrative, interaction quality, technical stability, or visual identity.

AI agents are implementation collaborators, not autonomous product owners. They may propose improvements, but every change must remain consistent with the existing vision, design, and technical documents.

## Source of Truth

Before changing code or documentation, read the relevant files in this order:

1. `docs/vision/00_VISION.md`
2. `docs/vision/01_EXPERIENCE_PRINCIPLES.md`
3. `docs/design/STORY.md`
4. `docs/design/GAMEPLAY.md`
5. `docs/design/CAMERA_BIBLE.md`
6. `docs/design/MOTION_BIBLE.md`
7. `docs/design/ART_BIBLE.md`
8. `docs/design/EMOTION_CURVE.md`
9. `docs/technical/ARCHITECTURE.md`
10. `docs/technical/STATE_MACHINE.md`
11. `docs/technical/PERFORMANCE.md`
12. `docs/technical/ACCESSIBILITY.md`
13. `docs/production/ROADMAP.md`

When documents conflict, prefer the file with the narrower scope. If ambiguity remains, preserve current behavior and document the conflict instead of guessing.

## Core Working Rules

### Preserve the experience

Every implementation must support at least one of these outcomes:

- strengthen mystery;
- improve physical interaction;
- clarify feedback without over-explaining;
- increase presence, tension, or trust;
- improve performance, accessibility, or maintainability.

Do not add features merely because they are technically impressive.

### Avoid generic sci-fi output

Do not introduce:

- random neon gradients;
- excessive holographic UI;
- decorative particles without narrative purpose;
- generic military HUD language;
- noisy glitch effects;
- exposition-heavy dialogue;
- cinematic camera movement that removes user control.

PROJECT TITAN should feel restrained, tactile, industrial, and intentional.

### Work in small reversible changes

Prefer one focused change per commit or pull request. Avoid combining architecture changes, visual redesigns, gameplay changes, and content rewrites in a single patch.

A good change can be reviewed, tested, and reverted independently.

## Required Workflow

### 1. Inspect before editing

Before modifying a file:

- read the complete file;
- identify related state transitions and event handlers;
- check whether tests or documentation already cover the behavior;
- search for duplicate or legacy implementations;
- confirm keyboard, pointer, touch, reduced-motion, and visibility-state implications.

Never replace a subsystem based only on a partial snippet.

### 2. State the intended change internally

The agent should be able to summarize the patch in one sentence:

> Change X so that Y improves, while preserving Z.

If the change cannot be summarized clearly, split it.

### 3. Implement against explicit acceptance criteria

For every meaningful change, define observable success conditions before coding.

Examples:

- the power lever responds to pointer and keyboard input;
- contact progress resets safely on `pointercancel`;
- hidden tabs stop nonessential rendering and audio work;
- reduced-motion mode removes large camera movement while preserving state feedback.

### 4. Validate locally

At minimum, verify:

- the application starts without console errors;
- the full critical path remains completable;
- no state can be entered twice accidentally;
- no timers or listeners leak across transitions;
- pointer and keyboard controls both work;
- responsive layouts remain usable;
- reduced-motion behavior remains functional;
- performance does not regress materially.

### 5. Update documentation

Update documentation when a change affects:

- state transitions;
- gameplay rules;
- input behavior;
- camera or motion language;
- visual language;
- accessibility behavior;
- performance budgets;
- project milestones.

Code and docs must not describe different products.

## Coding Standards

### State management

- All major experience phases must be represented by explicit states.
- State transitions must be centralized and auditable.
- Avoid hidden state encoded only in DOM classes, timer existence, or animation callbacks.
- Transition functions must be idempotent where practical.
- Reject invalid transitions rather than silently forcing them.

### Events and input

- Use named handlers instead of anonymous listeners for lifecycle-managed events.
- Clean up listeners, timers, animation frames, and audio nodes.
- Handle `pointerup`, `pointercancel`, and `lostpointercapture` consistently.
- Do not assume mouse-only input.
- Keyboard controls must produce the same logical outcome as pointer controls.
- Prevent repeated activation while an action is already resolving.

### Animation

- Motion must communicate state, weight, hierarchy, or consequence.
- Prefer timeline-based transitions for sequences with dependencies.
- Avoid overlapping transitions that fight over the same properties.
- Respect `prefers-reduced-motion`.
- Avoid frame-rate-dependent gameplay logic.
- Use delta time for continuous movement.

### Rendering and performance

- Pause nonessential work when the document is hidden.
- Avoid layout reads inside high-frequency loops.
- Batch DOM writes where possible.
- Reuse objects in render loops to reduce garbage collection pressure.
- Do not increase visual density without checking low-powered devices.
- Keep effects degradable rather than all-or-nothing.

### Audio

- Audio must follow user gesture and browser autoplay rules.
- Do not create multiple overlapping loops for the same state.
- Fade between ambience states rather than hard-cutting when possible.
- Suspend or mute nonessential audio when the tab is hidden.
- Provide a usable muted experience.

### Accessibility

- Interactive controls require semantic names and visible focus states.
- Do not hide the entire experience from the accessibility tree after entry.
- Status changes should be exposed without creating excessive announcements.
- Color must not be the sole feedback channel.
- Interaction timing must not punish users who need more time.

## Documentation Style

Use direct, testable language.

Good:

> The radar target must remain inside the lock reticle for 1.2 seconds before confirmation.

Weak:

> The radar should feel engaging and responsive.

Design documents may describe emotional intent, but production and technical documents must also define observable behavior.

## Commit Standards

Commit messages should describe the outcome, not the activity.

Preferred examples:

- `fix: prevent duplicate contact acknowledgement`
- `feat: add keyboard control for power lever`
- `perf: pause radar updates when document is hidden`
- `docs: define AI agent production rules`

Avoid vague messages such as:

- `update files`
- `fix stuff`
- `improvements`
- `changes`

## Pull Request Requirements

A pull request should include:

- concise problem statement;
- implementation summary;
- affected states and systems;
- validation performed;
- screenshots or recordings for visible changes;
- accessibility impact;
- performance impact;
- documentation changes;
- known limitations.

Large changes should remain draft until their critical path is integrated and testable.

## Review Priorities

Review in this order:

1. broken state transitions;
2. input or accessibility regressions;
3. lifecycle leaks and duplicated work;
4. performance regressions;
5. visual or motion inconsistency;
6. maintainability concerns;
7. minor style issues.

Do not approve visually impressive work that makes the experience less reliable.

## Prohibited Agent Behaviors

An AI agent must not:

- invent repository status, test results, commits, or deployment outcomes;
- claim a file was changed without performing the change;
- silently remove existing features;
- bypass accessibility to simplify implementation;
- introduce large dependencies without justification;
- rewrite major systems without reading their full context;
- add speculative abstractions with no current use;
- change narrative canon without updating the story documents;
- force-push or overwrite another contributor's work without explicit instruction;
- merge a pull request with unresolved critical review comments.

## Escalation Rules

Stop and request human direction when a change would:

- alter the core story reveal;
- add a new ending or branch;
- replace the rendering architecture;
- introduce a paid or proprietary dependency;
- collect user data;
- materially increase download size;
- change supported browsers or devices;
- weaken accessibility requirements;
- invalidate an approved design bible.

## Definition of a Good Agent Contribution

A strong AI contribution is:

- grounded in repository context;
- small enough to review;
- complete enough to test;
- consistent with the design bibles;
- accessible through multiple input methods;
- performant on realistic hardware;
- documented where necessary;
- honest about limitations and validation.

The best agent work should feel like a careful extension of the existing product, not a foreign layer placed on top of it.
