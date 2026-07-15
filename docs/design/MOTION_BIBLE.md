# PROJECT TITAN — Motion Bible

> Motion communicates mass, intention, intelligence, and consequence.

## 1. Purpose

This document defines the motion language for PROJECT TITAN. It applies to mechanical entities, control-room machinery, environmental systems, UI props, camera impulses, transitions, particles, and interactive controls.

Motion must never exist only to make the page feel busy. Every movement must communicate at least one of the following:

- Physical mass.
- Mechanical function.
- Emotional intent.
- Environmental consequence.
- Story progression.
- User feedback.

## 2. Core Motion Formula

All meaningful motion follows this structure:

```text
Anticipation
→ Acceleration
→ Impact or Arrival
→ Recovery
→ Residual Motion
```

Not every action needs all five stages at full strength, but no major action should jump directly from rest to result.

### Anticipation

The world prepares for movement.

Examples:

- Servo tension before a hand moves.
- Light dimming before a power surge.
- Structural creak before a footstep impact.
- Cursor resistance before a lever breaks free.

### Acceleration

Movement gains speed according to mass and force.

Heavy systems accelerate slowly unless driven by extreme energy.

### Impact or Arrival

The action reaches its functional or emotional destination.

Impact must be expressed across multiple channels when appropriate:

- Object motion.
- Camera response.
- Light response.
- Audio transient.
- UI vibration.
- Particles or debris.

### Recovery

The moving system absorbs force, settles, or corrects itself.

Recovery should rarely be perfectly symmetrical.

### Residual Motion

Secondary systems continue reacting after the main event:

- Hanging cables swing.
- Dust falls.
- Glass vibrates.
- Light fixtures oscillate.
- Mechanical fingers make small corrections.

Residual motion is a primary source of believability.

## 3. Weight Classes

Every animated object belongs to a weight class.

### Class A — Micro

Examples:

- Indicator needles.
- CRT flicker.
- Dust particles.
- Small switches.

Characteristics:

- Fast response.
- Small overshoot.
- Short recovery.
- High-frequency detail permitted.

### Class B — Human-scale machinery

Examples:

- Lever.
- Radar reticle.
- Console hatch.
- Sliding panel.

Characteristics:

- Noticeable friction.
- Moderate acceleration.
- Tactile stop or latch.
- Clear user feedback.

### Class C — Industrial systems

Examples:

- Blast door.
- Antenna assembly.
- Bridge stabilizer.
- Observation shutter.

Characteristics:

- Slow anticipation.
- Multi-stage movement.
- Strong environmental sound.
- Visible vibration and mechanical correction.

### Class D — Colossal entity

Examples:

- Head turn.
- Arm raise.
- Hand approaching glass.
- Footstep.
- Torso shift.

Characteristics:

- Long anticipation.
- Delayed environmental response.
- Significant inertia.
- Minimal unnecessary movement.
- Secondary systems move after the primary mass.
- The environment reacts before, during, and after the motion.

## 4. Entity Motion Rules

### 4.1 The entity never idles like a game menu character

Avoid repeating loops that expose their cycle.

Use layered, asynchronous behavior:

- Slow structural breathing.
- Servo corrections.
- Optic focus changes.
- Small head orientation shifts.
- Weight transfer.
- Delayed response to user input.

Idle motion should suggest observation and thought, not animation playback.

### 4.2 Recognition has delay

The entity does not instantly track the pointer.

Recommended response sequence:

1. Optics notice movement.
2. Head begins rotating.
3. Torso or shoulder follows if required.
4. Motion overshoots slightly.
5. Mechanical correction settles the gaze.

This delay creates intelligence and mass.

### 4.3 Large body parts lead secondary parts

Examples:

- Upper arm begins, forearm follows, fingers settle last.
- Torso shifts, shoulder armor follows, cables react afterward.
- Head turns, antenna or side panels lag behind.

Do not animate all parts with identical timing curves.

### 4.4 Stillness is intentional

A colossal entity should often remain nearly still. Small deliberate movement feels more alive than constant activity.

## 5. Interaction Motion

Every physical interaction requires three layers.

### 5.1 Resistance

The control must resist initial input.

Examples:

- Lever has a dead zone and friction.
- Dial has detents.
- Radar reticle has inertia.
- Contact pad requires sustained pressure.

### 5.2 Feedback

The system acknowledges input continuously.

Feedback may include:

- Mechanical displacement.
- Audio pitch change.
- Light intensity.
- Meter movement.
- Haptic vibration.
- World reaction.

### 5.3 Consequence

Completion changes the state of the world.

A lever does not merely reach 100%. It powers lights, wakes displays, changes ambience, and unlocks the next story state.

## 6. Easing Language

Use easing based on material and force, not visual fashion.

### Approved patterns

#### Heavy mechanical start

- Slow ease-in.
- Strong acceleration.
- Controlled deceleration.
- Small asymmetric overshoot.

#### Magnetic or energy lock

- Fast attraction near the target.
- Sharp stop.
- Short vibration or pulse.

#### Hydraulic movement

- Smooth acceleration.
- Near-linear middle phase.
- Dampened stop.

#### Structural impact

- Instant impulse.
- Fast first rebound.
- Several decreasing irregular oscillations.

### Avoid

- Generic `easeOut` on every animation.
- Elastic bounce on heavy machinery.
- Cartoon spring motion unless explicitly justified.
- Perfect sine loops for mechanical behavior.
- Identical duration and easing across unrelated systems.

