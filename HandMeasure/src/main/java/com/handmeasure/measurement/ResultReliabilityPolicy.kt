package com.handmeasure.measurement

import com.handmeasure.api.CalibrationStatus
import com.handmeasure.api.HandMeasureWarning
import com.handmeasure.api.MeasurementSource
import com.handmeasure.api.QualityLevel
import com.handmeasure.api.ResultMode
import com.handmeasure.core.measurement.CalibrationStatus as CoreCalibrationStatus
import com.handmeasure.core.measurement.HandMeasureWarning as CoreHandMeasureWarning
import com.handmeasure.core.measurement.MeasurementSource as CoreMeasurementSource
import com.handmeasure.core.measurement.ReliabilityAssessment as CoreReliabilityAssessment
import com.handmeasure.core.measurement.ResultMode as CoreResultMode
import com.handmeasure.core.measurement.QualityLevel as CoreQualityLevel
import com.handmeasure.core.measurement.ResultReliabilityPolicy as CoreResultReliabilityPolicy

data class ReliabilityAssessment(
    val resultMode: ResultMode,
    val qualityLevel: QualityLevel,
    val retryRecommended: Boolean,
    val measurementSources: List<MeasurementSource>,
    val warnings: List<HandMeasureWarning>,
)

class ResultReliabilityPolicy(
    private val delegate: CoreResultReliabilityPolicy = CoreResultReliabilityPolicy(),
) {
    fun assess(
        fused: FusedFingerMeasurement,
        stepMeasurements: List<StepMeasurement>,
        calibrationStatus: CalibrationStatus,
        existingWarnings: Set<HandMeasureWarning>,
    ): ReliabilityAssessment =
        delegate
            .assess(
                fused = fused.toCore(),
                stepMeasurements = stepMeasurements.map { it.toCore() },
                calibrationStatus = calibrationStatus.toCore(),
                existingWarnings = existingWarnings.map { it.toCore() }.toSet(),
            ).toAndroid()
}

private fun CoreReliabilityAssessment.toAndroid(): ReliabilityAssessment =
    ReliabilityAssessment(
        resultMode = resultMode.toAndroid(),
        qualityLevel = qualityLevel.toAndroid(),
        retryRecommended = retryRecommended,
        measurementSources = measurementSources.map { it.toAndroid() },
        warnings = warnings.map { it.toAndroid() },
    )

private fun com.handmeasure.core.measurement.FusedFingerMeasurement.toAndroid(): FusedFingerMeasurement =
    FusedFingerMeasurement(
        widthMm = widthMm,
        thicknessMm = thicknessMm,
        circumferenceMm = circumferenceMm,
        equivalentDiameterMm = equivalentDiameterMm,
        confidenceScore = confidenceScore,
        warnings = warnings.map { it.toAndroid() },
        debugNotes = debugNotes,
        perStepResidualsMm = perStepResidualsMm,
        detectionConfidence = detectionConfidence,
        poseConfidence = poseConfidence,
        measurementConfidence = measurementConfidence,
    )

private fun FusedFingerMeasurement.toCore(): com.handmeasure.core.measurement.FusedFingerMeasurement =
    com.handmeasure.core.measurement.FusedFingerMeasurement(
        widthMm = widthMm,
        thicknessMm = thicknessMm,
        circumferenceMm = circumferenceMm,
        equivalentDiameterMm = equivalentDiameterMm,
        confidenceScore = confidenceScore,
        warnings = warnings.map { it.toCore() },
        debugNotes = debugNotes,
        perStepResidualsMm = perStepResidualsMm,
        detectionConfidence = detectionConfidence,
        poseConfidence = poseConfidence,
        measurementConfidence = measurementConfidence,
    )

private fun StepMeasurement.toCore(): com.handmeasure.core.measurement.StepMeasurement =
    com.handmeasure.core.measurement.StepMeasurement(
        step = step.toCore(),
        widthMm = widthMm,
        confidence = confidence,
        measurementConfidence = measurementConfidence,
        rawWidthMm = rawWidthMm,
        measurementSource = measurementSource.toCore(),
        usedFallback = usedFallback,
        debugNotes = debugNotes,
    )

private fun com.handmeasure.api.CaptureStep.toCore(): com.handmeasure.core.measurement.CaptureStep =
    when (this) {
        com.handmeasure.api.CaptureStep.FRONT_PALM -> com.handmeasure.core.measurement.CaptureStep.FRONT_PALM
        com.handmeasure.api.CaptureStep.LEFT_OBLIQUE -> com.handmeasure.core.measurement.CaptureStep.LEFT_OBLIQUE
        com.handmeasure.api.CaptureStep.RIGHT_OBLIQUE -> com.handmeasure.core.measurement.CaptureStep.RIGHT_OBLIQUE
        com.handmeasure.api.CaptureStep.UP_TILT -> com.handmeasure.core.measurement.CaptureStep.UP_TILT
        com.handmeasure.api.CaptureStep.DOWN_TILT -> com.handmeasure.core.measurement.CaptureStep.DOWN_TILT
        com.handmeasure.api.CaptureStep.BACK_OF_HAND -> com.handmeasure.core.measurement.CaptureStep.BACK_OF_HAND
        com.handmeasure.api.CaptureStep.LEFT_OBLIQUE_DORSAL -> com.handmeasure.core.measurement.CaptureStep.LEFT_OBLIQUE_DORSAL
        com.handmeasure.api.CaptureStep.RIGHT_OBLIQUE_DORSAL -> com.handmeasure.core.measurement.CaptureStep.RIGHT_OBLIQUE_DORSAL
        com.handmeasure.api.CaptureStep.UP_TILT_DORSAL -> com.handmeasure.core.measurement.CaptureStep.UP_TILT_DORSAL
        com.handmeasure.api.CaptureStep.DOWN_TILT_DORSAL -> com.handmeasure.core.measurement.CaptureStep.DOWN_TILT_DORSAL
    }

