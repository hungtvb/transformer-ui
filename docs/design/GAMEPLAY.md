# PROJECT TITAN — Gameplay Bible

## Purpose

This document defines how the user participates in PROJECT TITAN. It covers the core gameplay loop, interaction standards, state progression, failure handling, replay, input, accessibility, feedback, and production acceptance criteria.

PROJECT TITAN is a narrative interaction experience, not a traditional game and not a passive WebGL film. Every major story beat must be earned through user action, and every action must change the world in a visible, audible, or narrative way.

## Core gameplay promise

The user should feel that they are operating a physical place and communicating with a living intelligence.

The interaction model follows this loop:

```text
Observe → Understand → Manipulate → Receive feedback → Change world state → Discover consequence
```

A feature that does not participate in this loop is probably decoration and should be removed.

## Experience goals

1. The user understands what can be manipulated without long instructions.
2. Controls feel physical rather than like ordinary web forms.
3. Progress is based on deliberate action, not random clicking.
4. Failure never causes a dead end.
5. The entity reacts to the user as an attentive character.
6. Desktop and mobile use equivalent intent, not identical control geometry.
7. Interaction remains possible with keyboard and reduced-motion settings.

## Core gameplay loop

### 1. Read the environment

The user notices a system state through light, audio, motion, labels, and instrument behavior.

### 2. Identify the active control

The environment focuses attention on one physical task without covering the screen in tutorial UI.

### 3. Manipulate the control

The user drags, turns, holds, aligns, routes, or selects.

### 4. Maintain stability

Several interactions require sustained accuracy rather than a single click.

### 5. Receive layered feedback

Every interaction should update at least three channels:

- local control response,
- room or world response,
- story or system state.

### 6. Unlock a reveal

Successful completion changes what the user understands about the station or entity.

## Interaction vocabulary

PROJECT TITAN prioritizes a small set of reusable physical verbs.

| Verb | Use | Required feedback |
|---|---|---|
| Pull | Power, locks, shutters | Resistance, travel, mechanical sound, world activation |
| Rotate | Frequency, alignment, routing | Detents, changing signal, value feedback |
| Drag | Radar, camera inspection, cable routing | Inertia, boundary resistance, target response |
| Hold | Contact, charge, stabilization | Continuous progress, rising tension, cancel recovery |
| Balance | Bridge or signal stability | Two-sided pressure, drift, warning feedback |
| Match | Signal pattern or pulse | Rhythm response, recognition, confirmation |
| Choose | Narrative consequence | Cost preview, confirmation, irreversible result |

Ordinary click interactions are reserved for acknowledgement, menu-level actions, and accessibility alternatives.

## Gameplay state machine

```text
BOOT
  ↓
CALIBRATED
  ↓
POWER_RESTORE
  ↓
SIGNAL_TUNE
  ↓
TARGET_TRACK
  ↓
FIRST_CONTACT
  ↓
SIGNAL_EXCHANGE
  ↓
THREAT_DETECTED
  ↓
CHOICE_PENDING
  ├── TRUST_ENDING
  ├── DEFENSE_ENDING
  └── SEVER_ENDING
```

### State rules

- Only one primary mission may be active at a time.
- Previous controls become stable world props after completion.
- A state transition must be event-driven, not based on arbitrary timeout alone.
- Visual transition completion and gameplay availability must be synchronized.
- State entry and exit must be idempotent.
- Refreshing the page starts a fresh run unless an explicit resume system is later approved.

## Mission design

# Mission 1 — Restore Power

## Objective

Bring the station from emergency power to operational state.

## Primary interaction

Pull the main lever through its full travel.

## Continuous feedback

- control travel,
- percentage value,
- light intensity,
- fan speed,
- CRT boot progress,
- renderer exposure,
- mechanical audio.

## Completion condition

Power remains above the operational threshold long enough to prevent accidental completion.

## Recovery

If released early, power settles at the current value or slowly decays according to final implementation. The user is never reset without explanation.

## Keyboard alternative

- Arrow keys: small increments.
- Shift + Arrow: large increments.
- Home: minimum.
- End: maximum.

---

# Mission 2 — Tune Signal

## Objective

Locate and stabilize the unknown carrier.

## Primary interaction

Rotate or slide through a frequency range.

## System model

Signal quality is derived from distance to the target frequency and may include controlled noise.

```text
quality = clamp(100 - distance × sensitivity + interference, 0, 100)
```

## Continuous feedback

- waveform coherence,
- static density,
- tone frequency,
- lock meter,
- exterior pulse,
- partial voice fragments.

## Completion condition

Quality remains above the lock threshold for a short sustained duration.

## Design rule

