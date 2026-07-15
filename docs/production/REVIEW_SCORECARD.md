# Review Scorecard

## Purpose

This scorecard provides a repeatable way to review PROJECT TITAN changes across gameplay, narrative, interaction, visuals, motion, accessibility, performance, and engineering quality.

It is designed for pull requests, sprint reviews, milestone gates, and AI-agent self-review.

## Scoring Model

Each category is scored from 0 to 5.

- **5 — Excellent:** complete, intentional, polished, and aligned with project standards.
- **4 — Strong:** production-ready with only minor issues.
- **3 — Acceptable:** works, but contains visible compromises or incomplete polish.
- **2 — Weak:** partially functional or inconsistent; requires revision.
- **1 — Poor:** major problems, regressions, or unclear intent.
- **0 — Missing/Broken:** not implemented, unusable, or invalidates the experience.

A score of 3 is not a target. It is the minimum acceptable baseline for non-critical categories.

## Release Thresholds

### Merge-ready

A change may be considered merge-ready when:

- no critical category scores below 4;
- no category scores below 3;
- total weighted score is at least 80%;
- no blocking defect remains open;
- acceptance criteria have been demonstrated.

### Milestone-ready

A milestone may be considered complete when:

- all critical categories score at least 4;
- experience cohesion scores at least 4;
- accessibility and performance both score at least 4;
- no known issue blocks the full critical path;
- documentation matches actual behavior.

## Category Weights

| Category | Weight |
|---|---:|
| Experience cohesion | 15% |
| Gameplay and interaction | 15% |
| State and engineering reliability | 15% |
| Accessibility | 10% |
| Performance | 10% |
| Narrative and emotional delivery | 10% |
| Visual art direction | 10% |
| Camera and motion | 10% |
| Documentation and production readiness | 5% |

## 1. Experience Cohesion — 15%

Evaluate whether the change feels like part of PROJECT TITAN rather than an isolated feature.

### Questions

- Does it reinforce the operator fantasy?
- Does it support mystery, presence, tension, trust, or consequence?
- Does it respect the experience principles?
- Does it avoid generic sci-fi patterns?
- Does it integrate cleanly with preceding and following states?
- Is the user always able to understand what changed without excessive explanation?

### Score guidance

- **5:** The change feels inevitable and strengthens the whole experience.
- **4:** Strong fit with only minor tonal or pacing issues.
- **3:** Functional fit, but visibly separate or under-integrated.
- **2:** Competes with the existing experience or weakens immersion.
- **1:** Feels unrelated, confusing, or stylistically foreign.
- **0:** Breaks the core fantasy or critical path.

## 2. Gameplay and Interaction — 15%

Evaluate the quality of direct user action and feedback.

### Questions

- Is the objective discoverable through observation and feedback?
- Does the interaction feel physical, intentional, and responsive?
- Are thresholds, progress, and success states understandable?
- Are accidental activations prevented?
- Can the interaction recover from interruption or cancellation?
- Do pointer, touch, and keyboard inputs reach equivalent outcomes?
- Does the mechanic avoid punitive failure?

### Blocking defects

- interaction cannot be completed;
- pointer capture becomes stuck;
- keyboard path is missing for a required control;
- progress cannot reset safely;
- repeated input creates duplicated state transitions.

## 3. State and Engineering Reliability — 15%

Evaluate correctness, lifecycle safety, and maintainability.

### Questions

- Are state transitions explicit and valid?
- Can a transition execute more than once accidentally?
- Are invalid transitions rejected or safely ignored?
- Are listeners, timers, animation frames, and audio nodes cleaned up?
- Is behavior deterministic enough to reproduce and test?
- Is frame-rate-dependent logic avoided?
- Are responsibilities separated clearly?
- Does the implementation avoid hidden state in DOM classes or animation callbacks?

### Blocking defects

- unreachable or dead-end state;
- race condition in the critical path;
- leaked intervals or event listeners;
- uncaught runtime error;
- state depends on timing that varies materially by frame rate.

## 4. Accessibility — 10%

Evaluate whether the experience remains operable and understandable across access needs.

### Questions

- Are interactive elements keyboard accessible?
- Are focus states visible and ordered logically?
- Do controls have semantic names and roles?
- Are important state changes announced appropriately?
- Is color supplemented by motion, shape, sound, or text?
- Does reduced motion preserve meaning and completion?
- Are timing requirements forgiving?
- Is the experience usable when audio is muted?
- Does the accessibility tree remain valid after entering the experience?

### Blocking defects

- critical interaction has no keyboard path;
- focus becomes trapped or lost;
- required information is color-only;
- reduced-motion mode prevents completion;
- essential interface is hidden from assistive technology.

## 5. Performance — 10%

Evaluate smoothness, responsiveness, resource usage, and degradation behavior.

### Questions

