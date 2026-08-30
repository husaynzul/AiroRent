---
name: Conversation asset handoff
description: Preserved uploaded assets can live outside the project asset alias after a conversation transitions into a project.
---

When a build starts after a conversation-to-project handoff, check whether uploaded files are present under the preserved conversation folder rather than the project’s normal asset directory. Copy the needed files into the project asset directory before importing them with the bundler.

**Why:** Raw browser URLs to the preserved conversation files can render as broken images, and direct bundler imports fail until the files exist under the project’s configured asset alias.

**How to apply:** For uploaded images used by a Vite app, copy the preserved files into `attached_assets/` and import them locally so the build bundles them instead of relying on runtime URL routing.