# PROJECT TITAN — Performance Engineering Guide

## 1. Purpose

This document defines the performance standards, budgets, profiling workflow, degradation strategy, and release gates for PROJECT TITAN.

The project must feel cinematic without becoming fragile. Performance is treated as part of interaction design: input latency, motion continuity, audio timing, and transition pacing all affect trust and immersion.

## 2. Performance Principles

1. Protect interaction responsiveness before visual density.
2. Prefer stable frame pacing over occasional visual peaks.
3. Degrade effects gracefully instead of disabling the experience.
4. Measure on representative hardware, not only development machines.
5. Keep expensive work outside the critical interaction path.
6. Pause or reduce work when the page is hidden or inactive.
7. Avoid invisible complexity: every recurring render cost must justify itself.

## 3. Supported Performance Tiers

### Tier A — High

Target devices:

- Modern desktop with discrete GPU
- Recent Apple silicon devices
- High-end mobile devices where WebGL quality is stable

Expected behavior:

- Full particle density
- High-resolution post-processing
- Dynamic shadows where visually meaningful
- Rich atmospheric layers
- Full animation fidelity

### Tier B — Standard

Target devices:

- Integrated desktop GPUs
- Typical laptops
- Mid-range modern mobile devices

Expected behavior:

- Reduced particles
- Lower render scale
- Simplified shadows
- Reduced blur and glow passes
- Full gameplay and narrative parity

### Tier C — Safe Mode

Target devices:

- Older integrated GPUs
- Thermally constrained mobile devices
- Browsers reporting unstable frame times

Expected behavior:

- Minimal particles
- No expensive post-processing
- Baked or static lighting
- Reduced environmental motion
- Full interaction, story, audio cues, and accessibility support preserved

## 4. Frame-Time Targets

### Desktop

- Preferred: 60 FPS
- Frame budget: 16.67 ms
- Acceptable cinematic transition floor: 45 FPS when input is temporarily locked
- Interactive sequences must avoid sustained drops below 50 FPS

### Mobile

- Preferred: 60 FPS on capable hardware
- Accepted standard: stable 30 FPS on supported lower tiers
- Frame budget at 30 FPS: 33.33 ms

### Stability Rule

A stable 30 FPS experience is preferable to repeated oscillation between 60 and 25 FPS.

Quality tier changes should use hysteresis and must not toggle repeatedly during one scene.

## 5. Input Latency Targets

For drag, rotate, tracking, and hold mechanics:

- Visual acknowledgement should begin within one rendered frame.
- Input processing must not wait for network activity.
- Pointer movement handlers must avoid layout reads and synchronous heavy work.
- Audio feedback should begin within 100 ms when browser policy allows it.

The power lever, tuner, radar target, and contact pad are latency-critical systems.

## 6. Loading Budgets

### Initial Experience

The calibration scene must become usable before nonessential assets complete loading.

Recommended priorities:

1. Critical HTML and CSS
2. Core interaction JavaScript
3. Calibration visual layer
4. Primary station geometry and textures
5. Essential audio cues
6. Secondary atmosphere
7. Optional high-quality enhancements

### Asset Budgets

Budgets are goals rather than permanent exceptions:

- Initial compressed JavaScript: target under 300 KB
- Initial critical textures: target under 3 MB
- First playable transfer: target under 5 MB on standard tier
- Deferred environment assets: loaded only before their first required scene
- Individual texture dimensions: no larger than the visible use case requires

Any budget increase must be documented with user-visible value and measured impact.

## 7. Rendering Architecture

### Single Authoritative Render Loop

The application should use one primary render loop.

Responsibilities:

- Calculate delta time
- Advance simulation state
- Update interaction visuals
- Update scene animation
- Render the active scene
- Record performance samples

Do not create independent recurring `requestAnimationFrame` loops for individual components.

### Delta-Time Safety

All time-based motion must use bounded delta time.

Recommended behavior:

- Clamp abnormally large deltas after tab suspension.
- Reset temporal accumulators after visibility restoration.
- Keep gameplay progression deterministic where possible.

### Hidden-Page Behavior

When `document.hidden` is true:

- Pause nonessential animation updates.
- Stop expensive scene simulation.
- Suspend reactive audio analysis.
- Preserve state without progressing timed gameplay events.
- Resume with temporal values reset to avoid jumps.

## 8. Scene Complexity Budgets

### Geometry

- Prefer instancing for repeated structures.
- Merge static geometry where it does not harm culling.
- Avoid highly subdivided models for distant or dark silhouettes.
- Use simplified collision and interaction volumes.

### Materials

- Reuse materials whenever practical.
- Avoid unnecessary transparent layers.
- Limit unique shader variants.
- Prefer texture atlases for tightly related interface surfaces.

### Lighting

- Use dynamic lights only where they communicate gameplay or story.
- Prefer baked lighting, emissive materials, and controlled fake reflections.
- Shadow-casting lights must be explicitly justified.
- Reduce shadow map resolution by quality tier.

### Particles

- Pool particle objects.
- Set hard maximum counts per quality tier.
- Avoid per-particle DOM nodes.
- Disable particles outside the active visual region.

## 9. Post-Processing

Post-processing must enhance hierarchy, not hide weak composition.