- Does the change remain responsive on realistic devices?
- Are continuous animations delta-time based?
- Are high-frequency DOM reads and writes minimized?
- Is unnecessary work paused when the document is hidden?
- Are effects scalable or degradable?
- Does the change avoid excessive memory allocation in render loops?
- Does startup remain acceptable?
- Does the browser console remain free of performance warnings caused by the patch?

### Blocking defects

- severe frame drops during a required interaction;
- runaway memory usage;
- background tab continues expensive rendering or audio work;
- input latency makes the mechanic unreliable;
- feature fails completely on the defined baseline device.

## 6. Narrative and Emotional Delivery — 10%

Evaluate whether story information and emotional pacing are delivered intentionally.

### Questions

- Does the change reveal only what the current act should reveal?
- Is information conveyed through environment and interaction before exposition?
- Does silence have room to work?
- Does the entity remain unknown but emotionally legible?
- Does the pacing follow the emotion curve?
- Are trust and consequence earned through action?
- Does copy remain restrained and diegetic?

### Red flags

- explanatory paragraphs during tension peaks;
- premature identity reveal;
- constant dialogue or alerts;
- jokes that weaken the tone;
- emotional beats triggered without player participation.

## 7. Visual Art Direction — 10%

Evaluate consistency with the Art Bible.

### Questions

- Does the station feel industrial, tactile, and used?
- Is the hierarchy readable without looking like a generic dashboard?
- Are materials, lighting, typography, and color purposeful?
- Are accent colors reserved for meaningful states?
- Does visual density support focus?
- Are particles, glow, and distortion used sparingly?
- Does the composition create scale and depth?

### Red flags

- excessive neon;
- unreadable bloom;
- decorative noise;
- inconsistent material language;
- modern app-card styling inside the diegetic station;
- visual effects that obscure controls.

## 8. Camera and Motion — 10%

Evaluate framing, animation, spatial continuity, and motion meaning.

### Questions

- Does camera movement preserve user orientation?
- Is motion motivated by input, system response, or narrative consequence?
- Do objects communicate weight and resistance?
- Are transitions paced according to emotional intent?
- Are multiple animations coordinated rather than competing?
- Are important actions given visual priority?
- Does reduced-motion mode provide an equivalent experience?

### Blocking defects

- camera movement causes loss of control or disorientation;
- animation prevents interaction;
- overlapping timelines leave elements in invalid states;
- motion is required to understand feedback but disappears without replacement in reduced-motion mode.

## 9. Documentation and Production Readiness — 5%

Evaluate whether the change can be understood, maintained, reviewed, and released.

### Questions

- Does the pull request explain the problem and outcome?
- Are acceptance criteria listed?
- Are affected states and systems identified?
- Are visible changes demonstrated with screenshots or recordings?
- Are test and validation steps documented?
- Are relevant design or technical documents updated?
- Are limitations and follow-up work explicit?
- Does the commit history remain focused and understandable?

## Weighted Score Calculation

For each category:

1. divide the category score by 5;
2. multiply by the category weight;
3. add all weighted values;
4. multiply by 100.

Example:

- Experience cohesion: 4/5 × 15 = 12
- Gameplay: 5/5 × 15 = 15
- Continue for all categories
- Total = final percentage

## Blocking Review Labels

Use these labels during review:

- **BLOCKER:** cannot merge; critical path, accessibility, data, or severe stability issue.
- **MAJOR:** must be fixed before milestone completion; may merge only with explicit rationale.
- **MINOR:** polish or maintainability issue that should be addressed soon.
- **NIT:** non-blocking preference or small consistency issue.
- **QUESTION:** requires clarification; not automatically a defect.
- **PRAISE:** notably strong implementation worth preserving as a pattern.

## Reviewer Summary Template

```md
## Review Summary

**Weighted score:** XX%
**Recommendation:** Approve / Approve with follow-up / Request changes

### Category scores

- Experience cohesion: X/5
- Gameplay and interaction: X/5
- State and engineering reliability: X/5
- Accessibility: X/5
- Performance: X/5
- Narrative and emotional delivery: X/5
- Visual art direction: X/5
- Camera and motion: X/5
- Documentation and production readiness: X/5

### Blocking findings

- None / list findings

### Strongest aspect

Describe what should be preserved.

### Highest-priority improvement

Describe the most important next action.

### Validation reviewed

List test evidence, screenshots, recordings, and manual checks.
```

## Self-Review Requirement

Before requesting human review, the author or AI agent should complete this scorecard honestly.

Self-review is not a substitute for independent review. Its purpose is to expose weak areas before review time is spent on them.

## Final Principle

The scorecard exists to protect the quality of the complete experience. A high technical score cannot compensate for broken interaction, inaccessible controls, or emotional incoherence. Likewise, strong visuals cannot compensate for unreliable state management.

PROJECT TITAN is ready only when its design, engineering, and emotional delivery support one another.
