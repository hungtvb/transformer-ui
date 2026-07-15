# PROJECT TITAN Backlog

## Purpose

This backlog converts the project vision, audit findings, and production standards into an ordered implementation queue. It is intentionally prioritized by experience value and technical risk rather than by visual novelty.

The rule is simple: deepen the existing first-contact encounter before expanding into unrelated systems.

---

## Priority Model

- **P0 — Release blocker:** prevents reliable completion, accessibility, deployment, or safe iteration.
- **P1 — Core experience:** materially improves the current vertical slice.
- **P2 — Expansion:** adds meaningful depth after the core is stable.
- **P3 — Polish:** improves presentation without changing the core loop.
- **P4 — Exploration:** prototype only; not committed to production.

Each item should include evidence when completed: screenshots, test notes, performance data, or commit references.

---

# P0 — Stability and Verification

## P0.1 Validate the implementation state machine

**Goal:** Ensure runtime behavior matches `docs/technical/STATE_MACHINE.md`.

### Tasks

- [ ] Identify the single authoritative state variable.
- [ ] Centralize all legal transitions.
- [ ] Reject or log invalid transitions.
- [ ] Ensure animation callbacks cannot silently own narrative state.
- [ ] Ensure timers are cancelled when leaving their state.
- [ ] Add a debug overlay for current state and recent transitions.
- [ ] Test rapid repeated input at every transition boundary.

### Acceptance criteria

- A full playthrough follows the documented state order.
- Repeated clicks, taps, and key presses cannot skip or duplicate states.
- Hidden-tab recovery does not corrupt progression.

---

## P0.2 Complete input parity audit

**Goal:** Make the experience fully completable with mouse, touch, and keyboard.

### Tasks

- [ ] Test all drag mechanics with mouse.
- [ ] Test all controls on iOS Safari.
- [ ] Test all controls on Android Chrome.
- [ ] Add keyboard equivalents for tuner, radar, hold, and acknowledge interactions.
- [ ] Verify focus order after every state transition.
- [ ] Verify pointer cancellation and lost capture cleanup.
- [ ] Ensure touch scrolling is blocked only where necessary.

### Acceptance criteria

- The full sequence is completable using each supported input method.
- No control becomes stuck after interrupted input.
- Focus always moves to the next meaningful interaction.

---

## P0.3 Accessibility playthrough

**Goal:** Preserve agency, mystery, and dramatic timing for assistive-technology users.

### Tasks

- [ ] Run a keyboard-only playthrough.
- [ ] Run an iOS VoiceOver playthrough.
- [ ] Run a desktop screen-reader playthrough.
- [ ] Audit accessible names and roles.
- [ ] Remove decorative objects from the accessibility tree.
- [ ] Add concise state announcements.
- [ ] Verify announcements do not repeat during animation frames.
- [ ] Verify reduced-motion mode.
- [ ] Verify no critical cue is color-only or audio-only.

### Acceptance criteria

- Every required action is discoverable and operable.
- State changes are announced once, clearly.
- Reduced-motion mode retains the intended narrative sequence.

---

## P0.4 Mobile performance baseline

**Goal:** Establish measured performance before adding more effects.

### Tasks

- [ ] Measure initial transfer size.
- [ ] Measure time to first meaningful frame.
- [ ] Measure time to interactive.
- [ ] Record average and worst frame times by state.
- [ ] Record peak memory during a full playthrough.
- [ ] Test thermal behavior on a recent iPhone.
- [ ] Verify hidden-tab pausing.
- [ ] Confirm no failed asset requests.
- [ ] Define low, medium, and high device tiers.

### Acceptance criteria

- No repeatable crash or unbounded memory growth.
- Input remains responsive on the supported mobile baseline.
- Device-tier degradation is deterministic and documented.

---

## P0.5 Deployment smoke test

**Goal:** Make every main-branch release verifiable on GitHub Pages.

### Tasks

- [ ] Confirm production build succeeds.
- [ ] Confirm base paths resolve under GitHub Pages.
- [ ] Confirm direct asset URLs load.
- [ ] Add a post-deployment smoke checklist.
- [ ] Verify the live experience after deployment.
- [ ] Record rollback procedure.

### Acceptance criteria

- Deployment succeeds from a clean checkout.
- The live page completes the core interaction flow without console errors.

---

# P1 — Deepen the Current Encounter

## P1.1 Post-contact aftermath

**Goal:** Give the acknowledgement moment emotional weight before presenting a new task.

### Tasks

