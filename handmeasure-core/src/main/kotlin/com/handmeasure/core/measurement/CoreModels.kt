package com.handmeasure.core.measurement

enum class CaptureStep {
    FRONT_PALM,
    LEFT_OBLIQUE,
    RIGHT_OBLIQUE,
    UP_TILT,
    DOWN_TILT,
    BACK_OF_HAND,
    LEFT_OBLIQUE_DORSAL,
    RIGHT_OBLIQUE_DORSAL,
    UP_TILT_DORSAL,
    DOWN_TILT_DORSAL,
}

enum class CaptureStepRole {
    FRONTAL,
    LEFT_OBLIQUE,
    RIGHT_OBLIQUE,
    TILT_UP,
    TILT_DOWN,
}

fun CaptureStep.role(): CaptureStepRole =
    when (this) {
        CaptureStep.FRONT_PALM, CaptureStep.BACK_OF_HAND -> CaptureStepRole.FRONTAL
        CaptureStep.LEFT_OBLIQUE, CaptureStep.LEFT_OBLIQUE_DORSAL -> CaptureStepRole.LEFT_OBLIQUE
        CaptureStep.RIGHT_OBLIQUE, CaptureStep.RIGHT_OBLIQUE_DORSAL -> CaptureStepRole.RIGHT_OBLIQUE
        CaptureStep.UP_TILT, CaptureStep.UP_TILT_DORSAL -> CaptureStepRole.TILT_UP
        CaptureStep.DOWN_TILT, CaptureStep.DOWN_TILT_DORSAL -> CaptureStepRole.TILT_DOWN
    }

enum class WidthMeasurementSource {
    EDGE_PROFILE,
    LANDMARK_HEURISTIC,
    DEFAULT_HEURISTIC,
}

enum class HandMeasureWarning {
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

enum class MeasurementSource {
    EDGE_PROFILE,
    LANDMARK_HEURISTIC,
    DEFAULT_HEURISTIC,
    FUSION_ESTIMATE,
}

enum class ResultMode {
    DIRECT_MEASUREMENT,
    HYBRID_ESTIMATE,
    FALLBACK_ESTIMATE,
}

enum class QualityLevel {
    HIGH,
    MEDIUM,
    LOW,
}

enum class CalibrationStatus {
    CALIBRATED,
    DEGRADED,
    MISSING_REFERENCE,
}

data class StepMeasurement(
    val step: CaptureStep,
    val widthMm: Double,
    val confidence: Float,
    val measurementConfidence: Float = confidence,
    val rawWidthMm: Double = widthMm,
    val measurementSource: WidthMeasurementSource = WidthMeasurementSource.DEFAULT_HEURISTIC,
    val usedFallback: Boolean = measurementSource != WidthMeasurementSource.EDGE_PROFILE,
    val debugNotes: List<String> = emptyList(),
)

data class FusedFingerMeasurement(
    val widthMm: Double,
    val thicknessMm: Double,
    val circumferenceMm: Double,
    val equivalentDiameterMm: Double,
    val confidenceScore: Float,
    val warnings: List<HandMeasureWarning>,
    val debugNotes: List<String>,
    val perStepResidualsMm: List<Double> = emptyList(),
    val detectionConfidence: Float = confidenceScore,
    val poseConfidence: Float = confidenceScore,
    val measurementConfidence: Float = confidenceScore,
)

data class ReliabilityAssessment(
    val resultMode: ResultMode,
    val qualityLevel: QualityLevel,
    val retryRecommended: Boolean,
    val measurementSources: List<MeasurementSource>,
    val warnings: List<HandMeasureWarning>,
)

data class RingSizeEntry(
    val label: String,
    val diameterMm: Double,
) {
    val circumferenceMm: Double
        get() = diameterMm * Math.PI
}

data class RingSizeTable(
    val name: String,
    val entries: List<RingSizeEntry>,
) {
    init {
        require(entries.isNotEmpty()) { "RingSizeTable must contain at least one entry." }
    }
}