The user must be able to infer direction: feedback should clearly improve as tuning approaches the target.

---

# Mission 3 — Track Contact

## Objective

Keep the radar reticle aligned with a moving target.

## Primary interaction

Drag the reticle over the contact and maintain alignment.

## Target behavior

The target uses smooth, readable motion with changing direction and speed. It must not move so randomly that skill becomes irrelevant.

## Quality model

Tracking quality is based on reticle distance and updated using delta time.

```text
instantQuality = max(0, 100 - distance × falloff)
trackQuality += (instantQuality - trackQuality) × smoothing(delta)
```

The completion rate must remain consistent across 30 Hz, 60 Hz, and 120 Hz devices.

## Continuous feedback

- reticle state,
- target pulse,
- tracking percentage,
- radar sound,
- station vibration,
- glimpses outside the window.

## Completion condition

Tracking quality remains near maximum for the required hold duration.

## Accessibility alternative

Keyboard users move the reticle with arrow keys. Reduced-dexterity mode may reduce target speed and increase lock radius.

---

# Mission 4 — First Contact

## Objective

Synchronize the user’s hand with the entity at the glass.

## Primary interaction

Press and hold the contact surface.

## Continuous feedback

- synchronization percentage,
- hand-light intensity,
- structural vibration,
- window condensation displacement,
- entity arm movement,
- eye focus,
- harmonic audio convergence.

## Cancellation behavior

If the user releases before completion:

- progress resets or gracefully decays,
- charge-related bloom returns to baseline,
- no duplicate timer remains active,
- the entity withdraws slightly but remains attentive.

## Completion condition

Hold reaches 100% without pointer cancellation.

## Safety rule

Only one hold process may exist at a time. Handle pointer up, pointer cancel, lost capture, tab visibility change, and multi-touch.

---

# Mission 5 — Signal Exchange

## Objective

Confirm reciprocal intelligence.

## Candidate interaction

Repeat or match a short three-part pulse pattern.

## Difficulty

The first pattern must be highly readable. Later visits may use a variant.

## Feedback

The entity mirrors correct input. Incorrect input creates curiosity, not punishment.

## Completion condition

The pattern is recognized and the station translates a conceptual warning.

---

# Mission 6 — Threat Interpretation

## Objective

Understand that a second contact is approaching.

## Candidate interaction

Compare radar, energy, and signal channels; identify the anomalous route.

## Design rule

This section should create pressure without becoming a complex puzzle. The emotional function is urgency and uncertainty.

---

# Mission 7 — Choice

## Objective

Select how the station responds.

## Options

1. Route power to contact or bridge.
2. Route power to defenses.
3. Sever the link.

## Interaction

Use a physical energy-routing board or two-stage lever, not generic modal buttons.

## Required information

Before confirmation, the user must understand:

- immediate benefit,
- known cost,
- uncertainty.

## Irreversibility

The final confirmation is irreversible for the current run.

## Consequence

The selected route changes animation, lighting, audio, entity behavior, and ending state.

## Failure philosophy

PROJECT TITAN has no traditional game-over state.

Failure means one of the following:

- incomplete input,
- loss of stability,
- temporary system fallback,
- changed narrative texture,
- reduced quality outcome.

The user should never be trapped without a recovery path.

Examples:

- Releasing the power lever early pauses activation.
- Losing radar lock reduces quality but does not restart the act.
- Releasing contact early resets synchronization with clear feedback.
- Missing a pattern causes the entity to repeat it more slowly.

## Difficulty model

Difficulty is adaptive and subtle.

Possible adaptive inputs:

- device type,
- frame rate,
- pointer precision,
- repeated failed attempts,
- reduced-motion preference,
- explicit accessibility setting.

Adaptive changes may include:

- larger lock radius,
- slower target movement,
- longer grace period,
- clearer audio direction,
- stronger visual focus.

The experience must never label the user as failing.

## Input model

### Desktop

- Pointer drag for physical controls.
- Wheel or scroll only when tied to camera or timeline intent.
- Keyboard alternatives for every essential task.
- Optional pointer parallax after contact.

### Mobile

- Touch drag with larger physical targets.
- Device orientation may influence observation after explicit permission.
- Vibration is used sparingly for meaningful impact.
- Layout is recomposed, not merely scaled down.

### Keyboard

- Tab order follows active mission.
- Inactive mission controls are not focusable.
- Enter/Space activate hold or acknowledgement actions.
- Arrow keys manipulate sliders and reticles.
- Escape opens a minimal pause/accessibility layer if later implemented.

## Interaction anatomy

Every physical interaction follows this sequence:

### Anticipation

The control communicates affordance and weight before movement.

