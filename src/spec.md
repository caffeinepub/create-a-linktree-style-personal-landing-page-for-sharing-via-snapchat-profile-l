# Specification

## Summary
**Goal:** Polish the profile landing page UI to feel more premium and consistent (luxury gold-on-obsidian) while improving layout balance and button alignment, without adding new features.

**Planned changes:**
- Refresh visual theme system (typography scale, spacing, borders, shadows, hover/press states) and apply consistently across all interactive elements (Share, CTAs, link rows).
- Tighten vertical rhythm and center/balance the profile card across mobile and desktop with a sensible max width, no overflow, and a fixed background that doesn’t jitter on scroll.
- Standardize CTA/link button layout rules (height, padding, radius, icon sizing, text alignment) so icon and non-icon rows align consistently, including the Snapchat row.
- Update the default bio copy to a clearer 1–2 line English intro and add a localStorage migration that only replaces the bio if it exactly matches the old default string.

**User-visible outcome:** The profile page looks more luxurious and cohesive, scrolls smoothly, buttons/rows align cleanly (including Snapchat), and new users see an improved default bio while existing customized bios remain unchanged.
