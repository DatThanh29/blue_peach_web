package com.handmeasure.measurement

import com.handmeasure.api.CaptureStep
import com.handmeasure.api.HandMeasureWarning

class FingerMeasurementFusion {
    fun fuse(measurements: List<StepMeasurement>): FusedFingerMeasurement {
        val frontal =
            measurements.firstOrNull { it.step == CaptureStep.FRONT_PALM }
                ?: measurements.maxByOrNull { it.confidence }
                ?: StepMeasurement(CaptureStep.FRONT_PALM, widthMm = 18.0, confidence = 0.2f)

        val thicknessCandidates =
            measurements.filter { it.step != CaptureStep.FRONT_PALM }.map { step ->
                val correction =
                    when (step.step) {
                        CaptureStep.LEFT_OBLIQUE, CaptureStep.RIGHT_OBLIQUE -> 0.84
                        CaptureStep.UP_TILT, CaptureStep.DOWN_TILT -> 0.88
                        CaptureStep.FRONT_PALM -> 1.0
                    }
                step.widthMm * correction
            }

        val thicknessMm =
            if (thicknessCandidates.isEmpty()) {
                frontal.widthMm * 0.78
            } else {
                thicknessCandidates.sorted()[thicknessCandidates.size / 2]
            }

        val circumferenceMm = EllipseMath.circumferenceFromWidthThickness(frontal.widthMm, thicknessMm)
        val diameterMm = EllipseMath.equivalentDiameterFromCircumference(circumferenceMm)
        val averageConfidence = measurements.map { it.confidence }.average().toFloat().coerceIn(0f, 1f)

        val warnings = buildList {
            if (averageConfidence < 0.65f) add(HandMeasureWarning.BEST_EFFORT_ESTIMATE)
            if (thicknessCandidates.size < 2) add(HandMeasureWarning.THICKNESS_ESTIMATED_FROM_WEAK_ANGLES)
        }

        return FusedFingerMeasurement(
            widthMm = frontal.widthMm,
            thicknessMm = thicknessMm,
            circumferenceMm = circumferenceMm,
            equivalentDiameterMm = diameterMm,
            confidenceScore = averageConfidence,
            warnings = warnings,
            debugNotes = listOf("thicknessSamples=${thicknessCandidates.joinToString(",")}"),
        )
    }
}
