package com.handmeasure.core.measurement

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ResultReliabilityPolicyTest {
    private val policy = ResultReliabilityPolicy()

    @Test
    fun assess_marksFallbackAndLowQualityWhenConfidenceWeak() {
        val fused =
            FusedFingerMeasurement(
                widthMm = 18.0,
                thicknessMm = 14.0,
                circumferenceMm = 50.0,
                equivalentDiameterMm = 16.0,
                confidenceScore = 0.42f,
                warnings = listOf(HandMeasureWarning.BEST_EFFORT_ESTIMATE),
                debugNotes = emptyList(),
            )
        val steps =
            listOf(
                StepMeasurement(CaptureStep.FRONT_PALM, widthMm = 18.0, confidence = 0.5f, measurementSource = WidthMeasurementSource.DEFAULT_HEURISTIC),
                StepMeasurement(CaptureStep.LEFT_OBLIQUE, widthMm = 16.0, confidence = 0.5f, measurementSource = WidthMeasurementSource.LANDMARK_HEURISTIC),
            )
        val assessment =
            policy.assess(
                fused = fused,
                stepMeasurements = steps,
                calibrationStatus = CalibrationStatus.MISSING_REFERENCE,
                existingWarnings = fused.warnings.toSet(),
            )

        assertThat(assessment.resultMode).isEqualTo(ResultMode.FALLBACK_ESTIMATE)
        assertThat(assessment.qualityLevel).isEqualTo(QualityLevel.LOW)
        assertThat(assessment.retryRecommended).isTrue()
        assertThat(assessment.warnings).contains(HandMeasureWarning.LOW_RESULT_RELIABILITY)
        assertThat(assessment.measurementSources).contains(MeasurementSource.DEFAULT_HEURISTIC)
    }

    @Test
    fun assess_marksDirectMeasurementWhenStrongAndCalibrated() {
        val fused =
            FusedFingerMeasurement(
                widthMm = 18.2,
                thicknessMm = 14.7,
                circumferenceMm = 52.8,
                equivalentDiameterMm = 16.8,
                confidenceScore = 0.9f,
                warnings = emptyList(),
                debugNotes = emptyList(),
            )
        val steps =
            listOf(
                StepMeasurement(CaptureStep.FRONT_PALM, widthMm = 18.0, confidence = 0.9f, measurementSource = WidthMeasurementSource.EDGE_PROFILE, usedFallback = false),
                StepMeasurement(CaptureStep.LEFT_OBLIQUE, widthMm = 15.2, confidence = 0.86f, measurementSource = WidthMeasurementSource.EDGE_PROFILE, usedFallback = false),
                StepMeasurement(CaptureStep.RIGHT_OBLIQUE, widthMm = 15.0, confidence = 0.84f, measurementSource = WidthMeasurementSource.EDGE_PROFILE, usedFallback = false),
            )
        val assessment =
            policy.assess(
                fused = fused,
                stepMeasurements = steps,
                calibrationStatus = CalibrationStatus.CALIBRATED,
                existingWarnings = emptySet(),
            )

        assertThat(assessment.resultMode).isEqualTo(ResultMode.DIRECT_MEASUREMENT)
        assertThat(assessment.qualityLevel).isEqualTo(QualityLevel.HIGH)
        assertThat(assessment.retryRecommended).isFalse()
        assertThat(assessment.warnings).doesNotContain(HandMeasureWarning.LOW_RESULT_RELIABILITY)
        assertThat(assessment.measurementSources).containsExactly(MeasurementSource.EDGE_PROFILE)
    }
}
