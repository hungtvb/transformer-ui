# PROJECT TITAN — Accessibility Standards

## 1. Purpose

This document defines the accessibility requirements for PROJECT TITAN across keyboard, pointer, touch, screen reader, motion, vision, hearing, cognition, and failure recovery.

Accessibility is not a fallback layer added after the cinematic experience. It is part of the interaction architecture. Every required action must remain understandable, operable, and recoverable without depending on one sense, one device, or one precise motor gesture.

## 2. Core Principles

1. Preserve narrative atmosphere without hiding essential information.
2. Every required interaction must have an equivalent accessible path.
3. Feedback must be multimodal: visual, textual, and when useful, auditory or haptic.
4. Users must never be trapped in an interaction state.
5. Reduced-motion mode must retain meaning, pacing, and causality.
6. Accessibility labels must describe purpose, state, and expected action.
7. Failures must explain recovery instead of silently resetting progress.
8. Accessibility behavior must be tested continuously, not only at release.

## 3. Conformance Target

The project should target WCAG 2.2 AA for applicable web content and controls.

Where the immersive 3D scene cannot map directly to a standard criterion, the implementation must still provide an equivalent semantic control and understandable status output.

The accessibility target applies to:

- Calibration and entry flow
- Station controls
- Gameplay interactions
- Status messages
- Menus and settings
- Error and recovery states
- End states and replay controls
- Loading and compatibility messages

## 4. Semantic Structure

### Document Landmarks

Use meaningful regions such as:

- Header for experience identity and global controls
- Main for the active station or interaction
- Navigation for chapter or settings navigation
- Aside for optional telemetry or contextual information
- Footer only when persistent legal or project links exist

### Heading Rules

- Use one meaningful page-level heading.
- Keep heading levels sequential.
- Do not use headings only for visual styling.
- Update chapter headings when the narrative state changes.

### Scene Semantics

The WebGL canvas is not the complete interface.

Each active scene must expose a semantic companion containing:

- Current location or chapter
- Current objective
- Available controls
- Relevant system state
- Progress feedback
- Completion or error feedback

The semantic companion may be visually integrated or screen-reader-only, but it must stay synchronized with the rendered experience.

## 5. Keyboard Interaction

### Global Requirements

- Every required control must be reachable using the keyboard.
- Focus order must follow visual and narrative order.
- Focus must never move into hidden or inactive scenes.
- Focus indicators must be clearly visible against dark and illuminated surfaces.
- Escape must cancel or exit temporary modes when safe.
- Enter and Space should activate button-like controls.
- Arrow keys should operate sliders, dials, and directional tracking controls.

### Interaction Mapping

#### Calibration

- Tab selects calibration controls.
- Enter or Space confirms.
- No timed precision input is required.

#### Power Lever

- Arrow Up or Right increases power.
- Arrow Down or Left decreases power.
- Home moves to minimum.
- End moves to maximum.
- Current value is announced.

#### Signal Tuner

- Arrow keys adjust frequency by a standard increment.
- Shift plus Arrow uses a larger increment where appropriate.
- Home and End move to defined bounds.
- Signal quality and lock state are announced without excessive repetition.

#### Radar Tracking

Provide at least one keyboard-accessible approach:

- Arrow keys move the tracker, or
- A sequence of discrete target zones replaces continuous pointer tracking.

The target must not require sub-pixel precision.

#### Hand Sync

- Enter or Space begins the hold.
- Releasing the key ends the hold when release behavior matters.
- Progress is exposed through a native or ARIA progress indicator.
- An optional toggle alternative must be available for users unable to sustain a hold.

#### Acknowledge

- Implement as a standard button.
- Prevent repeated activation while processing.
- Announce accepted, pending, and failed states.

## 6. Focus Management

### State Transitions

When the state machine advances:

- Move focus only when it prevents confusion or enables the next action.
- Prefer focusing the new primary control or new chapter heading.
- Do not reset focus to the document body without reason.
- Preserve focus when only visual decoration changes.

### Modals and Overlays

- Trap focus inside true modal dialogs.
- Restore focus to the invoking control on close.
- Provide an explicit close action.
- Escape closes noncritical overlays.
- Background content must be inert while a modal is active.

### Entry Transition

After calibration transitions into the station, the station semantic region must become available to assistive technology and focus must land on either:

1. The station chapter heading, or
2. The first required control.

The canvas alone must never receive unexplained focus.

## 7. Screen Reader Output

### Labels

Control names should communicate purpose rather than visual shape.

Preferred:

- “Main power level”
- “Signal frequency”
- “Radar tracking position”
- “Maintain contact”
- “Acknowledge transmission”

Avoid:

- “Blue handle”
- “Circle”
- “Click here”
- “Mystery control”

Atmospheric naming may supplement, but not replace, functional meaning.

### State and Value

Expose:

