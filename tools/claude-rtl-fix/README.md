# Arabic RTL fix for Claude

A tiny Chrome / Brave extension: on claude.ai, a reply that mixes Egyptian Arabic and English
words is shown right to left whenever a paragraph, list item, heading or table is mostly Arabic,
so the Arabic no longer reads backwards when a line starts with an English word. Code blocks stay
left to right. Nothing is sent anywhere; it only sets `dir="rtl"` on the page.

## Install

1. Open `chrome://extensions` (Brave: `brave://extensions`).
2. Turn on **Developer mode** (top right).
3. **Load unpacked** → choose this folder (`tools/claude-rtl-fix`).
4. Reload the claude.ai tab.

It works on claude.ai in the browser (claude.ai/code included), not inside the Claude desktop app.
