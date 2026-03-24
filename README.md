# 3D Hub

**English** | [简体中文](./README.zh-CN.md)

> AI-powered character creation studio for generating, refining, and exporting 3D personas.

## Overview

3D Hub is a natural-language-driven 3D character creation project.

Instead of forcing users to begin with low-level sliders, 3D Hub starts from **intent**:
users describe the character they want in natural language, the system interprets that description, generates a structured character configuration, renders a 3D preview, and then allows further refinement through an interactive control interface.

The long-term goal is not just to display a customizable avatar on the web, but to build a complete pipeline from:

**text description → structured character definition → editable 3D character → exportable 3D model**

Ultimately, exported models should support downstream use cases such as:
- asset reuse
- visual presentation
- further editing
- 3D printing

---

## Product Vision

3D Hub aims to become a character creation platform where users can:

1. **Describe** an imagined character in natural language
2. **Generate** a visualized 3D character from that description
3. **Refine** the result with direct controls and presets
4. **Save and export** the final character configuration and model
5. **Prepare outputs** for future manufacturing or 3D printing workflows

In one sentence:

> 3D Hub turns imagination into editable and exportable 3D characters.

---

## Current Direction

The current prototype direction focuses on building a **stage-first character creation experience**:

- a central 3D character stage
- a floating control console layered over the stage
- natural-language input as the primary creation entry
- presets and fine-tuning controls as secondary refinement tools

This direction is intentionally closer to a **character lab / creation studio** than a traditional web form or admin dashboard.

---

## Core Product Flow

1. User enters a character description
2. System parses the text into structured character parameters
3. Character state is applied to a 3D model
4. User refines the result with presets and parameter controls
5. User exports configuration and, later, the 3D model itself

---

## MVP Scope

The first practical milestone is to validate the following loop:

**natural language input → character state → 3D preview → manual refinement → config export**

### MVP goals
- Render a 3D character in the browser
- Support a small set of editable facial parameters
- Add a natural-language prompt input area
- Apply style presets
- Save/export the current character configuration

### Out of scope for the earliest version
- fully automatic high-quality printable mesh generation
- complex production-grade asset pipeline
- full account system
- advanced multiplayer or collaboration features

---

## Suggested Architecture

The prototype is moving away from a single-file demo toward a layered structure.

### Recommended structure

```text
3dhub/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── state.js
│   ├── renderer.js
│   ├── character.js
│   ├── controls.js
│   ├── presets.js
│   └── text-parser.js
├── assets/
│   └── models/
├── data/
│   └── presets.json
└── docs/
    └── ARCHITECTURE.md
```

### Responsibilities

- `state.js` — single source of truth for character parameters
- `character.js` — character mesh creation and update logic
- `renderer.js` — Three.js scene, camera, lights, renderer
- `controls.js` — UI events and state updates
- `presets.js` — predefined style templates
- `text-parser.js` — future text-to-character parsing layer
- `main.js` — application bootstrap and module wiring

---

## UI / Layout Direction

The intended layout is **not** a standard left-right admin split.

Instead, 3D Hub should feel like a **3D character creation workspace**:

- full-screen stage background
- central character presentation area
- floating control console on the right side of the stage
- lightweight status cards layered on top
- a clear sense of depth, hierarchy, and spatial composition

### Visual keywords
- cyberpunk-inspired
- futuristic
- stage-like
- layered
- neon-accented but controlled
- tool-like, not dashboard-like

---

## Design Principles

### 1. Character first
The character and stage must be the visual center of the experience.

### 2. Natural language first
Sliders are refinement tools, not the core entry point.

### 3. Parameter-driven architecture
UI should update a centralized character state, not directly mutate scene objects everywhere.

### 4. Exportability matters
The system should be designed from the beginning with future export pipelines in mind.

### 5. Product feel over demo feel
The experience should resemble a creation studio, not a technical experiment page.

---

## Long-Term Technical Direction

### Frontend
- Next.js / React
- Tailwind CSS
- React Three Fiber
- Drei
- Zustand

### 3D Layer
- GLB / glTF assets
- morph targets / blend shapes
- modular parts (hair, accessories, outfits)

### AI / Parsing Layer
- LLM-driven natural language parsing
- structured character schema output
- future style and prompt presets

### Export Layer
- config export (JSON)
- model export (GLB)
- future printable pipeline (STL / Blender processing)

---

## Planned Documentation

This README is the project-facing summary.

Additional docs can be split into:
- `docs/ARCHITECTURE.md`
- `docs/VISUAL_DESIGN.md`
- `docs/MVP-PLAN.md`
- `docs/DATA-SCHEMA.md`
- `docs/EXPORT-PIPELINE.md`

---

## Current Status

The project is currently in the **prototype architecture and interface definition phase**.

Recent focus areas include:
- clarifying the product vision
- moving from a single-file demo to a layered structure
- redefining the page layout around a floating control console
- improving the visual direction toward a more futuristic / cyberpunk character-lab feel

---

## Next Steps (2026-03-25)

### Goal: Complete Text-to-Image Guidance System

**Problem Statement:**
The core challenge of 3D character generation from images is achieving **consistency** — generating multiple views of the same character (front, back, side, 45°, etc.) while maintaining the same identity, features, and style.

**Key Challenge:**
Current image generation models (like MiniMax image-01) are pure text-to-image. They generate each image independently without character memory. Reference images only influence "style," not "character identity."

**Research Direction:**
1. **Character Consistency Methods**
   - Reference image + consistent prompt structure for multi-view generation
   - Character LoRA / ID training for dedicated character models
   - Specialized multi-view generation models (e.g., ShiLi纪's approach)

2. **Prompt Engineering for Pixel Art Characters**
   - Locking down: hair color, eye style, build, clothing, accessories
   - Varying only: camera angle, pose, lighting
   - Establishing a reusable prompt template

3. **Practical Workflow**
   - User provides or selects a reference character image
   - System generates multiple standardized views automatically
   - Views fed into 3D model reconstruction pipeline

**Success Criteria:**
- Given one reference image, generate 6 standardized character views (front, back, left, right, left-front 45°, right-front 45°)
- All views share consistent: identity, hair, eyes, build, clothing style, color palette
- Pixel art style maintained across all views

**Files to Reference:**
- `docs/VISUAL_DESIGN.md` — visual direction
- `docs/ARCHITECTURE.md` — module architecture

---

## Summary

3D Hub is being designed as a natural-language-first 3D character creation studio.

The goal is not simply to let users tweak a model with sliders, but to let them:
- imagine a character
- describe it in words
- see it visualized in 3D
- refine it interactively
- export it as a reusable digital asset

---

## Repository

GitHub repository:

`git@github.com:KieranFinn/3D-Hub.git`
