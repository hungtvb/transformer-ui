# PROJECT TITAN — State Machine Specification

## 1. Purpose

This document defines the canonical narrative and gameplay state machine for PROJECT TITAN.

It is the authoritative reference for:

- legal state transitions
- transition guards
- state entry and exit behavior
- interruption and recovery rules
- persistence checkpoints
- replay behavior
- automated state-flow tests

The state machine owns narrative progression. Visuals, audio, camera, and interface systems reflect state; they do not independently advance it.

---

## 2. Canonical State Flow

```text
BOOT
  ↓
CALIBRATION
  ↓
POWER_OFF
  ↓
POWER_RESTORED
  ↓
SIGNAL_TUNING
  ↓
SIGNAL_LOCKED
  ↓
RADAR_TRACKING
  ↓
VISUAL_CONTACT
  ↓
HAND_SYNC
  ↓
CONTACT_ACKNOWLEDGED
  ↓
INTENT_ANALYSIS        [future]
  ↓
BRIDGE_ROUTING         [future]
  ↓
DECISION               [future]
  ├── TRUST_ENDING
  ├── SEAL_ENDING
  └── TRANSFER_ENDING
```

Recovery and utility states may temporarily interrupt this flow but must return to a stable canonical state.

---

## 3. State Record

Each active state is represented by:

```js
{
  id: "SIGNAL_TUNING",
  enteredAt: 12400,
  previousState: "POWER_RESTORED",
  transitionReason: "POWER_SEQUENCE_COMPLETE",
  local: {
    progress: 0,
    attempts: 0
  }
}
```

Global session context is stored separately.

---

## 4. Transition Contract

A transition request contains:

```js
{
  from: "SIGNAL_TUNING",
  to: "SIGNAL_LOCKED",
  reason: "LOCK_THRESHOLD_MAINTAINED",
  commandId: "...",
  timestamp: 18200
}
```

A transition succeeds only when:

1. `from` equals the current state.
2. The edge exists in the transition map.
3. All guards pass.
4. The request has not already been consumed.
5. The target state can initialize safely.

Transition execution order:

```text
validate request
→ run guards
→ emit STATE_EXITING
→ run current-state exit actions
→ replace current state
→ run target-state entry actions
→ emit STATE_ENTERED
→ persist checkpoint when required
→ publish new view model
```

---

## 5. Global Rules

### 5.1 Idempotency

Repeated completion commands must not advance multiple states.

Example: five rapid acknowledge clicks produce one transition only.

### 5.2 No hidden transitions

Every narrative transition must pass through `ExperienceMachine.transition()`.

### 5.3 State-local input

Commands irrelevant to the current state are ignored or logged as rejected.

### 5.4 Stable entry snapshot

On entry, each state must define a complete presentation snapshot so the UI can recover after interruption.

### 5.5 Exit cleanup

Every state must clean up:

- active holds
- pointer capture
- scheduled tasks
- temporary listeners
- state-specific audio loops
- state-specific motion timelines

---

## 6. State Definitions

## 6.1 BOOT

### Purpose

Initialize platform services and establish a stable session.

### Entry actions

- load configuration
- create session ID
- load and migrate persistence
- detect accessibility preferences
- detect rendering capability
- initialize clock, input, audio, and renderer
- determine first-visit copy variant

### Accepted commands

- `APP_READY`
- `BOOT_FAILED`

### Transitions

```text
BOOT → CALIBRATION
```

### Guard

- critical systems initialized or valid fallbacks selected

### Recovery

If noncritical systems fail, continue in degraded mode.

---

## 6.2 CALIBRATION

### Purpose

Teach the interaction language and establish deliberate user presence.

### Entry actions

- display calibration interface
- enable primary input methods
- suppress narrative urgency
- show first-visit message: `YOU ARE HERE`

### Accepted commands

- `CALIBRATION_INPUT_CHANGED`
- `CALIBRATION_CONFIRMED`
- `INPUT_MODE_CHANGED`

### Context

```js
{
  target: 0.5,
  value: 0,
  tolerance: 0.08,
  stableDuration: 0
}
```

### Transition

```text
CALIBRATION → POWER_OFF
```

### Guard

- input remains inside tolerance for the required confirmation duration

### Checkpoint

No.

---

## 6.3 POWER_OFF

### Purpose

Let the operator physically wake the abandoned relay.

### Entry actions

- frame the power lever
- enable lever interaction
- set station lighting to emergency minimum
- begin low mechanical ambience

### Accepted commands

