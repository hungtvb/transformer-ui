# PROJECT TITAN — Production Roadmap

This roadmap turns the current prototype into a production-ready interactive cinematic experience. It is organized by validated milestones rather than by effect count.

## Roadmap principles

- Build one emotional outcome at a time.
- Prototype mechanics before polishing art.
- Do not expand story until the previous act is stable.
- Treat mobile, accessibility, and performance as design work, not final cleanup.
- Refactor the engine before content growth makes the current structure expensive to change.
- Every milestone must have measurable exit criteria.

## Current baseline

### Sprint Alpha — Station Awakening

**Status:** Vertical slice complete, production quality not reached.

Delivered:

- Environment calibration screen
- Manual power lever
- Station lighting response
- Signal tuner
- Progressive entity reveal
- First-contact acknowledgement

Validated:

- Physical interaction is more engaging than passive scroll animation.
- The control-room framing gives the entity better scale.
- A delayed reveal is stronger than displaying the complete robot immediately.

Known gaps:

- Procedural environment is visually simple.
- Audio is synthetic and lacks cinematic depth.
- Story state is still tightly coupled to DOM and scene code.
- The room lacks enough ambient life to feel fully inhabited.

### Sprint Beta — Tracking & Contact

**Status:** Vertical slice complete after stability fixes.

Delivered:

- Moving radar target
- Reticle tracking gameplay
- Frame-rate-independent tracking quality
- Visual lock transition
- Entity hand approaching the glass
- Press-and-hold contact synchronization
- Entity acknowledgement response
- Pointer lifecycle and accessibility fixes

Validated:

- Tracking adds genuine gameplay and anticipation.
- Hand-to-glass contact is the strongest emotional direction so far.
- A deliberate response creates more presence than a large visual effect.

Known gaps:

- Radar behavior remains predictable over repeated attempts.
- Entity animation is procedural rather than authored.
- Contact does not yet create a meaningful branch or persistent memory.
- Mobile interaction needs dedicated usability testing.

---

# Milestone D0 — Documentation Foundation

**Goal:** Establish the project’s single source of truth before further expansion.

Deliverables:

- Documentation hub
- Product vision
- Experience principles
- Production roadmap
- Story document
- Gameplay document
- Art, camera, motion, and audio bibles
- Technical architecture
- Performance and accessibility standards
- Sprint audit
- Backlog and review process
- AI agent guide

Exit criteria:

- [ ] All foundation documents exist and link to each other.
- [ ] Vision and anti-patterns are explicit.
- [ ] Alpha and Beta are audited against the same scorecard.
- [ ] Gamma scope is approved before implementation.
- [ ] AI agents have clear implementation constraints.

---

# Milestone D1 — Engine Refactor

**Goal:** Replace the monolithic prototype structure with a reusable experience engine.

Target architecture:

```text
src/
  core/
    Experience
    StateMachine
    InputManager
    AudioEngine
    QualityManager
    EventBus
  world/
    Station
    Entity
    Environment
    FX
  interactions/
    Lever
    Tuner
    Radar
    ContactPad
  story/
    acts
    missions
    choices
  ui/
    WorldUI
    AccessibilityUI
```

Key work:

- Explicit finite-state mission flow
- Deterministic transitions
- Reusable interaction lifecycle
- Shared pointer, touch, and keyboard handling
- Centralized audio cues
- Adaptive quality tiers
- Save and return-visit state
- Pause and resume behavior

Exit criteria:

- [ ] Alpha and Beta run on the new architecture.
- [ ] No mission depends on ad-hoc timeout sequencing.
- [ ] Pointer cancellation is handled centrally.
- [ ] Quality can change at runtime without reloading.
- [ ] Story state can be inspected and reset in development mode.
- [ ] Core modules have unit coverage for state transitions.

---

# Milestone D2 — Living Control Room

**Goal:** Make the station compelling even before the entity appears.

Experience target:

The user should want to look around the station before receiving the first objective.

Features:

- Layered CRT behavior
- Electrical instability
- Steam and dust systems
- Cable sparks
- Mechanical ambience
- Distant exterior movement
- Practical lighting states
- Window reflections
- Environmental storytelling props
- Idle events that do not repeat obviously

Interaction improvements:

- Lever resistance curve
- Tactile detents and sound cues
- Better physical positioning of controls
- Camera framing that supports the current mission

Exit criteria:

- [ ] The room feels alive for at least 60 seconds without user input.
- [ ] No idle loop is obviously repeated within 30 seconds.
- [ ] Station lighting has distinct offline, booting, operational, warning, and contact states.
- [ ] Mobile composition is authored independently.
- [ ] Desktop performance remains within budget.

---

# Milestone D3 — Signal Investigation

**Goal:** Turn signal tuning into a layered mystery rather than a single correct slider value.

Features:

- Multiple signal bands
- False positives
- Signal drift
- Directional audio
- Partial voice reconstruction
- Visual noise reduction tied to tuning quality
- Symbol decoding
- Optional clue for returning users

Gameplay structure:

1. Locate the carrier band.
2. Stabilize amplitude.
3. Separate voice from noise.
4. Confirm the signal is intentional.

Exit criteria:

- [ ] The mechanic is understandable without text-heavy tutorial instructions.
- [ ] The correct signal cannot be solved instantly by random dragging.
- [ ] Failure produces useful feedback rather than a hard reset.
- [ ] Audio communicates progress even without looking at the meter.
- [ ] Keyboard and touch alternatives feel intentional.

---

# Milestone D4 — Tracking and Scale Reveal

**Goal:** Establish the entity’s size before full visual contact.

