package com.handmeasure.measurement

import com.google.common.truth.Truth.assertThat
import com.handmeasure.api.CaptureStep
import com.handmeasure.api.HandMeasureWarning
import org.junit.Test

class FingerMeasurementFusionTest {
    @Test
    fun fuse_penalizesInconsistentSideViews() {
        val fusion = FingerMeasurementFusion()
        val result =
            fusion.fuse(
                listOf(
                    StepMeasurement(CaptureStep.FRONT_PALM, widthMm = 18.0, confidence = 0.85f, measurementConfidence = 0.85f),
                    StepMeasurement(CaptureStep.LEFT_OBLIQUE, widthMm = 17.0, confidence = 0.85f, measurementConfidence = 0.85f),
                    StepMeasurement(CaptureStep.RIGHT_OBLIQUE, widthMm = 12.0, confidence = 0.85f, measurementConfidence = 0.85f),
                ),
            )

        assertThat(result.thicknessMm).isGreaterThan(0.0)
        assertThat(result.perStepResidualsMm).isNotEmpty()
        assertThat(result.confidenceScore).isLessThan(0.95f)
    }

    @Test
    fun fuse_warnsWhenThicknessReliesOnSingleWeakAngle() {
        val fusion = FingerMeasurementFusion()
        val result =
            fusion.fuse(
                listOf(
                    StepMeasurement(CaptureStep.FRONT_PALM, widthMm = 18.0, confidence = 0.7f, measurementSource = WidthMeasurementSource.EDGE_PROFILE),
                    StepMeasurement(CaptureStep.LEFT_OBLIQUE, widthMm = 16.5, confidence = 0.45f, measurementSource = WidthMeasurementSource.LANDMARK_HEURISTIC),
                ),
            )

        assertThat(result.warnings).contains(HandMeasureWarning.THICKNESS_ESTIMATED_FROM_WEAK_ANGLES)
    }
}
