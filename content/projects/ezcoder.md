---
slug: ezcoder
title: EZ Coder
client: Personal project
status: live
started: 2026-03-04
updated: 2026-10-25
summary: EZ Coder is the AI coding agent Nolan builds and ships with. It takes work by text or voice note, and a second agent reviews every finished job before it counts as done.
problem: Most coding agents need someone watching every step, approving and correcting. That makes the person the bottleneck and stops work the moment they step away.
role: Designed and builds the product, including the desktop app for macOS and Windows, CLI, phone control through Telegram and the autopilot review loop.
capabilities: [ai-agents, automation, internal-tools]
stack: [TypeScript, Tauri, Node.js]
links:
  - label: Source code
    url: https://github.com/Gahroot/ezcoder
outcomes:
  - text: A second agent reviews every finished job and sends it back with what is wrong until it passes.
    evidence: [E1]
  - text: Work can be sent from a phone through Telegram, including voice notes transcribed on the user's own machine.
    evidence: [E1, E2]
evidence:
  - id: E1
    kind: github-repo
    title: EZ Coder README
    date: 2026-10-25
    public: true
    ref: Gahroot/ezcoder@ed46ffbd
    url: https://github.com/Gahroot/ezcoder/blob/ed46ffbd/README.md
  - id: E2
    kind: github-commit
    title: Add Telegram remote control
    date: 2026-03-14
    public: true
    ref: Gahroot/ezcoder@997e5ca0
    url: https://github.com/Gahroot/ezcoder/commit/997e5ca0
featured: false
order: 6
---
Read [how Nolan ships client systems with AI agents](/writing/shipping-business-software-with-ai-agents).
