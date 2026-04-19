## 1. Specs and docs alignment

- [x] 1.1 Update PRD and TODO to describe caregiver-managed VSD background images and hotspot editing
- [x] 1.2 Validate the add-caregiver-vsd-editor proposal, design, and delta specs against Spectra analysis rules

## 2. Persistence and board model

- [x] 2.1 Implement Use IndexedDB for VSD image assets through Persist user-edited boards to localStorage with IndexedDB-backed VSD asset storage helpers
- [x] 2.2 Implement Gate built-in asset overrides behind explicit user ownership when Merge localStorage boards on app startup with `ext_voco_user_owned_vsd` gating for built-in VSD assets
- [x] 2.3 Implement Add board modal captures board display type and Confirm board creation creates and navigates to new board for both Grid and VSD board types

## 3. Caregiver VSD editing surface

- [x] 3.1 Implement Build a dedicated VSD editing surface inside VSDView and Edit mode exposes VSD editing controls for upload/replace and draw mode entry
- [x] 3.2 Implement Caregiver can upload and replace VSD background images using browser-local asset storage
- [x] 3.3 Implement Reuse board buttons as hotspot records for Caregiver can create and update rectangular VSD hotspots with draw, drag, and resize interactions
- [x] 3.4 Implement VSD edit mode separates editing from speaking so hotspot clicks edit in caregiver mode and speak in user mode

## 4. Shared editing UI and verification

- [x] 4.1 Implement Edit button modal opens on button click for both Grid buttons and VSD hotspots with hotspot coordinate fields
- [x] 4.2 Implement Confirm button edit saves changes for VSD hotspot coordinates and existing text fields
- [x] 4.3 Run build and existing end-to-end coverage for the updated caregiver flow, then fix any regressions
