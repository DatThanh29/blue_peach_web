package com.handmeasure.measurement

import com.handmeasure.api.CaptureStep
import com.handmeasure.api.HandMeasureWarning
import com.handmeasure.api.MeasurementSource

enum class WidthMeasurementSource {
    EDGE_PROFILE,
    LANDMARK_HEURISTIC,
    DEFAULT_HEURISTIC,
}

fun WidthMeasurementSource.toApiSource(): MeasurementSource =
    when (this) {
        WidthMeasurementSource.EDGE_PROFILE -> MeasurementSource.EDGE_PROFILE
        WidthMeasurementSource.LANDMARK_HEURISTIC -> MeasurementSource.LANDMARK_HEURISTIC
        WidthMeasurementSource.DEFAULT_HEURISTIC -> MeasurementSource.DEFAULT_HEURISTIC
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