## 7. Timing Guidance

Typical ranges are starting points, not fixed values.

### Micro systems

- Indicator response: 80–250 ms.
- Switch press: 100–300 ms.
- Light pulse: 150–600 ms.

### Human-scale controls

- Lever travel: 500–1400 ms depending on user input.
- Dial settle: 200–700 ms.
- Panel open: 700–1800 ms.

### Industrial machinery

- Door unlock anticipation: 500–1500 ms.
- Door travel: 2–6 s.
- Stabilizer deployment: 3–8 s.

### Colossal entity

- Eye recognition: 200–800 ms.
- Head turn: 1–4 s.
- Arm raise: 2–7 s.
- Hand-to-glass approach: 4–10 s.
- Footstep full sequence: 3–8 s.

Major motion should leave time for the user to perceive scale.

## 8. Impact Design

A major impact must propagate through the world.

Recommended propagation order:

1. Source movement.
2. Primary audio transient.
3. Camera displacement.
4. Structural response.
5. Light and UI disturbance.
6. Dust, debris, steam, or glass vibration.
7. Long-tail low-frequency sound.

The timing between layers creates scale. Not every reaction should happen on the same frame.

### Footstep example

```text
Weight shifts
→ distant servo sound
→ foot enters frame
→ ground contact
→ low-frequency impact
→ camera impulse
→ room structure vibrates
→ dust falls
→ lights swing
→ residual rumble fades
```

## 9. Environmental Motion

The environment must remain alive even without user action.

Approved ambient systems:

- Low-frequency cable sway.
- Uneven ventilation pulses.
- Steam release with non-uniform intervals.
- Dust drift affected by impact events.
- Light instability linked to power state.
- Radar and CRT motion linked to system state.

Avoid synchronized looping across multiple props.

## 10. UI as Physical Motion

UI elements inside PROJECT TITAN are world props, not generic overlays.

Rules:

- Meters have inertia.
- Warnings flicker according to power instability.
- Labels do not slide in without an in-world display reason.
- Screen transitions may use scan refresh, relay switching, or signal loss.
- Important state changes must be readable without excessive decoration.

DOM motion must match WebGL motion in timing and force.

## 11. Scroll-Driven Motion

Scroll controls timeline progress, not direct object translation.

Requirements:

- Smooth input velocity.
- Clamp acceleration.
- Preserve authored pauses.
- Gate progress when gameplay interaction is required.
- Allow reverse playback only where narratively and technically safe.
- Avoid making heavy actions scrub unnaturally under small wheel movements.

For critical mechanical actions, scroll may initiate or advance a phase, but the motion should complete under authored physics-inspired timing.

## 12. Pointer, Touch, and Gyroscope Motion

### Pointer

- Use damped normalized input.
- Apply response delay to colossal systems.
- Avoid one-to-one robotic head tracking.

### Touch

- Larger gesture threshold.
- Stronger visual state feedback.
- Do not depend on hover.
- Handle pointer cancellation safely.

### Gyroscope

- Use as a subtle viewpoint or reflection offset.
- Never make gyro mandatory.
- Apply smoothing and strict limits.

## 13. Reduced Motion

When reduced motion is enabled:

- Remove high-frequency shake.
- Reduce parallax amplitude.
- Shorten or simplify long travel.
- Preserve anticipation, state change, and consequence.
- Replace large displacement with light, sound, and static composition changes.
- Keep all gameplay interactions usable.

Reduced motion is a different presentation, not a missing experience.

## 14. Performance Rules

- Animate transforms rather than rebuilding geometry.
- Reuse particles and temporary meshes through pools.
- Avoid per-frame allocations.
- Use delta-time-based motion.
- Pause nonessential simulation when the tab is hidden.
- Reduce secondary motion by quality tier, never remove critical state feedback.
- Keep motion deterministic enough for testing and replay.

## 15. Forbidden Motion Patterns

Do not use:

- Constant floating robot animation.
- CSS shake applied uniformly to the full page.
- Random particle bursts without a source.
- Identical tween duration for all body parts.
- Repeating loops with visible reset points.
- Fast movement used to hide weak assets.
- Excessive bounce or elastic easing.
- Motion that competes with required interaction.
- Camera, lighting, and entity animation firing independently during one event.

## 16. Motion Review Checklist

Before approving an animation, verify:

- [ ] The movement communicates function, emotion, or consequence.
- [ ] The object's weight class is clear.
- [ ] Anticipation exists where needed.
- [ ] Acceleration matches mass and force.
- [ ] Impact propagates through appropriate systems.
- [ ] Recovery is visible and not perfectly symmetrical.
- [ ] Secondary parts lag primary mass.
- [ ] Desktop and mobile input behavior are tested.
- [ ] Motion uses delta time where frame-rate independence matters.
- [ ] Reduced-motion behavior is defined.
- [ ] The animation does not expose a repetitive loop.
- [ ] Audio timing is coordinated.

## 17. Acceptance Criteria

A motion feature is complete only when:

1. Its narrative and physical intent are documented.
2. The weight class and timing profile are defined.
3. Interaction feedback is continuous and clear.
4. Consequence changes the world or story state.
5. Frame-rate behavior is stable across target devices.
6. Pointer cancellation and interruption states are handled.
7. Reduced-motion mode preserves meaning.
8. Audio, camera, lighting, and environment react as one authored event.

## 18. North Star Test

Ask:

> Does this motion make the world feel heavier, more intelligent, or more alive?

If the answer is no, remove or redesign it.