- [ ] Add a quiet pause after contact acknowledgement.
- [ ] Change the station ambience to show that the encounter had consequences.
- [ ] Introduce subtle environmental responses rather than an immediate spectacle.
- [ ] Preserve player control during the aftermath where appropriate.
- [ ] Add a clear transition into intent analysis.

### Acceptance criteria

- The player receives time to process the contact.
- The aftermath is understandable without explanatory text.
- The sequence follows `EMOTION_CURVE.md`.

---

## P1.2 Intent analysis mechanic

**Goal:** Let the player interpret the entity rather than merely receive exposition.

### Tasks

- [ ] Define three readable signal layers: rhythm, geometry, and emotional tone.
- [ ] Create an interaction that compares or aligns patterns.
- [ ] Provide partial feedback without directly stating the answer.
- [ ] Support forgiving input thresholds.
- [ ] Add keyboard and touch parity from the start.
- [ ] Define success, uncertainty, and misinterpretation outcomes.

### Acceptance criteria

- The mechanic rewards observation instead of reflex speed.
- The player can form a defensible interpretation.
- Failure does not require restarting the entire experience.

---

## P1.3 First meaningful choice

**Goal:** Convert contact into agency and consequence.

### Candidate choices

- **Trust:** open a controlled communication channel.
- **Seal:** isolate the station and terminate the signal.
- **Transfer:** route the signal into the station matrix for deeper analysis.

### Tasks

- [ ] Define the information available before the choice.
- [ ] Avoid presenting one option as obviously correct.
- [ ] Give each choice a distinct physical interaction.
- [ ] Add immediate visual and audio consequence.
- [ ] Persist the choice using versioned local storage.
- [ ] Define a replay-aware echo for returning users.

### Acceptance criteria

- Every option feels intentional and defensible.
- The result is visible in the station, not only in text.
- The choice changes at least one later state or environmental condition.

---

## P1.4 Contact-scene visual upgrade

**Goal:** Make the existing hero moment emotionally credible at close range.

### Tasks

- [ ] Improve glass material and reflections.
- [ ] Add controlled condensation, dust, or micro-surface detail.
- [ ] Improve entity silhouette readability.
- [ ] Refine hand pose and approach timing.
- [ ] Add contact-pressure response to the glass.
- [ ] Tune lighting so the hand remains the visual priority.
- [ ] Validate responsive framing at target widths.

### Acceptance criteria

- The contact moment remains clear at 375, 768, 1024, and 1440 px.
- Effects support intimacy rather than obscure it.
- The image is strong enough to serve as the project’s primary screenshot.

---

## P1.5 Environmental storytelling pass

**Goal:** Make Orbital Relay 07 feel inhabited, damaged, and historically specific.

### Tasks

- [ ] Add maintenance markings and station identifiers.
- [ ] Add evidence of emergency shutdown.
- [ ] Add one unresolved human detail without showing a character.
- [ ] Add damage patterns that imply a plausible event.
- [ ] Keep props subordinate to interaction clarity.
- [ ] Avoid generic sci-fi decoration.

### Acceptance criteria

- The room communicates a history before any explicit explanation.
- At least three details reward close observation.
- No prop conflicts with control usability or accessibility.

---

# P2 — Architecture and Replay Depth

## P2.1 Versioned persistence

**Goal:** Make returning-player behavior reliable across releases.

### Tasks

- [ ] Define a versioned storage schema.
- [ ] Store first-visit status.
- [ ] Store major narrative choice.
- [ ] Store accessibility and audio preferences.
- [ ] Add migration or safe-reset behavior.
- [ ] Add a developer reset command.

### Acceptance criteria

- Old data cannot break a new release.
- Clearing storage restores a clean first run.
- Preferences persist independently from narrative progress.

---

## P2.2 Replay and echo system

**Goal:** Make previous contact subtly affect later playthroughs.

### Tasks

- [ ] Define which memories persist.
- [ ] Add small environmental differences for returning users.
- [ ] Avoid skipping essential onboarding when mechanics have changed.
- [ ] Add a deliberate replay entry point.
- [ ] Add one entity response that acknowledges prior contact without exposition.

### Acceptance criteria

- Returning users notice continuity.
- New users receive the complete intended introduction.
- Replay differences do not create inaccessible hidden requirements.

---

## P2.3 Audio-state architecture

**Goal:** Make audio transitions deterministic and maintainable.

### Tasks

- [ ] Centralize audio context and mute preference.
- [ ] Map audio layers to narrative states.
- [ ] Prevent duplicate loops.
- [ ] Pause or reduce audio when hidden.
- [ ] Add visual equivalents for critical cues.
- [ ] Verify no clipping during layered transitions.

### Acceptance criteria