- `POWER_LEVER_CHANGED`
- `POWER_LEVER_RELEASED`
- `POWER_SEQUENCE_CONFIRMED`

### Context

```js
{
  leverValue: 0,
  activationThreshold: 0.92,
  confirmed: false
}
```

### Transition

```text
POWER_OFF → POWER_RESTORED
```

### Guard

- lever reaches threshold
- activation command has not already been consumed

### Exit actions

- release pointer capture
- disable lever mutation
- cancel incomplete drag state

---

## 6.4 POWER_RESTORED

### Purpose

Deliver the first environmental reward and stage the signal console.

### Entry actions

- activate station light sequence
- start machinery layers
- reveal dormant displays
- issue camera intent `MOVE_TO_SIGNAL_CONSOLE`
- schedule signal console readiness through the shared clock

### Accepted commands

- `POWER_PRESENTATION_COMPLETE`
- `SKIP_PRESENTATION`

### Transition

```text
POWER_RESTORED → SIGNAL_TUNING
```

### Guard

- minimum readability delay completed
- presentation is complete or safely skipped

### Checkpoint

Yes: `POWER_RESTORED`.

---

## 6.5 SIGNAL_TUNING

### Purpose

Turn noise into evidence of intelligence.

### Entry actions

- enable tuner control
- expose waveform and signal-strength feedback
- begin carrier noise
- reset lock progress

### Accepted commands

- `SIGNAL_DIAL_CHANGED`
- `SIGNAL_FINE_ADJUSTED`
- `SIGNAL_INPUT_RELEASED`

### Context

```js
{
  dialValue: 0,
  targetValue: 0.63,
  tolerance: 0.035,
  lockProgress: 0,
  requiredHold: 1.2
}
```

### Update rule

When the dial is inside tolerance, lock progress increases.

Outside tolerance, progress decays smoothly rather than resetting instantly.

### Transition

```text
SIGNAL_TUNING → SIGNAL_LOCKED
```

### Guard

- lock progress reaches `1`

### Exit actions

- freeze canonical lock value
- disable repeated completion emission

---

## 6.6 SIGNAL_LOCKED

### Purpose

Confirm the signal is structured and redirect attention to radar.

### Entry actions

- stabilize waveform
- reveal short signal pattern
- issue camera intent `TRACK_RADAR_CONTACT`
- activate radar display

### Accepted commands

- `SIGNAL_REVEAL_COMPLETE`
- `SKIP_PRESENTATION`

### Transition

```text
SIGNAL_LOCKED → RADAR_TRACKING
```

### Guard

- radar system ready

### Checkpoint

Yes: `SIGNAL_LOCKED`.

---

## 6.7 RADAR_TRACKING

### Purpose

Make the user actively maintain contact with a moving unknown target.

### Entry actions

- spawn deterministic target path
- enable radar tracking input
- reset acquisition score
- start proximity pulse

### Accepted commands

- `RADAR_CURSOR_MOVED`
- `RADAR_TRACK_STARTED`
- `RADAR_TRACK_ENDED`

### Context

```js
{
  targetPosition: { x: 0.5, y: 0.5 },
  cursorPosition: { x: 0.5, y: 0.5 },
  trackingScore: 0,
  requiredScore: 1,
  radius: 0.12
}
```

### Update rule

Tracking score rises while the cursor remains inside the target radius and decays slowly outside it.

Target motion uses deterministic clock time.

### Transition

```text
RADAR_TRACKING → VISUAL_CONTACT
```

### Guard

- acquisition score reaches completion

### Exit actions

- stop target mutation
- store final tracking score
- remove active pointer state

---

## 6.8 VISUAL_CONTACT

### Purpose

Reveal the entity as a physical presence beyond the viewport.

### Entry actions

- lock active station controls
- issue camera intent `REVEAL_VIEWPORT_ENTITY`
- begin entity reveal timeline
- reduce interface clutter
- introduce entity audio layer

### Accepted commands

- `ENTITY_REVEAL_COMPLETE`
- `SKIP_PRESENTATION`

### Transition

```text
VISUAL_CONTACT → HAND_SYNC
```

### Guard

- entity reveal reaches the canonical hand-contact composition

### Checkpoint

Yes: `VISUAL_CONTACT`.

### Recovery

On interrupted motion, snap or blend to the canonical hand-contact composition before continuing.

---

## 6.9 HAND_SYNC

### Purpose

Create a sustained reciprocal physical gesture.

### Entry actions

- reveal contact pad
- enable hold input
- frame both hands in one composition
- reset hold progress

### Accepted commands

