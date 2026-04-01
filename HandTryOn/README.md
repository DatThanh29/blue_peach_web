# HandTryOn Module

`HandTryOn` provides real-time ring overlay for Android preview and export flows.

## Goals

- Keep try-on independent from `HandMeasureContract`.
- Support three runtime modes: `Measured`, `LandmarkOnly`, `Manual`.
- Keep realtime behavior lightweight with deterministic fallback paths.

## Current package areas (`:HandTryOn`)

- `com.handtryon.domain`
- `com.handtryon.core`
- `com.handtryon.engine`
- `com.handtryon.render`
- `com.handtryon.realtime`
- `com.handtryon.validation`
- `com.handtryon.data`
- `com.handtryon.ui`

## Architecture status (source truth)

- **Android/public compatibility layer (`:HandTryOn`)**
  - CameraX analyzer/runtime (`TryOnRealtimeAnalyzer`, `RgbaFrameBitmapConverter`)
  - bitmap rendering output (`StableRingOverlayRenderer`, `TryOnRenderResult`)
  - overlay/UI integration (`TryOnOverlay`)
- **Internal/headless engine-facing layer (`:HandTryOn`)**
  - `TryOnEngine` orchestration entry
  - internal engine request/result/session/render-state models (`com.handtryon.engine.model`)
  - mapper + compatibility adapter (`TryOnEngineDomainMapper`, `TryOnSessionResolver`)
  - compatibility session+render-state output (`TryOnSessionResolution`)
- **Portable policy layer (`:handtryon-core`)**
  - `TryOnSessionResolverPolicy`
  - `TemporalPlacementSmootherPolicy`
  - `PlacementValidationPolicy`
  - `DefaultFingerAnchorFactory`
  - Android-free try-on session/placement models

## Boundary notes

- `TryOnEngine` now primarily returns Android-free engine state (`TryOnEngineResult` with session + render state).
- `TryOnRenderState` is Android/public compatibility render input without `Bitmap`.
- `TryOnRenderResult` remains Android-side because it carries `Bitmap`.
- `:handtryon-core` contains no `Bitmap`, `ImageProxy`, CameraX, Compose, or Android UI classes.