Features:

- Less predictable target behavior
- Occlusion and signal loss
- Exterior scale references
- Atmospheric depth
- Partial silhouette passes
- Camera re-framing during lock
- Delayed sound and structural vibration

Signature reveal:

The user tracks a small radar contact, then realizes the contact is only one moving part of a much larger body.

Exit criteria:

- [ ] Tracking remains fair across frame rates and devices.
- [ ] Scale is understandable without explanatory copy.
- [ ] The entity is not fully visible before the reveal is earned.
- [ ] At least one composition is strong enough to capture or share.

---

# Milestone D5 — First Contact Production Pass

**Goal:** Upgrade the current hand-to-glass prototype into the emotional centerpiece of the experience.

Features:

- Authored hand and head animation
- Glass deformation and stress response
- Condensation or surface reaction
- Spatial audio at the contact point
- Contact synchronization based on stability, not only duration
- Entity hesitation and deliberate response
- Return-visit variation
- Screenshot-safe composition

Exit criteria:

- [ ] The moment works without dialogue.
- [ ] The entity’s intention reads clearly.
- [ ] The user action visibly influences the response.
- [ ] The scene remains comfortable in reduced-motion mode.
- [ ] Contact behavior changes on at least one return visit.

---

# Milestone D6 — Choice and Consequence

**Goal:** Add meaningful agency and replay value.

Candidate choices:

- Open the relay channel.
- Isolate the station.
- Transfer power to the unknown signal.

Requirements:

- Each choice changes animation, lighting, audio, world state, and ending.
- No choice is presented as obviously correct.
- Earlier performance may affect the available options.
- The entity remembers the choice on return.

Exit criteria:

- [ ] At least two branches contain meaningfully different content.
- [ ] Branches are not subtitle-only variations.
- [ ] The user understands the consequence after choosing.
- [ ] Replay can reveal a new state or hidden response.

---

# Milestone D7 — Art and Asset Production

**Goal:** Replace prototype geometry with an original, production-ready visual identity.

Features:

- Original entity design
- Original station design language
- Authored GLB assets
- PBR materials
- LODs
- Rigged entity animation
- Station prop set
- Original symbols and typography system
- Controlled color pipeline

Exit criteria:

- [ ] No recognizable licensed-character dependency remains.
- [ ] Assets meet polygon, texture, and memory budgets.
- [ ] LOD changes are not distracting.
- [ ] The entity silhouette is identifiable without color.
- [ ] Art direction matches the art bible.

---

# Milestone D8 — Audio Production

**Goal:** Build audio as a full narrative system.

Features:

- Layered ambient beds
- Mechanical one-shots
- Radio and signal design
- Spatial entity movement
- Contact resonance
- Dynamic music stems
- Silence states
- Captioned critical cues

Exit criteria:

- [ ] Every act has an audio intent map.
- [ ] Major off-screen events can be understood through sound.
- [ ] Audio transitions do not click or stack uncontrollably.
- [ ] User volume and mute controls are accessible.
- [ ] Critical information has a visual alternative.

---

# Milestone D9 — Performance and Platform Pass

**Goal:** Make the complete experience stable across target devices.

Quality tiers:

- Desktop Ultra
- Desktop Balanced
- Mobile High
- Mobile Balanced
- Battery Saver

Work:

- GPU timing and adaptive quality
- Texture compression
- Asset streaming
- Draw-call reduction
- Instancing
- Post-processing fallback
- Reduced particle and light paths
- Thermal and battery behavior
- Orientation and resize recovery

Exit criteria:

- [ ] Target frame rates are met on defined test devices.
- [ ] The core story remains intact at the lowest tier.
- [ ] Long tasks and memory spikes are within budget.
- [ ] Quality changes do not break interaction state.

---

# Milestone D10 — Accessibility and Comfort Pass

**Goal:** Preserve agency and story for a broader range of users.

Features:

- Full keyboard path
- Screen-reader mission announcements
- Reduced motion
- High contrast
- Captions
- Adjustable hold durations
- Non-drag alternatives
- Pause and resume
- Input remapping where practical

Exit criteria:

- [ ] The experience can be completed without a mouse.
- [ ] Required audio information has a visual equivalent.
- [ ] Required visual information has text or state equivalents.
- [ ] Reduced motion preserves all narrative beats.
- [ ] Focus order and visibility are correct.

---

# Milestone RC — Release Candidate

**Goal:** Freeze content and validate the complete product.

Work:

- Cross-browser QA
- Device matrix testing
- Analytics and error reporting
- Legal and privacy review
- Asset licensing review
- Loading and recovery states
- Save migration
- Replay testing
- Final scorecard

Exit criteria:

- [ ] No blocker or critical bug remains.
- [ ] Complete experience score is at least 85/100.
- [ ] All branches are testable and recoverable.
- [ ] Public build contains no development controls.
- [ ] Documentation matches implementation.

---

# Milestone v1.0 — Public Release

Release goals:

- A complete first-contact story
- Original visual identity
- Meaningful interaction and branching
- Stable desktop and mobile builds
- Accessibility alternatives
- Replay value
- At least one memorable, shareable moment

Post-release priorities:

- Observe completion and drop-off points.
- Fix stability issues before adding content.
- Compare actual user behavior with the intended emotion curve.
- Plan the next chapter only after the first experience is validated.

## Immediate next actions

1. Complete the remaining D0 documentation.
2. Audit Alpha and Beta using the production scorecard.
3. Approve the D1 architecture before refactoring.
4. Freeze new spectacle features until the engine and design bibles are ready.
