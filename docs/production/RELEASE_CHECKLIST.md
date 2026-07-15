# Release Checklist

## Purpose

This checklist defines the minimum release bar for PROJECT TITAN before any version is promoted to the public GitHub Pages experience. It is intentionally strict: the project is a cinematic interactive experience, so visual continuity, input reliability, accessibility, and performance all matter equally.

---

## 1. Release Scope

- [ ] Release objective is written in one sentence.
- [ ] Included features are listed.
- [ ] Deferred features are explicitly excluded.
- [ ] Known risks are recorded.
- [ ] Release owner is identified.
- [ ] Target branch and deployment environment are confirmed.

---

## 2. Gameplay Flow

- [ ] Full experience can be completed from boot to final acknowledged state.
- [ ] No state can become permanently blocked.
- [ ] All required interactions provide clear visual feedback.
- [ ] Every interaction has a keyboard-accessible equivalent.
- [ ] Pointer cancellation does not leave controls stuck.
- [ ] Repeated input does not trigger duplicate transitions.
- [ ] The experience remains understandable without audio.
- [ ] First-visit guidance appears only when appropriate.
- [ ] Returning users are not forced through unnecessary onboarding.

### State sequence validation

- [ ] BOOT
- [ ] CALIBRATION
- [ ] POWER_OFF
- [ ] POWER_RESTORED
- [ ] SIGNAL_TUNING
- [ ] SIGNAL_LOCKED
- [ ] RADAR_TRACKING
- [ ] VISUAL_CONTACT
- [ ] HAND_SYNC
- [ ] CONTACT_ACKNOWLEDGED

---

## 3. Visual Quality

- [ ] Composition follows `CAMERA_BIBLE.md`.
- [ ] Motion follows `MOTION_BIBLE.md`.
- [ ] Materials, lighting, and color follow `ART_BIBLE.md`.
- [ ] Emotional pacing follows `EMOTION_CURVE.md`.
- [ ] Hero moments remain readable at 375, 768, 1024, and 1440 px widths.
- [ ] UI never covers the primary visual subject.
- [ ] Text contrast remains readable over all backgrounds.
- [ ] No placeholder assets, debug overlays, or temporary labels remain.
- [ ] No visible geometry clipping, z-fighting, or texture stretching.
- [ ] Reduced-motion mode preserves story clarity.

---

## 4. Interaction and Input

- [ ] Mouse drag interactions work consistently.
- [ ] Touch interactions work on iOS Safari.
- [ ] Keyboard-only completion is possible.
- [ ] Focus order follows the narrative flow.
- [ ] Focus indicators are always visible.
- [ ] Controls expose meaningful accessible names.
- [ ] Holding, dragging, rotating, and tracking mechanics tolerate minor user error.
- [ ] Input remains stable after tab switching or visibility changes.
- [ ] Multi-touch does not corrupt interaction state.

---

## 5. Accessibility

- [ ] WCAG AA contrast is met for essential text and controls.
- [ ] Screen-reader landmarks and interaction labels are meaningful.
- [ ] Decorative elements are hidden from the accessibility tree.
- [ ] Live announcements are concise and non-repetitive.
- [ ] No critical information depends only on color.
- [ ] Reduced-motion preference is honored.
- [ ] Audio can be muted without losing progression cues.
- [ ] Tap targets are at least 44 × 44 CSS pixels where practical.
- [ ] No keyboard trap exists.

---

## 6. Performance

- [ ] Initial experience becomes interactive within the defined performance budget.
- [ ] No uncontrolled memory growth occurs during a full playthrough.
- [ ] Rendering pauses or degrades safely when the tab is hidden.
- [ ] Particle counts and post-processing respect device tiers.
- [ ] Mobile fallback is active on constrained devices.
- [ ] Long tasks are minimized during active interactions.
- [ ] Animations remain stable under frame-rate variation.
- [ ] No console errors appear during a full playthrough.
- [ ] No failed asset requests appear in the network panel.

### Minimum device checks

- [ ] Recent iPhone Safari.
- [ ] Recent Android Chrome.
- [ ] Desktop Chrome.
- [ ] Desktop Safari.
- [ ] Desktop Firefox.

---

## 7. Audio

- [ ] Audio starts only after valid user interaction.
- [ ] Mute control is reachable and persistent.
- [ ] Audio does not restart unexpectedly after visibility changes.
- [ ] Layered effects do not clip.
- [ ] Critical feedback has a visual equivalent.
- [ ] Ambient loops transition cleanly between narrative states.

---

## 8. Persistence and Replay

- [ ] Stored progress does not break the current release.
- [ ] Versioned local data is migrated or safely reset.
- [ ] First-visit state behaves correctly.
- [ ] Replay path is intentional and documented.
- [ ] Clearing local storage restores a clean first-run experience.

---

## 9. Code and Architecture

- [ ] State transitions are centralized and deterministic.
- [ ] Rendering code does not own narrative truth.
- [ ] Event listeners and timers are cleaned up.
- [ ] No duplicate animation loops exist.
- [ ] No inline emergency patches remain without documentation.
- [ ] New modules follow `ARCHITECTURE.md`.
- [ ] State changes follow `STATE_MACHINE.md`.
- [ ] Performance decisions follow `PERFORMANCE.md`.
- [ ] Accessibility decisions follow `ACCESSIBILITY.md`.

---

## 10. Documentation

- [ ] Feature behavior is documented.
- [ ] New states and transitions are documented.
- [ ] New assets and licenses are recorded.
- [ ] Known limitations are listed.
- [ ] `ROADMAP.md` reflects the actual project status.
- [ ] `BACKLOG.md` contains deferred work.
- [ ] `AUDIT.md` reflects the latest review.

---

## 11. Build and Deployment

- [ ] Production build completes successfully.
- [ ] Static export paths work under the GitHub Pages base path.
- [ ] Direct asset URLs resolve correctly.
- [ ] Deployment workflow succeeds on the release commit.
- [ ] Live site is tested after deployment.
- [ ] Cache behavior does not serve stale broken assets.
- [ ] Rollback commit is identified.

---

## 12. Final Release Review

A release is approved only when all critical items pass and any accepted exception includes:

- reason,
- user impact,
- owner,
- planned resolution,
- target release.

### Sign-off

- [ ] Product / experience review passed.
- [ ] Technical review passed.
- [ ] Accessibility review passed.
- [ ] Performance review passed.
- [ ] Production deployment verified.

---

## Release Rule

Do not release because the build works. Release only when the experience feels intentional from the first frame to the final response.