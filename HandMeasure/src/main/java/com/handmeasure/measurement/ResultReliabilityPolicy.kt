package com.handmeasure.measurement

import com.handmeasure.api.CalibrationStatus
import com.handmeasure.api.HandMeasureWarning
import com.handmeasure.api.MeasurementSource
import com.handmeasure.api.QualityLevel
import com.handmeasure.api.ResultMode

data class ReliabilityAssessment(
    val resultMode: ResultMode,
    val qualityLevel: QualityLevel,
    val retryRecommended: Boolean,
    val measurementSources: List<MeasurementSource>,
    val warnings: List<HandMeasureWarning>,
)

class ResultReliabilityPolicy {
    fun assess(
        fused: FusedFingerMeasurement,
        stepMeasurements: List<StepMeasurement>,
        calibrationStatus: CalibrationStatus,
        existingWarnings: Set<HandMeasureWarning>,
    ): ReliabilityAssessment {
        val sourceSet = stepMeasurements.map { it.measurementSource.toApiSource() }.toSet().toMutableSet()
        if (stepMeasurements.size < 2) {
            sourceSet += MeasurementSource.FUSION_ESTIMATE
        }
        val fallbackCount = stepMeasurements.count { it.usedFallback }
        val directCount = stepMeasurements.count { it.measurementSource == WidthMeasurementSource.EDGE_PROFILE }

        val resultMode =
            when {
                directCount >= 3 && fallbackCount == 0 && calibrationStatus == CalibrationStatus.CALIBRATED -> ResultMode.DIRECT_MEASUREMENT
                fallbackCount >= stepMeasurements.size.coerceAtLeast(1) -> ResultMode.FALLBACK_ESTIMATE
                else -> ResultMode.HYBRID_ESTIMATE
            }

        val qualityLevel =
            when {
                fused.confidenceScore >= 0.82f &&
                    fallbackCount <= 1 &&
                    calibrationStatus == CalibrationStatus.CALIBRATED -> QualityLevel.HIGH
                fused.confidenceScore >= 0.62f -> QualityLevel.MEDIUM
                else -> QualityLevel.LOW
            }

        val warnings =
            buildSet {
                addAll(existingWarnings)
                if (calibrationStatus == CalibrationStatus.DEGRADED) {
                    add(HandMeasureWarning.CALIBRATION_WEAK)
                }
                if (qualityLevel == QualityLevel.LOW || resultMode == ResultMode.FALLBACK_ESTIMATE) {
                    add(HandMeasureWarning.LOW_RESULT_RELIABILITY)
                }
            }.toList()

        return ReliabilityAssessment(
            resultMode = resultMode,
            qualityLevel = qualityLevel,
            retryRecommended = qualityLevel != QualityLevel.HIGH,
            measurementSources = sourceSet.toList(),
            warnings = warnings,
        )
    }
}
