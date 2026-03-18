# HandMeasure

`HandMeasure` is an Android library module that guides the user through a multi-angle hand capture flow and returns a best-effort ring-size estimate on-device.

## Assumptions

- `minSdk=26`, `compileSdk=35`
- Camera stack: CameraX
- Hand landmarks: MediaPipe Hand Landmarker Android Tasks API
- Reference calibration: ID-1 card (`85.60 mm x 53.98 mm`)
- v1 prioritizes deterministic result delivery over lab-grade accuracy
- v1 does not implement automatic timeout
- v1 uses a guided 5-step capture flow and always returns a result once the full sequence is completed

## Modules

- `:HandMeasure`: reusable Android library module
- `:app`: minimal sample app showing Activity Result API integration

## Public API

- `HandMeasureConfig`
- `HandMeasureContract`
- `HandMeasureResult`
- `RingSizeTable`

Example:

```kotlin
val launcher =
    registerForActivityResult(HandMeasureContract()) { result ->
        // nullable only if the user leaves before finishing the guided flow
    }

launcher.launch(
    HandMeasureConfig(
        targetFinger = TargetFinger.RING,
        debugOverlayEnabled = true,
        ringSizeTable = RingSizeTable.sampleUsLike(),
    ),
)
```

## Capture flow

The library guides the user through:

1. `FRONT_PALM`
2. `LEFT_OBLIQUE`
3. `RIGHT_OBLIQUE`
4. `UP_TILT`
5. `DOWN_TILT`

For each step the module:

- shows guidance text
- continuously scores frames
- keeps the best frame candidate
- auto-captures when the score crosses the threshold
- also allows manual progression using the best candidate seen so far
- allows retry of the current step

After all steps are captured, the library stops the camera, shows a processing screen, computes the measurement, then shows a result screen.

## Calibration model

The calibration source is only the detected ID-1 card.

Implementation details:

- the card detector segments the visible outer card contour from the frame
- it fits a tight rotated rectangle around the visible card pixels using `minAreaRect`
- rounded corners or chipped corners do not reduce the fitted rectangle dimensions
- the fitted rectangle long side is treated as card width in pixels
- the fitted rectangle short side is treated as card height in pixels

Metric scale:

- `mmPerPxX = 85.60 / rectWidthPx`
- `mmPerPxY = 53.98 / rectHeightPx`

The module does not use MediaPipe world coordinates as metric scale.

## Measurement approach

The v1 pipeline is practical and best-effort:

- detect hand landmarks
- detect the card and fit the ideal rectangle
- calibrate pixel-to-mm scale
- estimate finger width at the proximal phalanx ring zone in the frontal frame
- estimate thickness from oblique/tilt captures using repeated visible-width measurements plus view correction
- fuse measurements across captures with a robust median-style aggregation
- approximate the finger cross-section as an ellipse
- estimate circumference using Ramanujan's ellipse approximation
- map equivalent diameter to the nearest ring size in the configured table

## Result behavior

The library always tries to return a result after the full capture sequence.

If card quality, pose quality, blur, or motion are weak:

- confidence is reduced
- warnings are attached
- the result is still returned

Warnings may include:

- `BEST_EFFORT_ESTIMATE`
- `LOW_CARD_CONFIDENCE`
- `LOW_POSE_CONFIDENCE`
- `HIGH_BLUR`
- `HIGH_MOTION`
- `THICKNESS_ESTIMATED_FROM_WEAK_ANGLES`

## Tuning knobs

Key knobs live in `HandMeasureConfig` and `QualityThresholds`:

- `autoCaptureScore`
- `bestCandidateProgressScore`
- `handMinScore`
- `cardMinScore`
- `blurMinScore`
- `motionMinScore`
- `lightingMinScore`

## MediaPipe model

The library bundles `HandMeasure/src/main/assets/hand_landmarker.task`.

Current bundled source:

- `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task`

## Known limitations

- Card detection is robust to rounded corners, but still sensitive to heavy glare or extremely cluttered backgrounds.
- Thickness estimation from oblique/tilt frames is heuristic in v1.
- Debug overlay uses live detections and is intended for tuning, not pixel-perfect annotation export.
- Guidance uses synchronous background analysis with throttling rather than a full async live-stream graph.
- Result quality depends heavily on the card being near the target finger and inside the frame for all steps.

## Build

Windows note for Unicode paths:

```powershell
subst X: "$PWD"
pushd X:\
$env:GRADLE_USER_HOME="$PWD\.gradle_user_home_ascii"
.\gradlew.bat :HandMeasure:assembleDebug :app:assembleDebug
popd
subst X: /D
```

## Tests

Unit tests cover:

- scale calibration math
- card rectangle fitting helpers
- ellipse math
- ring size mapping
- frame quality scoring
- pose classification helpers