- Minimum, maximum, and current values
- Disabled or busy state
- Completion state
- Signal stability
- Tracking progress
- Hold progress
- Connection status

Use native HTML semantics before ARIA.

### Live Regions

Use live regions sparingly for important changes:

- Objective updated
- Signal locked
- Target acquired
- Contact established
- Transmission received
- Recoverable error

Rules:

- Do not announce continuous pointer coordinates.
- Throttle changing signal and radar values.
- Prefer polite announcements unless immediate action is required.
- Do not duplicate visible text in multiple live regions.

## 8. Visual Accessibility

### Contrast

- Essential text and controls must meet WCAG AA contrast requirements.
- Decorative glow must not be counted as the only contrast source.
- Text must remain readable when bloom and atmospheric overlays are active.
- Disabled controls must remain distinguishable without appearing interactive.

### Color Independence

Never communicate required state using color alone.

Examples:

- Signal quality uses color plus label, shape, or meter value.
- Radar lock uses color plus target marker and text.
- Error state uses color plus icon and explanatory message.
- Contact progress uses fill plus percentage or descriptive status.

### Text Scaling

- Interface text must support browser zoom to at least 200 percent.
- Essential content must not clip or overlap at increased text size.
- Controls must retain meaningful hit areas.
- Full-screen overlays must scroll when content no longer fits.

### Typography

- Avoid very thin weights for operational text.
- Keep line lengths readable.
- Do not use long all-uppercase paragraphs.
- Letter spacing must not be the only method of creating hierarchy.

## 9. Pointer and Touch Accessibility

- Interactive targets should be at least 44 by 44 CSS pixels where practical.
- Drag handles must have larger invisible hit areas than their visual geometry.
- Do not require hover for essential information.
- Support pointer cancellation and lost pointer capture.
- Avoid gestures requiring multiple fingers.
- Avoid path-dependent gestures when a direct alternative is possible.
- Prevent accidental activation immediately after a drag.

All drag-based controls need a non-drag alternative such as buttons, arrow keys, or a standard range input.

## 10. Motor Accessibility

### Precision

- Do not require exact positioning against moving targets without tolerance.
- Use magnetism, snapping, or forgiving success zones.
- Increase tolerance after repeated unsuccessful attempts.
- Avoid harsh failure for leaving the target briefly.

### Timing

- Required interactions must not depend on very short reaction windows.
- Time limits must be adjustable, extendable, or removed.
- Narrative pauses should wait for explicit user action when needed.

### Sustained Actions

Any hold interaction must offer at least one alternative:

- Toggle to start and stop
- Adjustable hold duration
- Automatic completion after confirmation

## 11. Reduced Motion

Respect `prefers-reduced-motion` and provide an in-experience motion setting.

### Reduce or Remove

- Large camera pushes and swings
- Repeated parallax
- Screen shake
- Rapid flicker
- Strong chromatic displacement
- Fast zooms
- Continuous floating motion
- Motion blur that reduces readability

### Preserve

- State causality
- Progress indication
- Interaction feedback
- Narrative sequence
- Spatial orientation

### Replacement Strategies

Replace motion with:

- Crossfades
- Short opacity changes
- Static composition changes
- Textual state announcements
- Controlled light changes
- Discrete before-and-after positioning

Reduced motion must not shorten the story into an incomprehensible series of jumps.

## 12. Flashing and Photosensitivity

- Avoid flashes exceeding safe frequency thresholds.
- Do not use rapid full-screen luminance changes.
- Lightning, signal instability, and emergency lighting must be restrained.
- Provide a setting to disable flicker and strobe-like effects.
- Review particle and noise effects for accidental high-frequency patterns.

No narrative beat is important enough to require unsafe flashing.

## 13. Audio Accessibility

### Captions and Text Equivalents

All meaningful audio needs a textual equivalent, including:

- Spoken transmission fragments
- Alarm meaning
- Signal lock confirmation
- Entity response
- Environmental audio that communicates danger or direction

Decorative ambience does not require verbatim captioning, but meaningful changes should be represented.

### Volume Controls

Provide separate or understandable controls for:

- Master volume
- Dialogue or transmission
- Effects
- Ambience

A mute state must never remove essential information without a visual replacement.

### Spatial Audio

Directional audio may enrich tracking but cannot be required to find or follow the target.

## 14. Cognitive Accessibility

- Present one primary objective at a time.
- Keep operational instructions concise.
- Use consistent verbs across scenes.
- Allow instructions to be reopened.
- Avoid unexplained control remapping.
- Confirm irreversible choices.
- Provide progress context without exposing unnecessary implementation detail.

### Instruction Pattern

Preferred instruction structure:

1. Action: what to do
2. Object: which control or target
3. Goal: what success looks like

Example:

“Adjust the frequency until signal stability reaches lock.”

### Error Messages

Errors should state:

