## Context

The current app ships one built-in VSD board (`home`) and treats VSD backgrounds as static files from `public/`. The caregiver experience is limited to Grid-centric modals. Board edits persist through `localStorage`, and built-in boards are merged with stored boards on startup so static schema and assets win unless the board is fully user-created.

This feature adds the first real caregiver VSD workflow. It must fit the existing Redux store and board JSON model, preserve offline-first behavior, and avoid breaking built-in boards that still rely on static assets checked into the repo.

## Goals / Non-Goals

**Goals:**

- Let caregivers create VSD boards without editing JSON files manually.
- Let caregivers upload a room photo or floor-plan image and reuse it offline on the current device.
- Let caregivers draw, move, resize, edit, and delete rectangular hotspots using the existing button data model.
- Preserve built-in static VSD boards until a caregiver explicitly customizes them.

**Non-Goals:**

- No remote persistence, sync, or multi-user collaboration.
- No AI-suggested hotspots, semantic scene detection, or OCR.
- No non-rectangular hotspot shapes in this iteration.
- No draft/publish split or version history.

## Decisions

### Use IndexedDB for VSD image assets

Background images SHALL be stored in IndexedDB rather than `localStorage`. Board JSON remains in `localStorage`, but image blobs are referenced by a stable `ext_voco_asset_id` on the corresponding image record. This avoids quota pressure from base64 data URLs while keeping the app offline-capable. The existing listener-based board persistence remains the source of truth for board metadata.

Alternative considered: storing image data URLs inside board JSON. Rejected because it would quickly exhaust `localStorage` and make board merges brittle.

### Reuse board buttons as hotspot records

Each hotspot remains a normal board button with `label`, `vocalization`, and `ext_voco_hotspot`. The edit modal remains the primary metadata editor for both Grid buttons and VSD hotspots, with coordinate fields shown only when a hotspot exists. This keeps speech, persistence, and recommendation-adjacent data flows aligned with the existing board model.

Alternative considered: introducing a separate `hotspots` array. Rejected because it would fork the board model and require duplicate persistence and editing code.

### Build a dedicated VSD editing surface inside VSDView

`VSDView` SHALL handle both display mode and edit mode. In edit mode it shows a simple toolbar, background upload/replace entry point, draw mode, visible handles, and direct-manipulation hotspot interactions. Pointer interactions are local component state during drag and are committed through `updateBoard` on pointer release. This keeps editing scoped to the VSD rendering surface without changing the router or creating a new page.

Alternative considered: a separate caregiver page for VSD editing. Rejected for now because it would introduce duplicate rendering and navigation logic before the information architecture is settled.

### Gate built-in asset overrides behind explicit user ownership

Stored boards SHALL only override built-in `images` and `ext_voco_background` when the stored board has `ext_voco_user_owned_vsd === true`. Static boards still win for all uncustomized built-in VSD boards. User-created boards continue to load entirely from storage. This avoids repeating the earlier stale-asset bug while still allowing caregivers to customize built-in VSD boards once they intentionally edit them.

Alternative considered: always let stored boards override static boards. Rejected because it would recreate drift and broken asset references from stale local state.

## Risks / Trade-offs

- [IndexedDB lifecycle complexity] → Encapsulate image CRUD in `boardStorage.js` and revoke object URLs when VSD components unmount or images change.
- [Pointer interactions on touch devices can be fragile] → Keep the first version rectangle-only with four corner handles and clamp values on release.
- [Immediate-save editing increases accidental changes] → Keep edits explicit through visible edit mode, require modal confirmation for new hotspots, and preserve delete confirmation in the edit modal.
- [Spec drift with existing persistence behavior] → Update PRD, TODO, and Spectra delta specs in the same change before coding.
