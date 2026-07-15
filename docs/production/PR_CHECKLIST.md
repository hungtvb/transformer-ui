# Pull Request Checklist

This checklist is the minimum bar for every change to PROJECT TITAN. A pull request is not considered ready for review until each applicable item is complete.

## 1. Scope and intent

- [ ] The pull request has one clear purpose.
- [ ] The title describes the user-visible or technical outcome.
- [ ] The description explains why the change is needed.
- [ ] The change is linked to the relevant roadmap item, issue, or design document.
- [ ] Unrelated refactors are excluded or clearly justified.

## 2. Design alignment

- [ ] The implementation follows `docs/vision/00_VISION.md`.
- [ ] The experience respects `docs/vision/01_EXPERIENCE_PRINCIPLES.md`.
- [ ] Camera behavior follows `docs/design/CAMERA_BIBLE.md`.
- [ ] Motion behavior follows `docs/design/MOTION_BIBLE.md`.
- [ ] Visual decisions follow `docs/design/ART_BIBLE.md`.
- [ ] Narrative pacing follows `docs/design/EMOTION_CURVE.md`.
- [ ] Gameplay changes remain consistent with `docs/design/GAMEPLAY.md`.

## 3. User experience

- [ ] The primary interaction is understandable without explanatory paragraphs.
- [ ] The user receives immediate feedback for input.
- [ ] Success, progress, locked, and failure states are visually distinct.
- [ ] The interaction has a keyboard equivalent where applicable.
- [ ] Focus order is logical.
- [ ] Touch targets are large enough for mobile use.
- [ ] Reduced-motion behavior is supported where animation is non-essential.
- [ ] No critical information depends only on color, sound, or hover.

## 4. State and gameplay safety

- [ ] State transitions match `docs/technical/STATE_MACHINE.md`.
- [ ] Invalid transitions are rejected or safely ignored.
- [ ] Repeated input cannot trigger duplicate transitions.
- [ ] Timers and animation callbacks are cleaned up.
- [ ] Pointer capture is released on cancel and interruption.
- [ ] The experience remains recoverable after tab switching or focus loss.
- [ ] Reloading does not corrupt persisted progress.
- [ ] First-visit and returning-user behavior are both tested.

## 5. Code quality

- [ ] Names describe intent rather than implementation accidents.
- [ ] New logic is placed in the correct module.
- [ ] No dead code, commented-out experiments, or temporary logs remain.
- [ ] Constants replace unexplained magic values.
- [ ] Public functions and complex systems have concise documentation.
- [ ] Error paths are handled explicitly.
- [ ] Existing APIs are not changed without updating all callers.
- [ ] New dependencies are necessary, lightweight, and documented.

## 6. Performance

- [ ] The change follows `docs/technical/PERFORMANCE.md`.
- [ ] The render loop performs no avoidable allocation.
- [ ] Animation work pauses when the page is hidden.
- [ ] Event listeners, observers, and intervals are cleaned up.
- [ ] Assets are compressed and appropriately sized.
- [ ] Expensive effects have a low-power or reduced-quality fallback.
- [ ] The experience remains responsive on a mid-range mobile device.
- [ ] No obvious layout thrashing or forced synchronous reflow is introduced.

## 7. Accessibility

- [ ] The change follows `docs/technical/ACCESSIBILITY.md`.
- [ ] Interactive elements use semantic HTML or equivalent ARIA patterns.
- [ ] Every control has an accessible name.
- [ ] Keyboard users can complete the full interaction.
- [ ] Focus is visible and never trapped accidentally.
- [ ] Status changes are announced when needed.
- [ ] Decorative visuals are hidden from assistive technology.
- [ ] Screen-reader output was checked for new critical flows.

## 8. Testing

- [ ] The happy path was tested from a clean session.
- [ ] The returning-user path was tested.
- [ ] Rapid repeated input was tested.
- [ ] Pointer cancel, lost focus, and tab visibility changes were tested.
- [ ] Keyboard-only completion was tested.
- [ ] Touch input was tested when relevant.
- [ ] Narrow mobile and wide desktop layouts were tested.
- [ ] Existing automated checks pass.
- [ ] New behavior has automated coverage where practical.

## 9. Visual review

- [ ] Before-and-after screenshots or a short recording are included for visual changes.
- [ ] Text remains readable over all backgrounds.
- [ ] Lighting, contrast, scale, and depth remain consistent with the art direction.
- [ ] Motion supports meaning and does not feel ornamental.
- [ ] No unintended clipping, overlap, overflow, or z-index regression exists.
- [ ] The scene remains coherent at supported aspect ratios.

## 10. Documentation and release notes

- [ ] Relevant design or technical documents are updated.
- [ ] New configuration values are documented.
- [ ] Breaking changes are called out clearly.
- [ ] User-visible changes are summarized in the pull request.
- [ ] Follow-up work is captured as issues or backlog entries, not hidden in comments.

## 11. Review readiness

- [ ] The branch is up to date with the target branch.
- [ ] Merge conflicts are resolved.
- [ ] CI is passing.
- [ ] The author completed a self-review of the final diff.
- [ ] Reviewers are given focused instructions for risky areas.
- [ ] The pull request is small enough to review confidently.

## Merge gate

A pull request may merge only when:

1. All required checks pass.
2. No unresolved blocking review comments remain.
3. The experience satisfies the Definition of Done.
4. The final diff matches the stated scope.
5. The repository remains deployable from the target branch.
