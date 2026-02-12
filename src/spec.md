# Specification

## Summary
**Goal:** Remove the duplicate “Follow me on Instagram” UI and ensure a single Instagram button links to the provided Instagram profile.

**Planned changes:**
- Update the landing page to display exactly one Instagram button/link that opens `https://www.instagram.com/ae560919?igsh=NHFmdnppNzU4OWVy` in a new tab.
- Remove (or prevent rendering of) any duplicate Instagram entry from `profile.links`, including cleaning existing localStorage data that contains a “Follow me on Instagram” item and/or the same Instagram URL.
- Change the Instagram button label to English text that is not “Follow me on Instagram” (e.g., “Instagram”), while keeping the Instagram icon and existing button styling.

**User-visible outcome:** The landing page shows only one Instagram button labeled in English (not “Follow me on Instagram”); clicking it opens the specified Instagram profile in a new tab, and other non-Instagram links (e.g., Snapchat) continue to work normally.