- Each state has an intentional audio profile.
- Audio resumes safely after interruption.
- Muted play remains fully understandable.

---

## P2.4 Automated quality checks

**Goal:** Catch regressions before deployment.

### Tasks

- [ ] Add formatting and lint checks.
- [ ] Add production build verification.
- [ ] Add a lightweight state-transition test suite.
- [ ] Add static checks for missing critical assets.
- [ ] Add accessibility smoke checks where practical.
- [ ] Run checks in GitHub Actions.

### Acceptance criteria

- Pull requests cannot silently break the production build.
- Illegal core state transitions are covered by tests.
- Workflow failures provide actionable output.

---

## P2.5 Debug and observability mode

**Goal:** Make cinematic bugs reproducible without exposing debug UI to players.

### Tasks

- [ ] Add opt-in debug mode.
- [ ] Display current state and previous state.
- [ ] Display active timers and interaction lock state.
- [ ] Display device tier and reduced-motion mode.
- [ ] Add shortcuts to jump to safe test states.
- [ ] Add a recent transition log.

### Acceptance criteria

- Developers can reproduce any state without replaying the full sequence.
- Debug mode cannot be activated accidentally in the public experience.

---

# P3 — Presentation Polish

## P3.1 UI hierarchy refinement

- [ ] Reduce nonessential dashboard chrome.
- [ ] Strengthen active-control hierarchy.
- [ ] Standardize status, warning, and confirmation patterns.
- [ ] Verify typography scale on mobile.
- [ ] Ensure text never competes with the entity reveal.

---

## P3.2 Lighting transition pass

- [ ] Define lighting values per major state.
- [ ] Remove abrupt changes without narrative purpose.
- [ ] Keep emergency colors rare.
- [ ] Reserve the strongest contrast for first contact.
- [ ] Validate low-device fallback.

---

## P3.3 Motion cleanup pass

- [ ] Remove decorative movement without information value.
- [ ] Normalize easing by interaction category.
- [ ] Prevent overlapping hero animations.
- [ ] Tune reduced-motion transitions.
- [ ] Verify animation timing under low frame rate.

---

## P3.4 Responsive composition pass

- [ ] Capture every state at target breakpoints.
- [ ] Reposition controls that obscure the subject.
- [ ] Prevent unsafe viewport-height assumptions on mobile browsers.
- [ ] Respect device safe areas.
- [ ] Verify landscape behavior.

---

## P3.5 Project presentation assets

- [ ] Produce final hero screenshot.
- [ ] Produce a short gameplay capture.
- [ ] Update repository README with current experience summary.
- [ ] Add architecture and state-flow diagrams.
- [ ] Document supported browsers and controls.

---

# P4 — Exploration

These ideas must remain prototypes until P0 and P1 work is complete.

## P4.1 Alternate entity behavior

- Test non-humanoid signal presence.
- Test delayed mimicry of player movement.
- Test asymmetrical contact gestures.

## P4.2 Multiple station locations

- Observation deck.
- Communications spine.
- External maintenance gantry.

## P4.3 WebXR contact prototype

- Explore spatial control interaction.
- Do not compromise the standard web experience.

## P4.4 Procedural signal language

- Generate repeatable patterns from a seeded grammar.
- Ensure patterns remain interpretable and accessible.

## P4.5 Optional cinematic photo mode

- Allow controlled camera framing only after completing the story beat.
- Preserve authored composition during the main experience.

---

# Recommended Sprint Order

## Sprint A — Reliability

1. State-machine validation.
2. Input parity.
3. Accessibility playthrough.
4. Deployment smoke test.

## Sprint B — Performance and Composition

1. Mobile performance baseline.
2. Responsive screenshot audit.
3. Contact-scene visual upgrade.
4. Motion cleanup.

## Sprint C — Narrative Depth

1. Post-contact aftermath.
2. Intent analysis.
3. First meaningful choice.
4. Versioned persistence.

## Sprint D — Production Hardening

1. Automated quality checks.
2. Debug mode.
3. Audio-state architecture.
4. Replay echo system.

---

# Backlog Governance

- New work must have a clear player-facing outcome.
- Any new mechanic must identify its narrative state.
- Any visual effect must identify the information or emotion it supports.
- P4 exploration cannot delay P0 or P1 work.
- Completed work must update relevant documentation.
- Deferred work must remain visible rather than disappearing from scope.
- Every release must pass `docs/production/RELEASE_CHECKLIST.md`.

---

## Immediate Next Item

Start with **P0.1 — Validate the implementation state machine**. It has the highest leverage because every future mechanic depends on deterministic progression.