- `CONTACT_PAD_HELD`
- `CONTACT_PAD_RELEASED`
- `CONTACT_HOLD_CANCELLED`

### Context

```js
{
  isHolding: false,
  holdProgress: 0,
  requiredDuration: 2.4,
  decayRate: 0.7
}
```

### Update rule

- holding increases progress by elapsed time
- releasing causes controlled decay
- hidden document pauses progress
- duplicate hold-start events are ignored

### Transition

```text
HAND_SYNC → CONTACT_ACKNOWLEDGED
```

### Guard

- hold progress reaches `1`

### Exit actions

- stop active hold timer
- clear pressed visual state
- emit one `HAND_SYNC_COMPLETED` event

---

## 6.10 CONTACT_ACKNOWLEDGED

### Purpose

Confirm that the entity understood and intentionally responded.

### Entry actions

- display acknowledgment control or message
- play reciprocal light response
- hold the emotional beat before future content

### Accepted commands

- `ACKNOWLEDGE_REQUESTED`
- `CONTINUE_REQUESTED`

### Current behavior

The current playable build concludes or enters a stable end-of-demo state here.

### Future transition

```text
CONTACT_ACKNOWLEDGED → INTENT_ANALYSIS
```

### Guard

- acknowledgment command consumed once
- future chapter is available

### Checkpoint

Yes: `CONTACT_ACKNOWLEDGED`.

---

## 6.11 INTENT_ANALYSIS — Future

### Purpose

Decode emotional or conceptual intent without turning the entity into exposition.

### Transition

```text
INTENT_ANALYSIS → BRIDGE_ROUTING
```

### Guard

- required signal fragments classified

---

## 6.12 BRIDGE_ROUTING — Future

### Purpose

Make the operator route power and trust into a communication bridge.

### Transition

```text
BRIDGE_ROUTING → DECISION
```

### Guard

- bridge route is stable enough to present a meaningful choice

---

## 6.13 DECISION — Future

### Purpose

Present one irreversible, clearly framed choice.

### Accepted commands

- `CHOOSE_TRUST`
- `CHOOSE_SEAL`
- `CHOOSE_TRANSFER`
- `CONFIRM_DECISION`

### Transitions

```text
DECISION → TRUST_ENDING
DECISION → SEAL_ENDING
DECISION → TRANSFER_ENDING
```

### Guards

- a valid option is selected
- confirmation is deliberate
- no previous outcome exists for the active run

### Checkpoint

Persist selected outcome immediately after confirmation.

---

## 7. Transition Table

| From | Event/Reason | To | Checkpoint |
|---|---|---|---|
| BOOT | APP_READY | CALIBRATION | No |
| CALIBRATION | CALIBRATION_CONFIRMED | POWER_OFF | No |
| POWER_OFF | POWER_SEQUENCE_CONFIRMED | POWER_RESTORED | Yes |
| POWER_RESTORED | POWER_PRESENTATION_COMPLETE | SIGNAL_TUNING | No |
| SIGNAL_TUNING | LOCK_THRESHOLD_MAINTAINED | SIGNAL_LOCKED | Yes |
| SIGNAL_LOCKED | SIGNAL_REVEAL_COMPLETE | RADAR_TRACKING | No |
| RADAR_TRACKING | RADAR_CONTACT_ACQUIRED | VISUAL_CONTACT | Yes |
| VISUAL_CONTACT | ENTITY_REVEAL_COMPLETE | HAND_SYNC | No |
| HAND_SYNC | HAND_SYNC_COMPLETED | CONTACT_ACKNOWLEDGED | Yes |
| CONTACT_ACKNOWLEDGED | CONTINUE_REQUESTED | INTENT_ANALYSIS | No |
| INTENT_ANALYSIS | INTENT_CLASSIFIED | BRIDGE_ROUTING | Yes |
| BRIDGE_ROUTING | BRIDGE_STABILIZED | DECISION | Yes |
| DECISION | DECISION_CONFIRMED | ending state | Yes |

---

## 8. Utility and Recovery Modes

Utility modes should not replace the canonical narrative state unless absolutely necessary.

Recommended orthogonal flags:

```js
{
  paused: false,
  hidden: false,
  inputLocked: false,
  recovering: false,
  reducedMotion: false,
  degradedRendering: false
}
```

### Document hidden

- pause gameplay clock
- suspend active hold and tracking progression
- suspend expensive rendering updates
- preserve canonical state

### Pointer capture lost

- cancel current gesture
- preserve accumulated mechanic progress according to mechanic rules
- restore neutral control visuals

### Render recovery

- rebuild presentation from current state snapshot
- do not replay already-consumed narrative events

