package com.handmeasure.core.measurement

import kotlin.math.abs

class FingerMeasurementFusion {
    private val policy = ThicknessEstimationPolicy()

    fun fuse(measurements: List<StepMeasurement>): FusedFingerMeasurement {
        if (measurements.isEmpty()) return fallbackMeasurement()

        val frontal =
            measurements.firstOrNull { it.step.role() == CaptureStepRole.FRONTAL }
                ?: measurements.maxByOrNull { it.confidence }!!

        val sideSteps =
            measurements
                .filter { it.step.role() != CaptureStepRole.FRONTAL }
                .associateBy { it.step }

        val sideCandidates =
            sideSteps.values.map { step ->
                val correction = policy.thicknessCorrection(step.step)
                WeightedThickness(
                    source = step.step,
                    thicknessMm = step.widthMm * correction,
                    weight = (step.confidence * 0.6f + step.measurementConfidence * 0.4f).coerceAtLeast(0.05f),
                    measurementSource = step.measurementSource,
                )
            }

        val robustCandidates = rejectOutlierThickness(sideCandidates)
        val thicknessMm =
            if (robustCandidates.isEmpty()) {
                frontal.widthMm * policy.frontalFallbackThicknessRatio
            } else {
                weightedMedian(robustCandidates)
            }

        val symmetryPenalties = buildSymmetryPenalties(sideSteps)
        val residuals = robustCandidates.map { it.thicknessMm - thicknessMm }
        val circumferenceMm = EllipseMath.circumferenceFromWidthThickness(frontal.widthMm, thicknessMm)
        val diameterMm = EllipseMath.equivalentDiameterFromCircumference(circumferenceMm)

        val detectionConfidence = measurements.map { it.confidence }.average().toFloat().coerceIn(0f, 1f)
        val poseConfidence = measurements.map { (it.confidence * 0.7f + it.measurementConfidence * 0.3f) }.average().toFloat().coerceIn(0f, 1f)
        val measurementConfidence =
            (
                robustCandidates.map { it.weight.toDouble() }.average().toFloat().coerceAtLeast(0f) *
                    (1f - symmetryPenalties.totalPenalty).coerceIn(0.4f, 1f)
            ).coerceIn(0f, 1f)
        val finalConfidence =
            (
                detectionConfidence * 0.30f +
                    poseConfidence * 0.25f +
                    measurementConfidence * 0.45f
            ).coerceIn(0f, 1f)

        val warnings =
            buildList {
                if (finalConfidence < 0.65f) add(HandMeasureWarning.BEST_EFFORT_ESTIMATE)
                if (sideCandidates.size < policy.minThicknessCandidatesForStableEstimate) add(HandMeasureWarning.THICKNESS_ESTIMATED_FROM_WEAK_ANGLES)
                if (symmetryPenalties.leftRightPenalty > 0.10f || symmetryPenalties.upDownPenalty > 0.10f) {
                    add(HandMeasureWarning.THICKNESS_ESTIMATED_FROM_WEAK_ANGLES)
                }
            }.distinct()

        val debugNotes =
            buildList {
                add("thicknessCandidates=${sideCandidates.joinToString { "${it.source}:${"%.2f".format(it.thicknessMm)}@${"%.2f".format(it.weight)}" }}")
                add("thicknessSourceKinds=${sideCandidates.joinToString { "${it.source}:${it.measurementSource}" }}")
                add("leftRightPenalty=${"%.3f".format(symmetryPenalties.leftRightPenalty)}")
                add("upDownPenalty=${"%.3f".format(symmetryPenalties.upDownPenalty)}")
                addAll(symmetryPenalties.notes)
            }

        return FusedFingerMeasurement(
            widthMm = frontal.widthMm,
            thicknessMm = thicknessMm,
            circumferenceMm = circumferenceMm,
            equivalentDiameterMm = diameterMm,
            confidenceScore = finalConfidence,
            warnings = warnings,
            debugNotes = debugNotes,
            perStepResidualsMm = residuals,
            detectionConfidence = detectionConfidence,
            poseConfidence = poseConfidence,
            measurementConfidence = measurementConfidence,
        )
    }

