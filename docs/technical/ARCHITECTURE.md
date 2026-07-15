# PROJECT TITAN — Technical Architecture

## 1. Purpose

This document defines the technical architecture for PROJECT TITAN, an interactive first-contact experience built for the web.

The architecture must support:

- deterministic narrative progression
- responsive tactile interactions
- cinematic rendering without blocking gameplay
- keyboard, pointer, and touch input parity
- graceful degradation on lower-end devices
- clear separation between experience logic and rendering
- reliable save and replay behavior
- automated testing of state transitions and interaction rules

The project should feel like a cinematic machine, but remain engineered as a predictable application.

---

## 2. Architectural Principles

### 2.1 State owns truth

The current experience state is the single source of truth.

Rendering, audio, copy, interaction availability, and camera behavior must derive from state rather than independently deciding what should happen.

### 2.2 Systems communicate through explicit contracts

Modules must not reach into each other's internal data structures.

Use commands, events, and read-only snapshots.

### 2.3 Rendering is replaceable

Narrative and gameplay logic must not depend on Three.js scene objects, DOM nodes, or animation timelines.

A renderer should consume a view model and produce visuals.

### 2.4 Every transition is observable

State changes must emit structured transition events for debugging, analytics, automated tests, and replay diagnostics.

### 2.5 Time is injected

Game logic must never depend directly on `Date.now()` or uncontrolled frame timing.

Use a shared clock abstraction so tests and replays remain deterministic.

### 2.6 Failure degrades, not destroys

Loss of audio, reduced motion, WebGL limitations, or interrupted focus must not make the experience impossible to complete.

---

## 3. Recommended Project Structure

```text
src/
  app/
    bootstrap.js
    config.js
    lifecycle.js
  core/
    clock/
      GameClock.js
      FixedClock.js
    events/
      EventBus.js
      eventTypes.js
    state/
      ExperienceMachine.js
      states.js
      transitions.js
      guards.js
    commands/
      commandTypes.js
      CommandRouter.js
    persistence/
      SaveStore.js
      migrations.js
  gameplay/
    calibration/
    power/
    signal/
    radar/
    contact/
    decision/
  input/
    InputManager.js
    PointerAdapter.js
    KeyboardAdapter.js
    TouchAdapter.js
    ActionMap.js
  presentation/
    ViewModelBuilder.js
    copy/
    hud/
    accessibility/
  rendering/
    SceneRenderer.js
    CameraDirector.js
    EnvironmentSystem.js
    EntitySystem.js
    EffectsSystem.js
    QualityManager.js
  motion/
    MotionDirector.js
    timelines/
    easing.js
  audio/
    AudioDirector.js
    AudioGraph.js
    cues.js
  telemetry/
    Telemetry.js
    sessionMetrics.js
  tests/
    state/
    gameplay/
    integration/
```

The exact filenames may evolve, but the dependency direction must remain stable.

---

## 4. Layer Model

### 4.1 Core domain layer

Owns:

- experience state
- transition rules
- session variables
- deterministic time
- persistence schema
- domain events

Must not import:

- Three.js
- GSAP
- DOM APIs
- Web Audio APIs

### 4.2 Gameplay systems layer

Owns the mechanics for each station interaction:

- calibration tolerance
- lever travel and power threshold
- signal frequency lock
- radar tracking score
- hand synchronization hold progress
- decision selection

Each gameplay system receives normalized actions and emits results.

### 4.3 Presentation layer

Transforms domain state into a platform-neutral view model.

Example:

```js
{
  phase: "SIGNAL_TUNING",
  objective: "Isolate the carrier",
  signalStrength: 0.72,
  tunerEnabled: true,
  radarVisible: false,
  entityVisibility: 0,
  reducedMotion: false
}
```

The DOM, renderer, audio, and accessibility systems consume this model.

### 4.4 Rendering and motion layer

Owns visual output only:

- scene graph
- camera composition
- lighting
- materials
- particles
- post-processing
- animation timelines

It must never directly advance narrative state.

A completed animation may emit a presentation event, which the domain layer can choose to accept.

