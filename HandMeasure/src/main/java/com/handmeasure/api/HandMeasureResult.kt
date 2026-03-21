package com.handmeasure.api

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class HandMeasureResult(
    val targetFinger: TargetFinger,
    val fingerWidthMm: Double,
    val fingerThicknessMm: Double,
    val estimatedCircumferenceMm: Double,
    val equivalentDiameterMm: Double,
    val suggestedRingSizeLabel: String,
    val confidenceScore: Float,
    val warnings: List<HandMeasureWarning>,
    val capturedSteps: List<CapturedStepInfo>,
    val resultMode: ResultMode = ResultMode.HYBRID_ESTIMATE,
    val qualityLevel: QualityLevel = QualityLevel.LOW,
    val retryRecommended: Boolean = true,
    val calibrationStatus: CalibrationStatus = CalibrationStatus.MISSING_REFERENCE,
    val measurementSources: List<MeasurementSource> = emptyList(),
    val debugMetadata: DebugMetadata? = null,
) : Parcelable

@Parcelize
enum class ResultMode : Parcelable {
    DIRECT_MEASUREMENT,
    HYBRID_ESTIMATE,
    FALLBACK_ESTIMATE,
}

@Parcelize
enum class QualityLevel : Parcelable {
    HIGH,
    MEDIUM,
    LOW,
}

@Parcelize
enum class CalibrationStatus : Parcelable {
    CALIBRATED,
    DEGRADED,
    MISSING_REFERENCE,
}

@Parcelize
enum class MeasurementSource : Parcelable {
    EDGE_PROFILE,
    LANDMARK_HEURISTIC,
    DEFAULT_HEURISTIC,
    FUSION_ESTIMATE,
}

@Parcelize
data class CapturedStepInfo(
    val step: CaptureStep,
    val score: Float,
    val poseScore: Float,
    val cardScore: Float,
    val handScore: Float,
) : Parcelable

@Parcelize
data class DebugMetadata(
    val mmPerPxX: Double,
    val mmPerPxY: Double,
    val frontalWidthPx: Double,
    val thicknessSamplesMm: List<Double>,
    val rawNotes: List<String>,
    val sessionDiagnostics: SessionDiagnostics? = null,
) : Parcelable

@Parcelize
data class SessionDiagnostics(
    val stepDiagnostics: List<StepDiagnostics>,
    val fusedDiagnostics: FusedDiagnostics,
) : Parcelable

@Parcelize
data class StepDiagnostics(
    val step: CaptureStep,
    val handScore: Float,
    val cardScore: Float,
    val poseScore: Float,
    val blurScore: Float,
    val motionScore: Float,
    val lightingScore: Float,
    val cardCoverageRatio: Float,
    val cardAspectResidual: Float,
    val cardRectangularityScore: Float,
    val cardEdgeSupportScore: Float,
    val cardRectificationConfidence: Float,
    val scaleMmPerPxX: Double,
    val scaleMmPerPxY: Double,
    val widthSamplesMm: List<Double>,
    val widthVarianceMm: Double,
    val accepted: Boolean,
    val rejectedReason: String?,
    val confidencePenaltyReasons: List<String>,
    val measurementSource: MeasurementSource = MeasurementSource.DEFAULT_HEURISTIC,
    val usedFallback: Boolean = false,
    val coplanarityProxyScore: Float = 0f,
    val coplanarityProxyKind: String = "finger_card_2d_proximity",
) : Parcelable

@Parcelize
data class FusedDiagnostics(
    val widthMm: Double,
    val thicknessMm: Double,
    val circumferenceMm: Double,
    val equivalentDiameterMm: Double,
    val suggestedRingSizeLabel: String,
    val finalConfidence: Float,
    val warningReasons: List<String>,
    val perStepResidualsMm: List<Double>,
    val resultMode: ResultMode = ResultMode.HYBRID_ESTIMATE,
    val qualityLevel: QualityLevel = QualityLevel.LOW,
    val retryRecommended: Boolean = true,
    val calibrationStatus: CalibrationStatus = CalibrationStatus.MISSING_REFERENCE,
    val measurementSources: List<MeasurementSource> = emptyList(),
) : Parcelable

@Parcelize
enum class HandMeasureWarning : Parcelable {
    BEST_EFFORT_ESTIMATE,
    LOW_CARD_CONFIDENCE,
    LOW_POSE_CONFIDENCE,
    LOW_LIGHTING,
    HIGH_MOTION,
    HIGH_BLUR,
    THICKNESS_ESTIMATED_FROM_WEAK_ANGLES,
    CALIBRATION_WEAK,
    LOW_RESULT_RELIABILITY,
}

@Parcelize
enum class CaptureStep : Parcelable {
    FRONT_PALM,
    LEFT_OBLIQUE,
    RIGHT_OBLIQUE,
    UP_TILT,
    DOWN_TILT,
}
