# Specification

## Summary
**Goal:** Add Snapchat-style, full-width action buttons for Phone, Email, and Instagram in the main Links section.

**Planned changes:**
- Show a full-width **Phone** button (Snapchat button styling) when a phone number exists; clicking opens the device dialer via a sanitized `tel:` link without opening a new tab.
- Show a full-width **Email** button (Snapchat button styling) when a valid email exists; clicking opens the default mail client via a safe `mailto:` link without opening a new tab.
- Add a full-width **Instagram** button (Snapchat button styling) that always navigates to `https://www.instagram.com/ae560919?igsh=NHFmdnppNzU4OWVy` in a new tab, and stop filtering/removing Instagram links during load/render.
- Update default profile link initialization and localStorage migration so the Instagram link is added for existing users only if that exact URL is missing (no duplicates), while keeping Twitter/X removed/not shown.

**User-visible outcome:** Users see Snapchat-style buttons for calling, emailing, and opening the specified Instagram profile (Instagram appears for both new and returning users when applicable).