### 4.5 Platform layer

Owns browser concerns:

- document visibility
- resize and orientation
- pointer capture
- local storage
- reduced-motion preference
- audio permission
- WebGL capability detection

---

## 5. Runtime Data Flow

```text
Browser Input
    ↓
Input Adapters
    ↓
Normalized Action Map
    ↓
Command Router
    ↓
Gameplay System / Experience Machine
    ↓
Domain State + Domain Events
    ↓
View Model Builder
    ↓
Renderer / Motion / Audio / DOM / Accessibility
```

No rendering subsystem should mutate domain state directly.

---

## 6. State Ownership

The `ExperienceMachine` owns:

- current state
- previous state
- transition timestamp
- transition reason
- state-local context
- global session context

Example session context:

```js
{
  sessionId: "...",
  firstVisit: true,
  calibrationComplete: false,
  signalAccuracy: 0,
  radarTrackingScore: 0,
  contactHoldDuration: 0,
  chosenOutcome: null,
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    captions: true
  }
}
```

Only the state machine may replace the current state.

Gameplay systems may propose transitions through commands.

---

## 7. Command Model

Commands represent user or system intent.

Examples:

```text
CALIBRATION_CONFIRMED
POWER_LEVER_CHANGED
SIGNAL_DIAL_CHANGED
RADAR_TARGET_MOVED
CONTACT_PAD_HELD
CONTACT_PAD_RELEASED
ACKNOWLEDGE_REQUESTED
VISIBILITY_CHANGED
RESTART_REQUESTED
```

A command contains:

```js
{
  type: "SIGNAL_DIAL_CHANGED",
  payload: { value: 0.63 },
  source: "pointer",
  timestamp: 12345.67
}
```

Commands must be validated before entering gameplay logic.

---

## 8. Event Model

Events describe what already happened.

Examples:

```text
STATE_ENTERED
STATE_EXITED
POWER_RESTORED
SIGNAL_LOCK_PROGRESS_CHANGED
SIGNAL_LOCKED
RADAR_CONTACT_ACQUIRED
VISUAL_CONTACT_REVEALED
HAND_SYNC_STARTED
HAND_SYNC_COMPLETED
CONTACT_ACKNOWLEDGED
QUALITY_LEVEL_CHANGED
AUDIO_UNLOCK_FAILED
```

Events should be immutable and serializable.

They may be consumed by:

- telemetry
- audio cues
- motion timelines
- debug overlay
- automated tests

---

## 9. Time and Update Loop

Use one authoritative application loop.

```js
function frame(now) {
  clock.tick(now);
  const dt = clock.deltaSeconds;

  input.update(dt);
  gameplay.update(dt);
  machine.update(dt);
  presentation.update(dt);
  renderer.render(dt);

  requestAnimationFrame(frame);
}
```

Rules:

- clamp unusually large `dt` values after tab suspension
- pause gameplay progression while the document is hidden
- keep state transitions idempotent
- avoid independent unmanaged intervals for gameplay
- use scheduled domain tasks rather than scattered `setTimeout` calls

For tests, replace `GameClock` with `FixedClock`.

---

## 10. Interaction Modules

Every interaction module should expose the same lifecycle:

```js
class InteractionModule {
  enter(context) {}
  handle(command, context) {}
  update(dt, context) {}
  getSnapshot() {}
  exit(context) {}
  reset() {}
}
```

Each module must:

- accept normalized values
- remain independent of DOM geometry after normalization
- expose progress as `0..1`
- expose completion explicitly
- support cancellation
- support keyboard operation
- support deterministic tests

---

## 11. Camera Architecture

`CameraDirector` receives cinematic intents rather than raw narrative state.

Example intents:

```text
ESTABLISH_STATION
FOCUS_POWER_LEVER
MOVE_TO_SIGNAL_CONSOLE
TRACK_RADAR_CONTACT
REVEAL_VIEWPORT_ENTITY
FRAME_HAND_CONTACT
RETURN_TO_OPERATOR_VIEW
```

The director maps intents to camera shots defined in `CAMERA_BIBLE.md`.