    private fun fallbackMeasurement(): FusedFingerMeasurement =
        FusedFingerMeasurement(
            widthMm = 18.0,
            thicknessMm = 14.0,
            circumferenceMm = EllipseMath.circumferenceFromWidthThickness(18.0, 14.0),
            equivalentDiameterMm = EllipseMath.equivalentDiameterFromCircumference(
                EllipseMath.circumferenceFromWidthThickness(18.0, 14.0),
            ),
            confidenceScore = 0.2f,
            warnings = listOf(HandMeasureWarning.BEST_EFFORT_ESTIMATE),
            debugNotes = listOf("fallback=no_steps"),
        )

    private fun rejectOutlierThickness(candidates: List<WeightedThickness>): List<WeightedThickness> {
        if (candidates.size <= 2) return candidates
        val med = weightedMedian(candidates)
        val allowed = maxOf(0.55, med * 0.2)
        return candidates.filter { abs(it.thicknessMm - med) <= allowed }
    }

    private fun weightedMedian(candidates: List<WeightedThickness>): Double {
        if (candidates.isEmpty()) return 0.0
        val sorted = candidates.sortedBy { it.thicknessMm }
        val totalWeight = sorted.sumOf { it.weight.toDouble() }.coerceAtLeast(1e-6)
        var cumulative = 0.0
        for (entry in sorted) {
            cumulative += entry.weight
            if (cumulative >= totalWeight / 2.0) return entry.thicknessMm
        }
        return sorted.last().thicknessMm
    }

    private fun buildSymmetryPenalties(sideSteps: Map<CaptureStep, StepMeasurement>): SymmetryPenalties {
        val left = sideSteps.keys.firstOrNull { it.role() == CaptureStepRole.LEFT_OBLIQUE }?.let { sideSteps[it]?.widthMm }
        val right = sideSteps.keys.firstOrNull { it.role() == CaptureStepRole.RIGHT_OBLIQUE }?.let { sideSteps[it]?.widthMm }
        val up = sideSteps.keys.firstOrNull { it.role() == CaptureStepRole.TILT_UP }?.let { sideSteps[it]?.widthMm }
        val down = sideSteps.keys.firstOrNull { it.role() == CaptureStepRole.TILT_DOWN }?.let { sideSteps[it]?.widthMm }
        val leftRightPenalty = pairPenalty(left, right)
        val upDownPenalty = pairPenalty(up, down)
        return SymmetryPenalties(
            leftRightPenalty = leftRightPenalty,
            upDownPenalty = upDownPenalty,
            totalPenalty = (leftRightPenalty + upDownPenalty).coerceIn(0f, 0.35f),
            notes =
                listOfNotNull(
                    if (left != null && right != null) "leftRightResidual=${"%.3f".format(abs(left - right))}" else null,
                    if (up != null && down != null) "upDownResidual=${"%.3f".format(abs(up - down))}" else null,
                ),
        )
    }

    private fun pairPenalty(
        a: Double?,
        b: Double?,
    ): Float {
        if (a == null || b == null) return 0.06f
        val denom = maxOf((a + b) / 2.0, 1.0)
        return (abs(a - b) / denom).toFloat().coerceIn(0f, 0.18f)
    }

    private data class WeightedThickness(
        val source: CaptureStep,
        val thicknessMm: Double,
        val weight: Float,
        val measurementSource: WidthMeasurementSource,
    )

    private data class SymmetryPenalties(
        val leftRightPenalty: Float,
        val upDownPenalty: Float,
        val totalPenalty: Float,
        val notes: List<String>,
    )
}

data class ThicknessEstimationPolicy(
    val obliqueCorrection: Double = 0.90,
    val tiltCorrection: Double = 0.93,
    val frontalFallbackThicknessRatio: Double = 0.80,
    val minThicknessCandidatesForStableEstimate: Int = 2,
) {
    fun thicknessCorrection(step: CaptureStep): Double =
        when (step.role()) {
            CaptureStepRole.LEFT_OBLIQUE, CaptureStepRole.RIGHT_OBLIQUE -> obliqueCorrection
            CaptureStepRole.TILT_UP, CaptureStepRole.TILT_DOWN -> tiltCorrection
            CaptureStepRole.FRONTAL -> 1.0
        }
}