private fun WidthMeasurementSource.toCore(): com.handmeasure.core.measurement.WidthMeasurementSource =
    when (this) {
        WidthMeasurementSource.EDGE_PROFILE -> com.handmeasure.core.measurement.WidthMeasurementSource.EDGE_PROFILE
        WidthMeasurementSource.LANDMARK_HEURISTIC -> com.handmeasure.core.measurement.WidthMeasurementSource.LANDMARK_HEURISTIC
        WidthMeasurementSource.DEFAULT_HEURISTIC -> com.handmeasure.core.measurement.WidthMeasurementSource.DEFAULT_HEURISTIC
    }

private fun CalibrationStatus.toCore(): CoreCalibrationStatus =
    when (this) {
        CalibrationStatus.CALIBRATED -> CoreCalibrationStatus.CALIBRATED
        CalibrationStatus.DEGRADED -> CoreCalibrationStatus.DEGRADED
        CalibrationStatus.MISSING_REFERENCE -> CoreCalibrationStatus.MISSING_REFERENCE
    }

private fun HandMeasureWarning.toCore(): CoreHandMeasureWarning =
    when (this) {
        HandMeasureWarning.BEST_EFFORT_ESTIMATE -> CoreHandMeasureWarning.BEST_EFFORT_ESTIMATE
        HandMeasureWarning.LOW_CARD_CONFIDENCE -> CoreHandMeasureWarning.LOW_CARD_CONFIDENCE
        HandMeasureWarning.LOW_POSE_CONFIDENCE -> CoreHandMeasureWarning.LOW_POSE_CONFIDENCE
        HandMeasureWarning.LOW_LIGHTING -> CoreHandMeasureWarning.LOW_LIGHTING
        HandMeasureWarning.HIGH_MOTION -> CoreHandMeasureWarning.HIGH_MOTION
        HandMeasureWarning.HIGH_BLUR -> CoreHandMeasureWarning.HIGH_BLUR
        HandMeasureWarning.THICKNESS_ESTIMATED_FROM_WEAK_ANGLES -> CoreHandMeasureWarning.THICKNESS_ESTIMATED_FROM_WEAK_ANGLES
        HandMeasureWarning.CALIBRATION_WEAK -> CoreHandMeasureWarning.CALIBRATION_WEAK
        HandMeasureWarning.LOW_RESULT_RELIABILITY -> CoreHandMeasureWarning.LOW_RESULT_RELIABILITY
    }

private fun CoreHandMeasureWarning.toAndroid(): HandMeasureWarning =
    when (this) {
        CoreHandMeasureWarning.BEST_EFFORT_ESTIMATE -> HandMeasureWarning.BEST_EFFORT_ESTIMATE
        CoreHandMeasureWarning.LOW_CARD_CONFIDENCE -> HandMeasureWarning.LOW_CARD_CONFIDENCE
        CoreHandMeasureWarning.LOW_POSE_CONFIDENCE -> HandMeasureWarning.LOW_POSE_CONFIDENCE
        CoreHandMeasureWarning.LOW_LIGHTING -> HandMeasureWarning.LOW_LIGHTING
        CoreHandMeasureWarning.HIGH_MOTION -> HandMeasureWarning.HIGH_MOTION
        CoreHandMeasureWarning.HIGH_BLUR -> HandMeasureWarning.HIGH_BLUR
        CoreHandMeasureWarning.THICKNESS_ESTIMATED_FROM_WEAK_ANGLES -> HandMeasureWarning.THICKNESS_ESTIMATED_FROM_WEAK_ANGLES
        CoreHandMeasureWarning.CALIBRATION_WEAK -> HandMeasureWarning.CALIBRATION_WEAK
        CoreHandMeasureWarning.LOW_RESULT_RELIABILITY -> HandMeasureWarning.LOW_RESULT_RELIABILITY
    }

private fun CoreMeasurementSource.toAndroid(): MeasurementSource =
    when (this) {
        CoreMeasurementSource.EDGE_PROFILE -> MeasurementSource.EDGE_PROFILE
        CoreMeasurementSource.LANDMARK_HEURISTIC -> MeasurementSource.LANDMARK_HEURISTIC
        CoreMeasurementSource.DEFAULT_HEURISTIC -> MeasurementSource.DEFAULT_HEURISTIC
        CoreMeasurementSource.FUSION_ESTIMATE -> MeasurementSource.FUSION_ESTIMATE
    }

private fun CoreResultMode.toAndroid(): ResultMode =
    when (this) {
        CoreResultMode.DIRECT_MEASUREMENT -> ResultMode.DIRECT_MEASUREMENT
        CoreResultMode.HYBRID_ESTIMATE -> ResultMode.HYBRID_ESTIMATE
        CoreResultMode.FALLBACK_ESTIMATE -> ResultMode.FALLBACK_ESTIMATE
    }

private fun CoreQualityLevel.toAndroid(): QualityLevel =
    when (this) {
        CoreQualityLevel.HIGH -> QualityLevel.HIGH
        CoreQualityLevel.MEDIUM -> QualityLevel.MEDIUM
        CoreQualityLevel.LOW -> QualityLevel.LOW
    }