Camera completion must not be required for input unless a temporary interaction lock is explicitly part of the design.

Reduced-motion mode should replace long camera travel with short dissolves or near-static reframes.

---

## 12. Motion Architecture

`MotionDirector` owns timeline creation and cleanup.

Required rules:

- one named timeline per cinematic beat
- kill or replace previous conflicting timelines
- never allow duplicate completion callbacks
- use semantic motion tokens
- centralize easing and durations
- respect reduced-motion settings
- provide a `skipToEnd()` path for recovery and testing

Motion callbacks emit presentation events; they do not mutate the domain directly.

---

## 13. Audio Architecture

`AudioDirector` consumes domain and presentation events.

Audio categories:

- ambience
- machinery
- interface feedback
- signal artifacts
- entity presence
- narrative stingers

Requirements:

- unlock audio only after a user gesture
- continue silently if unlock fails
- debounce repeated cues
- duck ambience during critical signal moments
- stop or suspend graph updates while hidden
- expose captions or visual equivalents for essential information

---

## 14. Persistence

Persist only durable session facts.

Recommended schema:

```js
{
  version: 1,
  hasVisited: true,
  completedStates: [],
  lastCheckpoint: "VISUAL_CONTACT",
  chosenOutcome: null,
  preferences: {
    reducedMotion: false,
    captions: true
  }
}
```

Do not persist transient pointer positions, active animation progress, or partial hold state.

Persistence must include migrations by schema version.

Save only at defined checkpoints.

---

## 15. Quality Management

`QualityManager` chooses a quality tier based on capability and measured performance.

Suggested tiers:

### High

- full post-processing
- high-resolution reflections
- dense atmospheric particles
- smooth volumetric effects

### Medium

- reduced particle density
- simplified reflections
- limited post-processing

### Low

- minimal particles
- baked lighting where possible
- reduced render scale
- no expensive blur or volumetric passes

Quality changes must not alter gameplay difficulty or narrative timing.

---

## 16. Error Recovery

Every system must fail independently.

Examples:

- audio failure → continue with captions and visual feedback
- post-processing failure → render base scene
- save failure → continue session and retry at next checkpoint
- pointer capture loss → cancel active drag cleanly
- hidden tab → pause progression and resume from stable state
- timeline interruption → reconcile to the state's canonical visual snapshot

A global recovery command should rebuild presentation from the current domain snapshot.

---

## 17. Debugging Tools

Development builds should provide a debug overlay with:

- current state
- previous state
- transition reason
- state duration
- active commands
- last domain events
- current FPS and frame time
- quality tier
- active timelines
- audio status
- persistence status

Also provide developer controls to jump to any valid checkpoint.

---

## 18. Testing Strategy

### Unit tests

- guards
- transition rules
- progress calculations
- tolerances
- input normalization
- persistence migrations

### State-machine tests

- every valid transition
- every rejected transition
- duplicate command handling
- interruption and recovery
- restart behavior

### Integration tests

- input action to state transition
- state transition to view model
- checkpoint save and restore
- reduced-motion flow
- keyboard-only completion

### Visual tests

- canonical screenshots for key states
- responsive layout states
- low-quality fallback
- reduced-motion compositions

---

## 19. Dependency Rules

Allowed dependency direction:

```text
platform → input → commands → gameplay → core state
core state → presentation → rendering/audio/motion
```

Forbidden patterns:

- renderer importing the state machine and mutating it
- gameplay querying DOM nodes directly
- GSAP callbacks changing state without a command
- multiple clocks controlling progress
- raw pointer coordinates stored in domain state
- local storage reads scattered across features

---

## 20. Definition of Architectural Readiness

The architecture is ready for expansion when:

- all current gameplay phases run through the central machine
- input is normalized into actions
- camera, motion, and audio consume intents or events
- deterministic tests can complete the full current flow
- document visibility pauses the experience safely
- state can reconstruct presentation after interruption
- keyboard-only completion is verified
- quality degradation does not block progression
- persistence uses a versioned schema
- no narrative transition depends directly on an animation library callback
