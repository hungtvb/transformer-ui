# PROJECT TITAN — Camera Bible

> Camera is not a spectator. Camera is the user's body inside the world.

## 1. Purpose

This document defines the camera language for PROJECT TITAN. Every shot, transition, reveal, interaction, and cinematic beat must follow these rules unless a documented exception is approved.

The camera exists to create presence, scale, tension, discovery, and emotional connection. It must never behave like a generic Three.js orbit camera or a product viewer.

## 2. Core Principles

### 2.1 The camera has mass

Camera motion must imply a physical operator, mounted rig, control-room observer, or constrained device. Movement has inertia, drag, recovery, and limits.

Avoid:

- Instant position jumps.
- Perfectly linear travel.
- Frictionless orbiting.
- Continuous floating without a narrative reason.

Use:

- Anticipation before movement.
- Acceleration into travel.
- Overshoot at the destination.
- Settling and micro-correction.

### 2.2 Scale is revealed through reference

The entity must not be framed alone against an empty background. Scale is communicated by foreground rails, observation glass, room architecture, aircraft, weather, city structures, dust, and sound delay.

A close-up is valuable only when the audience knows what it is close to.

### 2.3 Discovery precedes explanation

The camera reveals information in fragments:

1. Environmental reaction.
2. Shadow or reflection.
3. Partial silhouette.
4. Mechanical detail.
5. Eye contact.
6. Wider scale reveal.

Do not reveal the complete entity at the beginning of an act.

### 2.4 Camera movement follows story state

The camera must respond to narrative intent:

- Curiosity: slow lateral drift, partial occlusion, restrained field of view.
- Tension: reduced movement, narrow framing, unstable micro-shake.
- Impact: impulse, displacement, delayed recovery.
- Awe: controlled pullback or vertical reveal with stable horizon.
- Connection: close, quiet, minimal movement.
- Choice: balanced composition and reduced visual pressure.

### 2.5 User input influences, not destroys, direction

Pointer, drag, scroll, touch, and gyro may add controlled offsets to a directed camera rig. User input must not allow the camera to break composition, clip geometry, expose unfinished assets, or miss a story beat.

## 3. Camera Rig Model

The production camera should use a hierarchy:

```text
CameraDirector
└── SequenceRig
    └── ImpactRig
        └── InputRig
            └── BreathingRig
                └── Camera
```

Responsibilities:

- **CameraDirector**: selects shot and story target.
- **SequenceRig**: follows authored spline or keyframed movement.
- **ImpactRig**: applies footsteps, collisions, and structural vibration.
- **InputRig**: applies clamped pointer, touch, or gyro offsets.
- **BreathingRig**: subtle living movement and operator sway.
- **Camera**: projection, exposure-linked values, and final look direction.

Each layer must be independently enabled, tuned, and disabled.

## 4. Approved Shot Types

### 4.1 Observation Window Shot

The primary control-room composition.

- Foreground architecture frames the exterior.
- Glass reflections reinforce the boundary.
- The entity appears beyond the glass, not as a centered hero model.
- User input may shift the viewpoint slightly but cannot leave the station.

Use for signal detection, tracking, first contact, and scale.

### 4.2 Restricted Handheld

A restrained operator-style camera.

- Low-frequency position sway.
- Very small rotational drift.
- No constant noise on every axis.
- Strong impacts add a separate short impulse.

Use for tension and environmental instability.

### 4.3 Spline Discovery Shot

The camera follows a designed path while scroll or gameplay controls progress.

- The path must have authored points of interest.
- Look targets should blend independently from position.
- Speed changes must align with discoveries.
- Scroll maps to timeline progress, not raw distance.

Use for revealing the station, exterior landscape, and full scale.

### 4.4 Push-In

A slow move toward a meaningful detail.

Use for:

- Signal monitor.
- Eye reveal.
- Hand approaching glass.
- Decision mechanism.

The push-in must stop before the frame becomes visually flat.

### 4.5 Pullback Scale Reveal

Begin with a comprehensible detail, then reveal the wider scale.

Examples:

- Eye → face → head beyond the observation window.
- Mechanical hand → arm → torso outside the station.
- Station window → exterior structure → colossal entity.

The pullback should be stable and deliberate. Do not combine it with excessive shake.

### 4.6 Crash Zoom

Reserved for rare threat recognition or sudden identification.

Rules:

- Maximum one major crash zoom per act.
- Must reveal new information.
- Must include focus and audio response.
- Must not be used as decoration.

### 4.7 Rack Focus

Focus transitions between foreground control-room objects and the exterior entity.

Use to establish that both spaces coexist physically. When real depth of field is too expensive, simulate it with controlled blur, contrast, or exposure shifts.

### 4.8 Impact Camera

Used for footsteps, hand contact, structural failure, or bridge instability.

Sequence:

