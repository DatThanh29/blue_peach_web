package com.handmeasure.measurement

import com.handmeasure.api.CaptureStep
import com.handmeasure.api.HandMeasureWarning

data class StepMeasurement(
    val step: CaptureStep,
    val widthMm: Double,
    val confidence: Float,
)

data class FusedFingerMeasurement(
    val widthMm: Double,
    val thicknessMm: Double,
    val circumferenceMm: Double,
    val equivalentDiameterMm: Double,
    val confidenceScore: Float,
    val warnings: List<HandMeasureWarning>,
    val debugNotes: List<String>,
)
