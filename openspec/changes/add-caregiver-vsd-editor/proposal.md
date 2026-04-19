## Why

The current caregiver tooling can only edit board names and button text on existing boards. VSD boards still depend on built-in scene assets and hand-authored hotspot JSON, which prevents caregivers from uploading their own room photos or floor-plan images and maintaining them through the UI.

## What Changes

- Add a caregiver VSD editing capability for uploading or replacing a VSD background image from the browser and storing it locally for offline use.
- Add direct hotspot authoring for VSD boards, including drawing, moving, resizing, editing, and deleting rectangular regions.
- Extend caregiver editing flows so VSD hotspots reuse the existing button model and `EditButtonModal` instead of introducing a separate hotspot entity.
- Extend board creation so caregivers can create either Grid or VSD boards from the existing add-board flow.
- Update persistence so user-owned VSD assets survive reloads while built-in static VSD assets continue to win until a caregiver explicitly customizes the board.

## Non-Goals

- No cloud sync, account system, or remote upload API.
- No AI-assisted hotspot detection or Vision API integration.
- No polygonal hotspot editor, PDF import, or multi-image scene library.
- No draft/publish workflow; edits apply immediately to the active board.

## Capabilities

### New Capabilities

- `caregiver-vsd-editing`: Caregivers can manage VSD background images and rectangular hotspots entirely from the UI.

### Modified Capabilities

- `board-creation`: Board creation now supports choosing whether a new board is Grid or VSD.
- `board-persistence`: Board persistence now includes local VSD asset storage and conditional override rules for built-in VSD boards.
- `button-editing`: Button editing now supports VSD hotspots, including optional hotspot coordinate fields.
- `caregiver-edit-mode`: Edit mode now exposes VSD-specific editing controls and suppresses speech/navigation while editing hotspots.

## Impact

- Affected specs: `caregiver-vsd-editing`, `board-creation`, `board-persistence`, `button-editing`, `caregiver-edit-mode`
- Affected code: `docs/PRD.md`, `docs/TODO.md`, `src/features/board/VSDView.jsx`, `src/features/board/BoardRenderer.jsx`, `src/features/caregiver/AddBoardModal.jsx`, `src/features/caregiver/EditButtonModal.jsx`, `src/utils/obfParser.js`, `src/utils/boardStorage.js`, `src/app/store.js`
- Affected browser storage: `localStorage` board records and a new IndexedDB store for VSD image assets