Allowed effects may include:

- Bloom
- Vignette
- Chromatic disturbance during signal instability
- Film grain
- Limited depth or atmospheric blur

Rules:

- Every effect must support quality scaling.
- Effects must not obscure control labels or focus indicators.
- Full-screen multipass effects must be profiled independently.
- Reduced-motion mode must avoid aggressive temporal distortion.

## 10. DOM and CSS Performance

- Animate transforms and opacity where possible.
- Avoid animating layout-heavy properties during interaction.
- Batch DOM reads before writes.
- Avoid repeated measurements inside pointer handlers.
- Keep the accessibility tree stable when changing visual layers.
- Remove inactive event listeners and observers.
- Use `content-visibility` or containment only after accessibility testing.

## 11. Audio Performance

- Reuse decoded buffers.
- Avoid creating new audio graph nodes every frame.
- Keep analyser FFT sizes proportional to visual need.
- Pause analysis when visualizers are not visible.
- Load optional ambience after first interaction when appropriate.
- Prevent duplicate interval or timer creation during repeated state entry.

Audio glitches are considered performance regressions because they damage narrative timing.

## 12. Memory Management

### Required Cleanup

When scenes or systems are destroyed:

- Remove event listeners.
- Cancel timers and intervals.
- Dispose GPU geometry, materials, textures, and render targets.
- Disconnect audio nodes.
- Release large references held by closures.
- Clear observers.

### Memory Regression Signals

Investigate when:

- Replaying a chapter increases memory each time.
- GPU memory does not recover after scene replacement.
- Detached DOM nodes accumulate.
- Audio nodes or WebGL resources grow continuously.

## 13. Adaptive Quality System

The runtime may choose a quality tier using:

- Device pixel ratio
- Viewport size
- Hardware concurrency
- Mobile and thermal hints
- Initial benchmark samples
- Sustained frame-time measurements

### Downgrade Trigger

A downgrade may occur when the moving average exceeds the active frame budget for a sustained period.

### Upgrade Trigger

Upgrades must be conservative and should only occur during safe narrative boundaries.

Never change render quality during a precision interaction unless required to prevent failure.

### Quality Controls

Adjust in this order:

1. Particle count
2. Render scale
3. Shadow resolution or shadow enablement
4. Post-processing passes
5. Atmospheric simulation frequency
6. Secondary environmental animation

Do not reduce input sampling, state-machine integrity, control hit areas, or accessibility feedback.

## 14. Profiling Workflow

### Before Optimization

1. Reproduce the issue on a target device.
2. Capture a trace.
3. Identify whether the bottleneck is CPU, GPU, memory, loading, or network.
4. Record a baseline metric.
5. Change one meaningful variable.
6. Capture the same scenario again.

### Required Scenarios

Profile at minimum:

- Initial calibration load
- Power lever interaction
- Signal tuning with active visual feedback
- Radar tracking sequence
- Entity approach transition
- Hand-sync hold interaction
- Visibility hide and resume
- Full replay without page refresh

### Recommended Tools

- Browser Performance panel
- Browser Memory tools
- WebGL renderer statistics
- Network throttling
- Lighthouse for loading diagnostics
- Real-device remote debugging

Synthetic scores do not replace direct interaction testing.

## 15. Performance Instrumentation

Development builds should expose lightweight metrics:

- Current FPS
- Average frame time
- 95th percentile frame time
- Draw calls
- Triangle count
- Active texture memory estimate
- Current quality tier
- Long-task count
- Scene load duration

Instrumentation must be removable or disabled in production without changing gameplay behavior.

## 16. Performance Release Gates

A release is blocked when any of the following occurs:

- Main interaction becomes unreliable due to frame drops.
- Input feedback is delayed by recurring main-thread work.
- Memory grows materially across repeated chapter runs.
- Hidden tabs continue full rendering or audio analysis.
- Standard-tier hardware cannot complete the experience.
- A visual effect causes accessibility feedback to disappear.
- Loading failure leaves the user on an unexplained blank screen.

## 17. Failure and Recovery

If a critical asset fails:

- Continue with a simplified representation when possible.
- Display an in-world but understandable recovery message.
- Offer retry without forcing a full refresh.
- Preserve completed interaction state.

If WebGL initialization fails:

- Present a reduced 2D experience or clear compatibility message.
- Do not leave controls interactive but invisible.

## 18. Pull Request Checklist

Every performance-sensitive PR should state:

- Which scene or system changed
- Expected user-visible benefit
- New assets and compressed sizes
- Before and after frame-time observations
- Tested quality tiers
- Memory cleanup behavior
- Reduced-motion behavior
- Mobile impact

## 19. Definition of Done

A performance task is complete when:

- The measured bottleneck is documented.
- The change improves the target metric or removes the regression.
- Gameplay behavior remains correct.
- Visual quality remains consistent with the art direction.
- Accessibility remains intact.
- Cleanup paths are tested.
- The result is verified on at least one representative lower-tier device.

## 20. Final Standard

PROJECT TITAN should never ask the player to trade responsiveness for spectacle.

The correct result is not the highest possible visual complexity. It is the most convincing experience that remains stable, readable, and immediate on the hardware it claims to support.