### Engagement

Pointer capture or keyboard interaction begins. Audio and local state confirm control.

### Continuous response

The world updates continuously with input.

### Threshold

Approaching success increases clarity or tension.

### Impact

Completion creates a distinct world reaction.

### Recovery

The world settles into the next stable state.

Skipping anticipation or recovery makes the interaction feel like a generic web animation.

## Feedback hierarchy

### Level 1 — Local

The manipulated object moves, lights, clicks, or resists.

### Level 2 — System

Readouts and nearby equipment react.

### Level 3 — World

Lighting, camera, audio, environment, or entity behavior changes.

### Level 4 — Narrative

A new fact, state, or choice becomes available.

Major interactions should reach all four levels.

## Replay system

Replay should reward return visits without hiding essential content.

### Stored local data

- visit count,
- previous ending,
- completed-contact flag,
- preferred quality level,
- accessibility settings.

### Return variation examples

- Calibration copy changes to “Signal recognized.”
- The entity reacts sooner after first contact.
- A radar target follows a different path.
- Signal fragments change order.
- The previous choice is subtly referenced.

### Rules

- The full experience remains playable after storage is cleared.
- No account or tracking service is required.
- Local storage errors must fail silently and safely.

## Reward model

The primary rewards are narrative and sensory:

- clearer signal,
- new environmental behavior,
- partial reveal,
- entity recognition,
- alternate ending,
- screenshot-worthy composition.

Do not use scores, coins, badges, XP, or conventional gamification.

## Session pacing

Target first complete session: approximately 5–8 minutes.

Suggested distribution:

| Segment | Target duration |
|---|---:|
| Calibration and power | 30–60 sec |
| Signal tuning | 30–60 sec |
| Tracking | 30–60 sec |
| First contact | 45–75 sec |
| Signal exchange and warning | 60–120 sec |
| Choice and ending | 60–120 sec |

Pacing should remain flexible. The user controls exploration time, while transitions remain deliberate.

## Mobile-specific gameplay rules

- Essential controls must be reachable with one thumb where practical.
- Touch targets should generally be at least 44 CSS pixels.
- Text must not compete with the active physical control.
- Heavy post-processing may degrade, but narrative feedback may not disappear.
- Gyroscope is optional and permission-gated.
- Vibration must have a disable path and must not be required for comprehension.

## Accessibility requirements

- All essential interactions have keyboard paths.
- Active mission changes are announced through accessible live status where appropriate.
- `aria-hidden` must reflect actual visibility.
- Slider semantics belong on the focusable control.
- Reduced-motion mode replaces shake and large camera travel with lighting and audio feedback.
- Color is never the only signal of state.
- Audio-only clues receive visual equivalents.

## Performance requirements

- Gameplay timing is delta-time based.
- Hidden tabs suspend expensive updates and audio.
- Pointer handlers avoid allocating objects every event where practical.
- Only the active mission runs high-frequency gameplay logic.
- Quality adaptation must preserve interaction accuracy.

## Analytics-ready event model

No analytics service is required, but code should emit internal semantic events that can be observed later:

```text
experience_entered
power_started
power_completed
signal_locked
tracking_started
tracking_completed
contact_started
contact_cancelled
contact_completed
choice_selected
ending_completed
```

Events must not contain personal data.

## Definition of done for a gameplay feature

A gameplay feature is complete only when:

- the objective is understandable,
- pointer, touch, and keyboard paths are defined,
- feedback exists at local, system, and world levels,
- cancellation and recovery are handled,
- timing is frame-rate independent,
- state entry cannot run twice accidentally,
- mobile layout is intentional,
- reduced motion remains usable,
- performance cost is measured,
- story consequence is documented,
- the feature is tested on at least one desktop and one mobile viewport.

## Anti-patterns

Do not introduce:

- buttons that merely play a cinematic with no continuous response,
- mystery interactions with no directional feedback,
- frame-count-based progression,
- pointer capture hacks or assumed pointer IDs,
- timers that can stack,
- impossible failure states,
- generic minigames disconnected from the story,
- instructions longer than the interaction itself,
- desktop controls shrunk onto mobile,
- repetitive “charge to 100%” interactions without distinct meaning.

## Gameplay review questions

Before approving a new interaction, answer:

1. What does the user learn by completing it?
2. Why must the user perform it rather than watch it?
3. What changes continuously while they manipulate it?
4. What happens if they stop halfway?
5. How does the room react?
6. How does the entity react?
7. How does it work with keyboard and touch?
8. Is its difficulty consistent across frame rates?
9. Does it create anticipation, impact, and recovery?
10. Would the story be weaker if the interaction were removed?
