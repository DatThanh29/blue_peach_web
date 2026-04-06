# HandTryOn Refactor Path (Current Status)

## What is now implemented

### 1) Internal/headless engine-facing layer in `:HandTryOn`

- Added internal `TryOnEngine` (`com.handtryon.engine.TryOnEngine`).
- Added internal engine request/result models (`com.handtryon.engine.model`).
- Added mapper/adaptation layer (`com.handtryon.engine.compat.TryOnEngineDomainMapper`).
- Existing public compatibility entry `TryOnSessionResolver` now delegates to `TryOnEngine`.

### 2) First portable extraction in `:handtryon-core`

- Added new module `:handtryon-core`.
- Extracted Android-free models and policy logic:
  - `TryOnSessionResolverPolicy`
  - `TemporalPlacementSmootherPolicy`
  - `PlacementValidationPolicy`
  - `DefaultFingerAnchorFactory`

### 3) Compatibility adapters in `:HandTryOn`

- `DefaultFingerAnchorProvider`, `TemporalPlacementSmoother`, and `PlacementValidator` now delegate to `:handtryon-core` logic through mapper-based adapters.

### 4) Engine/result boundary cleanup in `:HandTryOn`

- `TryOnEngine` now returns Android-free engine-facing state:
  - `TryOnEngineSessionState`
  - `TryOnEngineRenderState`
  - packaged as `TryOnEngineResult`
- `TryOnSessionResolver` now exposes additive compatibility output via `resolveState(...)` returning:
  - domain session (`TryOnSession`)
  - render compatibility state (`TryOnRenderState`)
  - wrapped in `TryOnSessionResolution`
- `StableRingOverlayRenderer` accepts `TryOnRenderState` for Android render output generation while keeping `TryOnRenderResult` as the `Bitmap` compatibility output.

## Current boundaries

- **Android/public compatibility (`:HandTryOn`)**
  - realtime CameraX analyzer
  - bitmap-based overlay renderer
  - Compose overlay integration
  - render output model carrying `Bitmap` (`TryOnRenderResult`)
- **Engine-facing internal (`:HandTryOn`)**
  - engine facade + request/result/session/render models + mapper
  - compatibility wrappers for existing API usage
- **Portable core (`:handtryon-core`)**
  - session/mode/fallback policy
  - smoothing/validation policy
  - anchor extraction policy
  - Android-free session/placement models

## What intentionally remains Android-only

- `TryOnRealtimeAnalyzer` / `RgbaFrameBitmapConverter` (CameraX + `ImageProxy`)
- `StableRingOverlayRenderer` and preview/export rendering (`Bitmap`, `Canvas`)
- `TryOnRenderResult` (contains `Bitmap`)
- Compose overlay UI (`TryOnOverlay`)

## Phase 1 stabilization status (current)

- Build graph is currently aligned:
  - `settings.gradle.kts` includes `:handtryon-core` and `:HandTryOn`.
  - `:HandTryOn` consumes `:handtryon-core` via Gradle project dependency.
- CI gate now validates TryOn modules explicitly:
  - `:handtryon-core:test`
  - `:HandTryOn:compileDebugKotlin`
  - `:HandTryOn:testDebugUnitTest`
- Baseline contract tests are in place for:
  - `TryOnEngine` orchestration boundary
  - `TryOnSessionResolverPolicy`
  - `TemporalPlacementSmootherPolicy`
  - `PlacementValidationPolicy`
  - mapper conversions between engine-facing/core models and Android compatibility models

## What is still future work after Phase 1

- redesigning `TryOnEngine` internals beyond the current boundary
- deep renderer refactor or rendering technology replacement
- broad package cleanup and module migration beyond current extraction
- KMP migration of try-on components