- What happened
- Whether progress is safe
- What action resolves it

Avoid fictional language that obscures recovery.

## 15. Difficulty and Assistance

Provide an assistance setting that may include:

- Larger tracking tolerance
- Slower target movement
- Longer interruption grace period
- Automatic snapping
- Reduced hold duration
- Persistent instructions
- Stronger visual guidance
- Optional automatic completion after repeated failure

Assistance must not shame the user or label the experience as lesser.

## 16. Save, Resume, and Replay

- Preserve completed chapter state when possible.
- Do not require replaying inaccessible precision sequences after a recoverable failure.
- Allow users to restart the current interaction.
- Allow users to reset all experience memory deliberately.
- Explain what reset removes.

If local storage is unavailable, the experience must still function during the current session.

## 17. Loading and Error States

### Loading

Expose:

- That loading is occurring
- Meaningful progress where available
- Whether interaction is temporarily unavailable
- A recovery option if loading stalls

Do not rely only on a visual spinner inside the canvas.

### Compatibility Failure

When WebGL, audio, or another capability fails:

- Explain the unavailable capability.
- Provide a reduced experience when possible.
- Preserve access to narrative text and controls.
- Avoid technical error codes without explanation.

## 18. Responsive Accessibility

- Do not hide required controls based solely on viewport size.
- On narrow screens, stack controls in narrative order.
- Keep touch controls clear of browser and device safe areas.
- Support portrait where practical or clearly explain orientation requirements.
- Do not rotate instructional text independently from device orientation.

## 19. Testing Matrix

### Automated Checks

Run automated accessibility checks for:

- Semantic roles
- Accessible names
- Contrast
- Focusable hidden content
- Form labels
- Duplicate IDs
- Invalid ARIA

Automated checks are necessary but insufficient.

### Manual Keyboard Test

Verify the full experience using only:

- Tab
- Shift plus Tab
- Enter
- Space
- Arrow keys
- Escape
- Home and End where applicable

### Screen Reader Test

Test at minimum with representative combinations such as:

- VoiceOver with Safari
- NVDA with Firefox or Chrome

Verify:

- Entry sequence
- Objective changes
- Control values
- Progress announcements
- Errors
- Final outcome

### Motion Test

Test with:

- Operating-system reduced motion enabled
- In-experience reduced motion enabled
- Flicker reduction enabled

### Zoom and Reflow Test

Test:

- 200 percent browser zoom
- Narrow mobile viewport
- Enlarged system text where supported

## 20. State-by-State Acceptance Criteria

### Calibration

- Fully keyboard operable
- Instruction and status announced
- No precision timing required

### Power Restoration

- Lever has a semantic value and keyboard equivalent
- Completion is announced once
- Focus advances predictably

### Signal Tuning

- Frequency and quality are exposed
- Updates are throttled
- Lock is not communicated by color or sound alone

### Radar Tracking

- Keyboard or discrete alternative exists
- Target tolerance is forgiving
- Progress and completion are available nonvisually

### Visual Contact

- Entity appearance is described without excessive interruption
- Camera movement respects reduced motion
- No essential action is hidden during the reveal

### Hand Sync

- Hold has an alternative
- Progress is announced at useful intervals
- Pointer cancellation does not trap the state

### Acknowledgement

- Standard button semantics
- Busy state prevents duplicate activation
- Outcome is announced and visible

## 21. Pull Request Checklist

Every UI or gameplay PR should answer:

- Can the new behavior be completed by keyboard?
- Does it expose a meaningful accessible name and state?
- Is required feedback independent of color and audio?
- Does it work with reduced motion?
- Are focus transitions intentional?
- Are touch targets large enough?
- Is there an alternative to drag, precision, timing, or sustained hold?
- Are loading and error paths understandable?
- Was the semantic companion updated with the visual scene?

## 22. Accessibility Release Gates

A release is blocked when:

- A required interaction cannot be completed without a pointer.
- Focus becomes trapped or lost.
- Essential state exists only inside the canvas.
- Reduced-motion mode removes necessary context.
- Meaning depends solely on color or sound.
- Screen reader output becomes excessively repetitive.
- Text becomes unreadable under supported zoom.
- A user can enter a state with no available recovery action.

## 23. Definition of Done

An accessibility task is complete when:

- Semantics match the visual and gameplay state.
- Keyboard and touch paths are verified.
- Screen reader announcements are useful and restrained.
- Reduced-motion behavior preserves narrative meaning.
- Error recovery is understandable.
- Automated and manual checks pass.
- No inaccessible fallback is presented as optional when it is required for completion.

## 24. Final Standard

PROJECT TITAN succeeds only when the unknown feels mysterious—not the interface.

The player may be uncertain about the entity, the station, and the consequences of contact. They must not be uncertain about what control is active, what action is possible, what progress has been made, or how to recover.
