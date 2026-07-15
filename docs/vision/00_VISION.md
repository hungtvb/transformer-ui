# PROJECT TITAN — Vision

> The browser is not your window. It is theirs.

## 1. Product identity

PROJECT TITAN is an **interactive cinematic browser experience** about first contact with a colossal living machine.

It is not a landing page, portfolio, product showcase, model viewer, or effects reel. The user is not a spectator reading sections. The user occupies a physical place inside the fiction, operates systems, interprets signals, and causes the story to advance.

The product should feel closer to a short playable film than to a conventional website.

## 2. North Star

The final experience should make the user believe, for a few minutes, that something intelligent exists on the other side of the screen and is aware of them.

The user should leave remembering a feeling rather than a technology stack:

> “It felt alive, and it reacted to me.”

## 3. Core promise

PROJECT TITAN promises four things:

1. **Presence** — the entity appears to exist independently of the user.
2. **Physicality** — actions have weight, resistance, feedback, and consequence.
3. **Mystery** — information is revealed through observation and interaction rather than exposition.
4. **Connection** — the emotional peak is contact, not destruction.

Spectacle supports these pillars but never replaces them.

## 4. User role

The user is the operator of an isolated orbital relay station that has been dormant for years.

They do not begin as a hero, commander, or chosen one. They begin as a person trying to understand why the station has detected an impossible signal.

The role evolves through the experience:

```text
Operator
  ↓
Investigator
  ↓
Witness
  ↓
Participant
  ↓
Decision-maker
```

The interface should reinforce this role through physical systems rather than generic buttons.

## 5. Emotional journey

The intended emotional order is:

```text
Curiosity
  ↓
Uncertainty
  ↓
Tension
  ↓
Discovery
  ↓
Awe
  ↓
Recognition
  ↓
Trust or fear
  ↓
Choice
  ↓
Memory
```

The experience must preserve this order. Revealing the entity too early, overusing loud effects, or explaining too much will collapse the emotional curve.

## 6. Signature moments

The complete experience should contain a small number of memorable moments rather than constant spectacle.

Target signature moments:

- The user physically restores power to a station that feels dead.
- A distorted signal gradually becomes an intentional voice.
- The user tracks an object before understanding its scale.
- The entity’s eye reacts to the user’s movement.
- The entity places its hand against the station glass.
- The user places their hand against a matching contact surface.
- The entity responds deliberately, proving it is aware.
- A later choice changes the outcome and justifies replay.

At least one moment should be strong enough that users want to capture or share it.

## 7. Design philosophy

### Story before technology

No effect exists only to demonstrate WebGL, shaders, particles, or animation. Technology is invisible when it works well.

### Interaction before playback

The user should unlock important moments through action. A pre-rendered sequence may support a moment, but it should not replace user agency.

### Presence before spectacle

A subtle head movement that acknowledges the user can be more powerful than a large explosion.

### Scale before detail

Scale is communicated through reference objects, camera position, sound delay, atmospheric depth, and partial framing. Polygon count alone does not create scale.

### Silence before impact

Loud events need quiet preparation. The product must be comfortable with stillness, low-frequency ambience, and incomplete information.

### Consequence before decoration

Every major input should alter at least one of these layers:

- world state
- light
- sound
- motion
- story
- available action

If nothing changes, the interaction is decorative rather than meaningful.

## 8. Product principles

The product must:

- Keep the user inside one coherent world.
- Treat UI as part of the station whenever possible.
- Reveal the entity gradually.
- Make the entity react even during idle moments.
- Adapt interaction patterns for desktop and mobile.
- Respect reduced-motion, keyboard, touch, and screen-reader needs.
- Degrade visual complexity without breaking the story.
- Make replay meaningful through memory, variation, or branching.

## 9. Non-goals

PROJECT TITAN will not become:

- a traditional marketing website
- a feature list with decorative 3D
- a generic neon cyberpunk interface
- a collection of disconnected scenes
- a combat-focused browser game
- a licensed-character tribute dependent on external IP
- a photorealism benchmark at the expense of interaction
- a desktop-only experience with a reduced mobile copy

The project may use cinematic robot imagery as inspiration, but its long-term identity must remain original.

## 10. Definition of “alive”

The entity is considered believable only when it demonstrates all of the following:

- **Attention**: it tracks or notices the user.
- **Continuity**: it does not reset emotionally between actions.
- **Intention**: its movements appear purposeful.
- **Response**: it reacts to user choices.
- **Idle life**: it breathes, scans, waits, or observes without looping mechanically.
- **Memory**: later visits or earlier choices can influence behavior.

A model with idle animation is not automatically alive.

## 11. Definition of “wow”

A moment qualifies as a true wow moment only when at least three conditions are met:

- It was not obvious in advance.
- It advances the story.
- It changes the user’s understanding of the world.
- It creates a strong visual or emotional composition.
- It is caused or unlocked by the user.
- It is memorable enough to share.

More bloom, particles, camera shake, or louder sound do not automatically improve the score.

## 12. Success metrics

### Experience metrics

- The first meaningful interaction is available within 10 seconds.
- The user understands how to begin without a tutorial modal.
- The first entity reveal occurs only after buildup.
- Every act contains one clear user objective.
- No required interaction feels like a standard form control without world context.
- A first playthrough provides at least one emotional payoff.
- A second playthrough can reveal a different response, branch, or remembered state.

### Technical metrics

- Desktop target: stable 60 FPS on a mainstream discrete GPU.
- Mobile target: stable 30–60 FPS depending on quality tier.
- Input latency should feel immediate for lever, tuner, radar, and hold interactions.
- Required gameplay must remain possible with keyboard and touch.
- Reduced-motion mode must preserve story comprehension.
- The experience must recover gracefully from lost pointer capture, tab suspension, resize, and orientation changes.

### Product metrics for public release

- Users complete the first-contact sequence without external explanation.
- Users can identify at least one memorable moment when asked.
- A meaningful percentage replay or share the experience.
- Performance failures do not block the core story.

## 13. Long-term direction

PROJECT TITAN should evolve into a reusable experience engine rather than remain a single hard-coded scene.

The engine should eventually support:

- authored acts and missions
- finite-state story flow
- camera rails
- adaptive quality
- physical interaction components
- layered audio cues
- environmental state changes
- branching outcomes
- persistent memory
- accessibility alternatives

The first-contact story is the first production built on the engine, not the engine’s only possible use.

## 14. Creative test

Before approving a feature, ask:

1. Does it make the entity feel more present?
2. Does it deepen the user’s role?
3. Does it improve the emotional sequence?
4. Does it create physical feedback or consequence?
5. Is it still understandable on mobile and with reduced motion?
6. Would the experience be weaker without it?

If most answers are no, the feature should not enter production.

## 15. Mission statement

> Create an unforgettable browser experience where technology disappears, emotion leads every interaction, and the user feels that something on the other side of the screen is truly alive.
