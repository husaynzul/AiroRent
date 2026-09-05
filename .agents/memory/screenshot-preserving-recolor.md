---
name: Screenshot-preserving recolor
description: Durable approach for adding interaction to a fixed screenshot-based visual without redesigning its geometry.
---

When a visual must remain unchanged, derive masks from the original asset’s pixels and apply dynamic color layers through those masks instead of rebuilding the shapes in HTML/CSS.

**Why:** Recreating screenshot geometry introduces visible drift, duplicate layers, and altered shadows. Mask overlays preserve the source design while allowing state-driven recoloring.

**How to apply:** Keep the source image as the default visual, render recolor layers only when state differs, and convert wrapper-relative handle positions into the source image’s coordinate space before applying clip paths.