### Restart

Two restart modes:

- `RESTART_CHAPTER`: load latest stable checkpoint
- `RESTART_EXPERIENCE`: clear transient session state and return to calibration

Durable visit history and accessibility preferences remain unless explicitly reset.

---

## 9. Guard Design

Guards must be:

- pure functions
- deterministic
- free of rendering dependencies
- independently testable
- explicit about rejection reason

Example:

```js
function canLockSignal(context) {
  if (context.lockProgress < 1) {
    return { allowed: false, reason: "LOCK_PROGRESS_INCOMPLETE" };
  }

  return { allowed: true };
}
```

Do not hide guard conditions inside animation callbacks.

---

## 10. Entry and Exit Actions

Entry and exit actions may emit commands or effects, but must not recursively trigger uncontrolled transitions.

Use an effect queue:

```text
ENTER SIGNAL_LOCKED
→ queue audio cue
→ queue camera intent
→ queue waveform stabilization
→ publish view model
```

Effects are executed after state replacement, so all consumers observe the new canonical state.

---

## 11. Presentation Completion

Some states require a cinematic presentation beat before the next interaction.

Rules:

- presentation completion must be represented by a command
- the command must be idempotent
- a safe timeout or skip path must exist
- reduced-motion mode may complete via an alternate presentation
- interrupted animation must reconcile to the target snapshot

The animation library is never the owner of narrative truth.

---

## 12. Persistence and Resume

Resume only from stable checkpoints.

On load:

1. migrate persisted data
2. validate checkpoint
3. initialize the checkpoint state
4. rebuild its canonical presentation
5. discard transient interaction progress

Recommended resume mapping:

| Saved checkpoint | Resume state |
|---|---|
| POWER_RESTORED | SIGNAL_TUNING |
| SIGNAL_LOCKED | RADAR_TRACKING |
| VISUAL_CONTACT | HAND_SYNC |
| CONTACT_ACKNOWLEDGED | CONTACT_ACKNOWLEDGED |

This prevents users from resuming in the middle of an animation or active hold.

---

## 13. Replay Rules

A replay starts a new session but may read durable memory.

Examples of permitted replay differences:

- shorter calibration
- altered first-visit copy
- subtle environmental acknowledgment
- previously selected ending marker

Replay must not silently skip core mechanics unless the user explicitly chooses chapter replay.

---

## 14. Analytics Events

Record only experience-level events, not raw invasive input streams.

Recommended events:

```text
experience_started
state_entered
state_completed
state_abandoned
checkpoint_resumed
input_mode_used
reduced_motion_used
quality_tier_selected
experience_completed
ending_selected
```

Useful state metrics:

- duration
- attempts
- completion progress
- rejection reason count
- input modality

---

## 15. Required Automated Tests

### Golden path

Complete the full current sequence from `BOOT` to `CONTACT_ACKNOWLEDGED`.

### Duplicate completion

Send each completion command multiple times and verify only one transition occurs.

### Invalid command

Send commands from unrelated states and verify no state mutation occurs.

### Hidden-tab hold

Pause during `HAND_SYNC`; verify progress does not advance while hidden.

### Pointer cancellation

Cancel lever, tuner, radar, and contact interactions; verify clean neutral state.

### Deterministic radar

Run the same fixed-clock sequence twice and verify identical target positions and scores.

### Resume

Persist every checkpoint and verify it resumes into its mapped stable state.

### Reduced motion

Complete all cinematic states using reduced-motion presentation paths.

### Keyboard-only

Complete every current mechanic without pointer input.

### Presentation interruption

Interrupt each timeline and verify the renderer reconciles to the canonical target snapshot.

---

## 16. Debug Transition Log

Every transition log entry should include:

```js
{
  index: 7,
  from: "RADAR_TRACKING",
  to: "VISUAL_CONTACT",
  reason: "RADAR_CONTACT_ACQUIRED",
  at: 28102.4,
  durationInPreviousState: 12640.8,
  commandSource: "keyboard",
  sessionId: "..."
}
```

Rejected transitions should be logged separately in development mode.

---

## 17. Definition of Done

The state machine is implementation-ready when:

- every current state has explicit entry, update, and exit behavior
- every transition has a named reason and guard
- duplicate commands cannot skip states
- all gameplay timing uses the shared clock
- hidden-tab behavior is deterministic
- checkpoints resume into stable states
- rendering can rebuild from any current state snapshot
- pointer, touch, and keyboard use the same command model
- all golden-path and interruption tests pass
- future states can be added without changing existing mechanic contracts