1. Anticipatory stillness.
2. Primary displacement.
3. Secondary vibration.
4. Asymmetric recovery.
5. Residual environmental motion.

The camera should not vibrate uniformly like a CSS shake effect.

## 5. Forbidden Patterns

Do not use:

- Unrestricted OrbitControls in production.
- Continuous 360-degree model rotation.
- Camera paths designed only to show geometry.
- Constant Dutch angle.
- Constant handheld noise.
- Random shake without an in-world force.
- Perfectly centered robot hero framing for long durations.
- Extreme field-of-view changes without narrative motivation.
- Camera clipping through station geometry.
- Scroll snapping between unrelated compositions.

## 6. Composition Rules

### 6.1 Preserve foreground depth

At least one foreground or midground reference should be present during major scale shots.

### 6.2 Use negative space intentionally

Empty space should suggest uncertainty, direction of movement, or incoming threat. It must not exist because the scene lacks art.

### 6.3 Eye-line discipline

When the entity recognizes the user, the optic or face target must align close enough to the viewer's expected eye line to feel deliberate. Head tracking must be subtle and mechanically plausible.

### 6.4 Do not reveal everything at once

Partial occlusion is preferred. Window frames, darkness, fog, glare, steam, and architecture may hide information.

### 6.5 Mobile composition is authored separately

Mobile is not a cropped desktop camera.

Mobile requirements:

- More vertical staging.
- Larger interaction target visibility.
- Reduced lateral travel.
- Closer story-relevant framing.
- Safe-area-aware UI and camera composition.
- Gyroscope input only as an optional clamped layer.

## 7. Lens and Projection Guidance

Recommended perspective ranges:

- Control room establishing: 40–55 mm equivalent.
- Tension close-up: 55–85 mm equivalent.
- Colossal scale reveal: 24–35 mm equivalent, used carefully.
- Mechanical detail: 70–100 mm equivalent.

Avoid ultra-wide distortion unless the narrative intentionally communicates disorientation or impossible scale.

Field-of-view transitions should be slow and limited. Large FOV changes require an authored shot reason.

## 8. Motion Timing

Typical timing ranges:

- Micro look adjustment: 0.25–0.7 s.
- Directed push-in: 1.5–4 s.
- Scale pullback: 3–8 s.
- Impact displacement: 40–120 ms.
- Secondary vibration: 250–900 ms.
- Recovery: 0.6–2 s.
- Quiet connection hold: 2–6 s.

Timing must be adapted to audio and entity weight.

## 9. Camera and Interaction

### Pointer and touch

- Apply normalized, damped offsets.
- Clamp yaw and pitch.
- Reduce influence during authored critical beats.
- Restore authored framing gradually after input ends.

### Scroll

- Scroll controls sequence progress or camera rail position.
- Use smoothing and velocity limits.
- Never map wheel delta directly to camera position.
- Narrative gates may temporarily cap progress until interaction succeeds.

### Gyroscope

- Request permission explicitly where required.
- Treat gyro as optional enhancement.
- Clamp aggressively.
- Provide a non-gyro equivalent.

## 10. Camera and Performance

- Use one active production camera.
- Avoid expensive depth-of-field unless quality tier allows it.
- Prefer authored focus simulation for mobile.
- Disable or reduce motion blur on mobile and reduced-motion settings.
- Camera shake must not trigger unnecessary scene recalculation.
- Frustum and clipping planes must remain tight enough for depth precision.

## 11. Accessibility

With `prefers-reduced-motion`:

- Remove high-frequency shake.
- Reduce travel distance.
- Replace crash zooms with cuts or fades.
- Preserve all story information.
- Keep interactive targets stable.

Motion reduction must not remove progression or required feedback.

## 12. Shot Review Checklist

Before approving a camera sequence, verify:

- [ ] The shot has a narrative purpose.
- [ ] The user can understand spatial relationships.
- [ ] Scale uses visible references.
- [ ] Motion includes weight and recovery.
- [ ] User input cannot break the composition.
- [ ] Mobile has an authored framing.
- [ ] Reduced-motion behavior is defined.
- [ ] The shot does not resemble a product model viewer.
- [ ] Camera motion and audio cues are synchronized.
- [ ] Performance cost fits the target quality tier.

## 13. Acceptance Criteria

A camera feature is complete only when:

1. Its emotional intent is documented.
2. Desktop and mobile framing are reviewed.
3. Pointer, touch, and reduced-motion behaviors are tested.
4. No unrestricted orbit behavior is exposed.
5. Major movements align with audio and world reaction.
6. The shot preserves a readable foreground, midground, or background relationship.
7. The sequence remains understandable without debug UI.

## 14. North Star Test

Ask one question:

> Does the camera make the user feel physically present, or does it merely show the scene?

If it only shows the scene, redesign the shot.
