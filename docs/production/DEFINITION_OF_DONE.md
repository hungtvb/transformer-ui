# Definition of Done

A feature, story, fix, or production task in PROJECT TITAN is done only when it is complete as a user experience, technically safe, reviewable, documented, and releasable.

Passing compilation alone does not mean done.

## 1. Product outcome

A change is done when:

- The intended user outcome is implemented.
- The behavior matches the approved story, gameplay, or technical requirement.
- The experience has a clear beginning, feedback loop, and completion state.
- No placeholder interaction, copy, animation, or visual remains in the delivered path.
- The feature adds value without weakening the core fantasy of operating a first-contact relay.

## 2. Scope completion

- All acceptance criteria are satisfied.
- Out-of-scope work is explicitly recorded in the backlog.
- Temporary workarounds are removed or documented with an owner and follow-up issue.
- The implementation does not rely on hidden manual setup.
- Configuration and asset requirements are committed to the repository.

## 3. Experience quality

- The interaction is understandable through environmental and interface feedback.
- Input produces immediate visual, sonic, or haptic-equivalent feedback where appropriate.
- The experience remains coherent across desktop, tablet, and supported mobile widths.
- Empty, loading, unavailable, interrupted, and completed states are intentionally designed.
- Narrative information is revealed at the correct emotional moment.
- Camera, motion, visual language, and pacing follow the project design bibles.
- The feature does not introduce generic dashboard patterns that undermine immersion.

## 4. Gameplay integrity

- State transitions are deterministic.
- Invalid or repeated input cannot skip required beats.
- The user cannot become permanently stuck.
- Interrupted interactions can recover safely.
- Progress persistence is intentional and version-safe.
- Replay behavior is defined.
- Failure never erases meaningful progress unless the design explicitly requires it.
- New mechanics use the established interaction grammar: observe, manipulate, receive feedback, confirm, and experience consequence.

## 5. Engineering quality

- Code is readable and organized by responsibility.
- Public behavior is covered by stable interfaces.
- Complex logic has concise rationale comments.
- No unused code, debug output, experimental flags, or accidental global state remains.
- Errors are handled without breaking the full experience.
- Event listeners, timers, observers, animation handles, and resources are cleaned up.
- Dependency additions are reviewed for necessity, bundle impact, security, and maintenance risk.
- The target branch remains buildable and deployable.

## 6. Performance quality

- The experience meets the budgets defined in `docs/technical/PERFORMANCE.md`.
- No avoidable allocation occurs in continuous render or tracking loops.
- Hidden-tab and inactive-state work is paused.
- Large assets are compressed and loaded intentionally.
- Expensive visual effects degrade gracefully.
- Interaction latency remains responsive.
- No severe frame-time spikes appear during critical story moments.
- Memory usage returns to a stable level after transitions and replay.

## 7. Accessibility quality

- The feature follows `docs/technical/ACCESSIBILITY.md`.
- The complete path can be operated with a keyboard.
- Focus order, focus visibility, and accessible names are correct.
- Important state changes are available to assistive technology.
- Information is not conveyed by color, motion, sound, or spatial position alone.
- Reduced-motion preferences are respected.
- Touch and pointer targets are appropriately sized.
- The feature remains usable under text zoom and narrow layouts.

## 8. Test completion

The following must be verified where applicable:

- Clean first visit.
- Returning visit with persisted state.
- Full happy path.
- Repeated and rapid input.
- Pointer cancellation and lost pointer capture.
- Keyboard-only input.
- Touch input.
- Visibility changes and focus loss.
- Reload during an active state.
- Narrow mobile layout.
- Wide desktop layout.
- Reduced-motion mode.
- Audio unavailable or blocked.
- Asset load failure or slow connection.

Automated tests must cover deterministic business, state, and utility logic when practical. Manual-only verification must be recorded in the pull request.

## 9. Review completion

- The author completed the pull request checklist.
- The final diff received a self-review.
- Required reviewers approved the change.
- All blocking comments are resolved.
- Visual changes include evidence such as screenshots or recordings.
- Risky state, performance, accessibility, or persistence changes receive focused review.
- CI passes on the final commit.

## 10. Documentation completion

- User-visible behavior is documented where needed.
- Architecture and state-machine documents reflect structural changes.
- New conventions are added to the relevant project guide.
- New configuration, assets, scripts, and commands are documented.
- Roadmap and backlog status are updated.
- Release-impacting changes are captured for the release checklist.

## 11. Release readiness

A completed change must be safe to release without additional development work.

- Production build succeeds.
- Deployment configuration is valid.
- The default branch contains all required files.
- No known critical or high-severity defect remains.
- Rollback or disable strategy is understood for high-risk changes.
- Monitoring or validation steps are defined for behavior that cannot be fully verified before deployment.

## Severity rule

The following automatically prevent a change from being done:

- A broken primary interaction.
- An unrecoverable state.
- A keyboard-inaccessible critical path.
- A severe performance regression.
- A corrupted persisted state.
- A console error caused by the delivered flow.
- A missing required asset or configuration.
- A mismatch between documentation and implementation that could mislead future contributors or AI agents.

## Final declaration

Before marking work complete, the owner must be able to answer yes to all three questions:

1. Can a user complete the intended experience reliably?
2. Can another contributor understand and maintain the implementation?
3. Can this exact commit be deployed safely?

If any answer is no, the work is not done.
