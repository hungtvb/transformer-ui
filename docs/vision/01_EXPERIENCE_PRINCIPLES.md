# PROJECT TITAN — Experience Principles

These principles are mandatory constraints for design, engineering, art, audio, and AI-assisted implementation. They exist to prevent the project from drifting back into a generic WebGL showcase.

## 1. The user must do, not only watch

Important moments should be unlocked through action.

Preferred verbs:

- pull
- rotate
- hold
- align
- track
- stabilize
- connect
- choose

Avoid relying on:

- next buttons
- auto-playing sequences
- scroll-triggered section changes with no agency
- decorative hover interactions

A cinematic sequence may follow an action, but it should feel earned.

## 2. Every interaction needs anticipation, feedback, and consequence

A valid interaction has three stages:

```text
Anticipation → Feedback → Consequence
```

Example: restoring power

- Anticipation: resistance, dead indicators, warning copy.
- Feedback: lever movement, light ramp, audio hum, changing readouts.
- Consequence: the station wakes and a new mission becomes available.

If an input changes only a number, it is incomplete.

## 3. Presence is more valuable than spectacle

The entity should feel attentive, deliberate, and continuous.

Prioritize:

- eye tracking
- delayed acknowledgement
- subtle breathing
- posture changes
- reaction to noise or user hesitation
- behavior that continues during idle moments

Deprioritize:

- constant explosions
- bloom-heavy reveals
- random particle bursts
- repeated camera shake

A quiet response can carry more meaning than a large effect.

## 4. Reveal information in layers

Do not show the complete entity early.

Preferred reveal order:

```text
Signal
→ Sound
→ Shadow
→ Scale reference
→ Partial silhouette
→ Eye contact
→ Hand contact
→ Full understanding
```

Mystery is lost when the answer is visible before the question forms.

## 5. Scale requires reference

A large model is not enough.

Scale should be communicated through:

- window frames
- station architecture
- atmospheric fog
- delayed sound
- parallax
- camera position
- objects crossing in front of the entity
- partial framing that exceeds the viewport

Never center the full entity like a product model unless the story explicitly earns that composition.

## 6. UI belongs to the world

Primary controls should exist as station objects:

- lever
- tuner
- radar
- contact surface
- route switch
- emergency release
- physical monitors

Overlay UI is reserved for:

- calibration
- legal text
- accessibility alternatives
- system recovery
- platform warnings

Avoid floating glass cards, generic dashboards, and unexplained HUD decorations.

## 7. Silence is an authored state

The experience must contain quiet moments.

Silence can communicate:

- isolation
- uncertainty
- attention
- scale
- emotional connection

Do not fill every second with music, alarms, text, or motion.

## 8. Audio carries story information

Audio is not a final polish layer.

Every act should define:

- ambient bed
- mechanical palette
- signal language
- spatial position
- impact cues
- silence points

Users should sometimes hear evidence before seeing it.

## 9. Motion must communicate weight

Heavy mechanical movement follows:

```text
Preparation
→ Load transfer
→ Acceleration
→ Impact
→ Recovery
```

Avoid simple linear transforms and identical easing across all parts.

Movement should include:

- anticipation
- secondary motion
- overshoot where physically plausible
- settling
- sound timing
- environmental reaction

## 10. The camera is a character, not a utility

Avoid unrestricted orbit controls as the default experience.

Use authored camera behavior:

- shoulder framing
- handheld drift
- slow push-in
- crash zoom only for narrative shock
- rack focus when depth-of-field is available
- constrained look-around
- spline movement for story transitions

User input may influence the camera, but should not destroy composition or scale.

## 11. Color is part of the reveal

The opening should be restrained, industrial, and desaturated.

Color enters with meaning:

- amber: station power and warning state
- cyan: unknown intelligence and signal lock
- red: danger or unstable system state
- full entity color: earned reveal, not default presentation

Avoid blue glow everywhere.

## 12. Every 15–20 seconds needs new information

The new information does not need to be louder.

It may be:

- a new sound source
- a changed objective
- a moving target
- a visual clue
- an unexpected reaction
- a system failure
- a remembered detail

The user should regularly update their understanding of the situation.

## 13. Mobile is a distinct staging, not a smaller desktop

Mobile should adapt:

- composition
- touch targets
- hold duration
- gesture conflict
- camera framing
- particle count
- post-processing
- orientation changes
- safe areas
- vibration feedback

Do not simply scale down desktop typography and controls.

## 14. Accessibility alternatives must preserve meaning

Accessibility is not a separate simplified product.

Required alternatives should preserve the same narrative outcome:

- keyboard control for physical inputs
- reduced-motion camera path
- visible captions for important audio cues
- screen-reader status updates
- high-contrast state indicators
- non-timing-critical alternatives where possible

The experience may change presentation, but not remove agency or story.

## 15. Performance is a creative constraint

Visual effects must have budgets.

Before adding an effect, define:

- expected draw-call cost
- shader cost
- memory cost
- mobile fallback
- quality-tier behavior
- story value

If an effect does not materially improve the experience, remove it.

## 16. The world must remain alive during idle time

When the user pauses, the world should not appear frozen.

Possible idle behaviors:

- CRT flicker
- dust drift
- electrical instability
- distant movement
- entity observation
- changing radio noise
- subtle environmental audio

Idle life must be varied enough to avoid an obvious short loop.

## 17. User error should create tension, not punishment

Failure states should be recoverable and narratively useful.

Examples:

- tuner drifts and reveals a false signal
- radar loses lock and the object changes direction
- unstable power causes lights to fail temporarily
- bridge alignment produces a more dangerous arrival

Avoid hard resets unless the fiction justifies them.

## 18. Memory should become part of the relationship

Return visits may change:

- opening copy
- entity posture
- acknowledgement timing
- available dialogue
- hidden path
- system state

Persistent memory should be subtle and privacy-respecting. Local storage is acceptable for non-sensitive state.

## 19. Branching must change experience, not only text

A choice is meaningful only if it changes at least two layers:

- animation
- camera
- audio
- lighting
- world state
- available mission
- ending

Changing a subtitle alone is not a branch.

## 20. Original identity is mandatory

The long-term project must not depend on Optimus Prime, Transformers, Hasbro, Paramount, or any recognizable licensed character.

The entity, station, symbols, language, and story should become original IP.

Inspiration may come from cinematic science fiction, but execution must establish its own silhouette, mythology, and emotional tone.

## Anti-pattern checklist

Reject or redesign a feature when it resembles:

- a SaaS hero section
- a model viewer
- a generic neon HUD
- a Three.js effects demo
- a button grid labeled Scan / Fire / Transform / Matrix
- a scroll page where each section only changes copy
- a cinematic that ignores user input
- an interaction with no consequence
- a mobile layout created only with smaller fonts

## Feature review checklist

Before implementation:

- [ ] The user action is clear.
- [ ] The intended emotion is named.
- [ ] The interaction has anticipation, feedback, and consequence.
- [ ] The feature advances story or presence.
- [ ] The visual language matches the industrial station world.
- [ ] Audio intent is defined.
- [ ] Mobile behavior is designed.
- [ ] Keyboard and reduced-motion behavior are defined.
- [ ] Performance cost and fallback are known.
- [ ] The feature belongs to a roadmap milestone.

Before merge:

- [ ] The feature remains understandable without external explanation.
- [ ] Input cannot become stuck after pointer cancellation.
- [ ] Animations do not stack from repeated activation.
- [ ] State transitions are deterministic.
- [ ] The world visibly or audibly changes.
- [ ] The feature creates no regression in previous missions.
- [ ] Documentation is updated.
