package com.handmeasure.measurement

import com.google.common.truth.Truth.assertThat
import com.handmeasure.api.CalibrationStatus
import com.handmeasure.api.CaptureStep
import com.handmeasure.api.HandMeasureWarning
import com.handmeasure.api.QualityLevel
import com.handmeasure.api.ResultMode
import org.junit.Test

class ResultReliabilityPolicyTest {
    private val policy = ResultReliabilityPolicy()

    @Test
    fun assess_marksFallbackEstimateWhenAllStepsUseFallback() {
        val fused =
            FusedFingerMeasurement(
                widthMm = 18.0,
                thicknessMm = 14.0,
                circumferenceMm = 50.3,
                equivalentDiameterMm = 16.0,
                confidenceScore = 0.58f,
                warnings = emptyList(),
                debugNotes = emptyList(),
            )
        val measurements =
            listOf(
                StepMeasurement(CaptureStep.FRONT_PALM, widthMm = 18.0, confidence = 0.5f, measurementSource = WidthMeasurementSource.DEFAULT_HEURISTIC),
                StepMeasurement(CaptureStep.LEFT_OBLIQUE, widthMm = 16.0, confidence = 0.5f, measurementSource = WidthMeasurementSource.LANDMARK_HEURISTIC),
            )

        val assessment = policy.assess(fused, measurements, CalibrationStatus.DEGRADED, emptySet())

        assertThat(assessment.resultMode).isEqualTo(ResultMode.FALLBACK_ESTIMATE)
        assertThat(assessment.qualityLevel).isEqualTo(QualityLevel.LOW)
        assertThat(assessment.retryRecommended).isTrue()
        assertThat(assessment.warnings).contains(HandMeasureWarning.LOW_RESULT_RELIABILITY)
        assertThat(assessment.warnings).contains(HandMeasureWarning.CALIBRATION_WEAK)
    }

    @Test
    fun assess_marksDirectMeasurementForStrongEdgeBasedFlow() {
        val fused =
            FusedFingerMeasurement(
                widthMm = 18.0,
                thicknessMm = 14.1,
                circumferenceMm = 50.5,
                equivalentDiameterMm = 16.1,
                confidenceScore = 0.87f,
                warnings = emptyList(),
                debugNotes = emptyList(),
            )
        val measurements =
            listOf(
                StepMeasurement(CaptureStep.FRONT_PALM, widthMm = 18.0, confidence = 0.9f, measurementSource = WidthMeasurementSource.EDGE_PROFILE, usedFallback = false),
                StepMeasurement(CaptureStep.LEFT_OBLIQUE, widthMm = 15.2, confidence = 0.86f, measurementSource = WidthMeasurementSource.EDGE_PROFILE, usedFallback = false),
                StepMeasurement(CaptureStep.RIGHT_OBLIQUE, widthMm = 15.0, confidence = 0.84f, measurementSource = WidthMeasurementSource.EDGE_PROFILE, usedFallback = false),
            )

        val assessment = policy.assess(fused, measurements, CalibrationStatus.CALIBRATED, emptySet())

        assertThat(assessment.resultMode).isEqualTo(ResultMode.DIRECT_MEASUREMENT)
        assertThat(assessment.qualityLevel).isEqualTo(QualityLevel.HIGH)
        assertThat(assessment.retryRecommended).isFalse()
        assertThat(assessment.warnings).doesNotContain(HandMeasureWarning.LOW_RESULT_RELIABILITY)
    }
}
