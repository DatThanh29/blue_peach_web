package com.handmeasure.coordinator

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.PointF
import com.handmeasure.api.CaptureStep
import com.handmeasure.api.CapturedStepInfo
import com.handmeasure.api.HandMeasureConfig
import com.handmeasure.api.HandMeasureResult
import com.handmeasure.api.HandMeasureWarning
import com.handmeasure.flow.CaptureUiState
import com.handmeasure.flow.HandMeasureStateMachine
import com.handmeasure.flow.StepCandidate
import com.handmeasure.measurement.FingerMeasurementEngine
import com.handmeasure.measurement.FingerMeasurementFusion
import com.handmeasure.measurement.FrameQualityInput
import com.handmeasure.measurement.FrameQualityScorer
import com.handmeasure.measurement.ScaleCalibrator
import com.handmeasure.measurement.StepMeasurement
import com.handmeasure.measurement.TableRingSizeMapper
import com.handmeasure.vision.CardDetection
import com.handmeasure.vision.HandDetection
import com.handmeasure.vision.HandLandmarkEngine
import com.handmeasure.vision.OpenCvReferenceCardDetector
import com.handmeasure.vision.PoseClassifier
import com.handmeasure.vision.ReferenceCardDetector
import kotlin.math.abs

data class LiveAnalysisState(
    val captureState: CaptureUiState,
    val qualityScore: Float,
    val poseScore: Float,
    val handScore: Float,
    val cardScore: Float,
    val blurScore: Float,
    val motionScore: Float,
    val lightingScore: Float,
    val handDetection: HandDetection?,
    val cardDetection: CardDetection?,
)

class HandMeasureCoordinator(
    private val config: HandMeasureConfig,
    private val handLandmarkEngine: HandLandmarkEngine,
    private val referenceCardDetector: ReferenceCardDetector = OpenCvReferenceCardDetector(),
    private val poseClassifier: PoseClassifier = PoseClassifier(),
    private val frameQualityScorer: FrameQualityScorer = FrameQualityScorer(),
    private val scaleCalibrator: ScaleCalibrator = ScaleCalibrator(),
    private val fingerMeasurementEngine: FingerMeasurementEngine = FingerMeasurementEngine(),
    private val fingerMeasurementFusion: FingerMeasurementFusion = FingerMeasurementFusion(),
) {
    private val stateMachine = HandMeasureStateMachine(config.qualityThresholds)
    private val ringSizeMapper = TableRingSizeMapper()
    private var lastLumaMean: Double? = null

    fun currentState(): CaptureUiState = stateMachine.snapshot()

    fun analyzeFrame(jpegBytes: ByteArray, bitmap: Bitmap): LiveAnalysisState {
        val captureState = stateMachine.currentStep()
        val hand = handLandmarkEngine.detect(bitmap)
        val card = referenceCardDetector.detect(bitmap)

        val handScore = hand?.confidence ?: 0f
        val cardScore = card?.confidence ?: 0f
        val poseScore = hand?.let { poseClassifier.classify(captureState.step, it) } ?: 0f
        val ringZoneScore = if (hand?.fingerJointPair(config.targetFinger) != null) 1f else 0f
        val blurScore = estimateBlur(bitmap)
        val lightingScore = estimateLighting(bitmap)
        val motionScore = estimateMotion(bitmap)
        val planeScore = estimatePlaneCloseness(hand, card, bitmap)
        val quality =
            frameQualityScorer.score(
                FrameQualityInput(
                    handScore = handScore,
                    landmarkScore = handScore,
                    ringZoneScore = ringZoneScore,
                    cardScore = cardScore,
                    blurScore = blurScore,
                    motionScore = motionScore,
                    lightingScore = lightingScore,
                    poseScore = poseScore,
                    planeScore = planeScore,
                ),
            )

        val updatedState =
            if (hand != null && card != null) {
                stateMachine.onFrameEvaluated(
                    StepCandidate(
                        step = captureState.step,
                        frameBytes = jpegBytes,
                        qualityScore = quality.totalScore,
                        poseScore = poseScore,
                        cardScore = cardScore,
                        handScore = handScore,
                    ),
                )
            } else {
                stateMachine.snapshot()
            }

        return LiveAnalysisState(
            captureState = updatedState,
            qualityScore = quality.totalScore,
            poseScore = poseScore,
            handScore = handScore,
            cardScore = cardScore,
            blurScore = blurScore,
            motionScore = motionScore,
            lightingScore = lightingScore,
            handDetection = hand,
            cardDetection = card,
        )
    }

    fun advanceWithBestCandidate(): CaptureUiState = stateMachine.advanceWithBestCandidate()

    fun retryCurrentStep(): CaptureUiState = stateMachine.retryCurrentStep()

    fun isCaptureComplete(): Boolean = stateMachine.isComplete()

    fun finalizeResult(): HandMeasureResult {
        val snapshot = stateMachine.snapshot()
        val stepResults = snapshot.completedSteps.sortedBy { it.step.ordinal }
        val warnings = mutableSetOf<HandMeasureWarning>()
        val stepMeasurements = mutableListOf<StepMeasurement>()
        val debugNotes = mutableListOf<String>()
        var bestScaleMmPerPxX = 0.12
        var bestScaleMmPerPxY = 0.12
        var frontalWidthPx = 0.0
        val thicknessSamples = mutableListOf<Double>()

        stepResults.forEach { candidate ->
            val bitmap = BitmapFactory.decodeByteArray(candidate.frameBytes, 0, candidate.frameBytes.size) ?: return@forEach
            val hand = handLandmarkEngine.detect(bitmap)
            val card = referenceCardDetector.detect(bitmap)
            if (candidate.cardScore < config.qualityThresholds.cardMinScore) warnings += HandMeasureWarning.LOW_CARD_CONFIDENCE
            if (candidate.poseScore < 0.45f) warnings += HandMeasureWarning.LOW_POSE_CONFIDENCE

            val scale =
                if (card != null) {
                    scaleCalibrator.calibrate(card.rectangle)
                } else {
                    warnings += HandMeasureWarning.BEST_EFFORT_ESTIMATE
                    null
                }
            if (scale != null) {
                bestScaleMmPerPxX = scale.mmPerPxX
                bestScaleMmPerPxY = scale.mmPerPxY
            }

            val effectiveScale =
                scale ?: com.handmeasure.measurement.MetricScale(bestScaleMmPerPxX, bestScaleMmPerPxY)
            val measurement =
                if (hand != null) {
                    fingerMeasurementEngine.measureVisibleWidth(bitmap, hand, config.targetFinger, effectiveScale)
                } else {
                    warnings += HandMeasureWarning.BEST_EFFORT_ESTIMATE
                    null
                }

            val widthMm = measurement?.widthMm ?: 18.0
            if (measurement?.usedFallback == true) warnings += HandMeasureWarning.BEST_EFFORT_ESTIMATE
            if (candidate.step == CaptureStep.FRONT_PALM) {
                frontalWidthPx = measurement?.widthPx ?: frontalWidthPx
            } else {
                thicknessSamples += widthMm
            }
            stepMeasurements += StepMeasurement(candidate.step, widthMm, candidate.qualityScore)
            bitmap.recycle()
        }

        if (stepMeasurements.isEmpty()) {
            warnings += HandMeasureWarning.BEST_EFFORT_ESTIMATE
            stepMeasurements += StepMeasurement(CaptureStep.FRONT_PALM, 18.0, 0.2f)
        }

        val fused = fingerMeasurementFusion.fuse(stepMeasurements)
        warnings += fused.warnings
        if (snapshot.completedSteps.any { it.blurScoreLike() < config.qualityThresholds.blurMinScore }) {
            warnings += HandMeasureWarning.HIGH_BLUR
        }
        if (snapshot.completedSteps.any { it.motionScoreLike() < config.qualityThresholds.motionMinScore }) {
            warnings += HandMeasureWarning.HIGH_MOTION
        }

        val ringSize = ringSizeMapper.nearestForDiameter(config.ringSizeTable, fused.equivalentDiameterMm)
        val captured =
            snapshot.completedSteps.map {
                CapturedStepInfo(
                    step = it.step,
                    score = it.qualityScore,
                    poseScore = it.poseScore,
                    cardScore = it.cardScore,
                    handScore = it.handScore,
                )
            }

        return HandMeasureResult(
            targetFinger = config.targetFinger,
            fingerWidthMm = fused.widthMm,
            fingerThicknessMm = fused.thicknessMm,
            estimatedCircumferenceMm = fused.circumferenceMm,
            equivalentDiameterMm = fused.equivalentDiameterMm,
            suggestedRingSizeLabel = ringSize.label,
            confidenceScore = fused.confidenceScore.coerceIn(0f, 1f),
            warnings = warnings.toList(),
            capturedSteps = captured,
            debugMetadata =
                com.handmeasure.api.DebugMetadata(
                    mmPerPxX = bestScaleMmPerPxX,
                    mmPerPxY = bestScaleMmPerPxY,
                    frontalWidthPx = frontalWidthPx,
                    thicknessSamplesMm = thicknessSamples,
                    rawNotes = debugNotes + fused.debugNotes,
                ),
        )
    }

    private fun estimateBlur(bitmap: Bitmap): Float {
        var sum = 0.0
        var sumSq = 0.0
        val step = maxOf(1, bitmap.width / 48)
        for (y in 0 until bitmap.height step step) {
            for (x in 0 until bitmap.width step step) {
                val pixel = bitmap.getPixel(x, y)
                val luma = ((pixel shr 16) and 0xff) * 0.299 + ((pixel shr 8) and 0xff) * 0.587 + (pixel and 0xff) * 0.114
                sum += luma
                sumSq += luma * luma
            }
        }
        val n = ((bitmap.height / step) * (bitmap.width / step)).coerceAtLeast(1)
        val variance = (sumSq / n) - ((sum / n) * (sum / n))
        return (variance / 1200.0).toFloat().coerceIn(0f, 1f)
    }

    private fun estimateLighting(bitmap: Bitmap): Float {
        var sum = 0.0
        val step = maxOf(1, bitmap.width / 64)
        var count = 0
        for (y in 0 until bitmap.height step step) {
            for (x in 0 until bitmap.width step step) {
                val pixel = bitmap.getPixel(x, y)
                sum += ((pixel shr 16) and 0xff) * 0.299 + ((pixel shr 8) and 0xff) * 0.587 + (pixel and 0xff) * 0.114
                count++
            }
        }
        val mean = sum / count.coerceAtLeast(1)
        val centeredScore = 1.0 - abs(mean - 150.0) / 150.0
        return centeredScore.toFloat().coerceIn(0f, 1f)
    }

    private fun estimateMotion(bitmap: Bitmap): Float {
        var sum = 0.0
        val step = maxOf(1, bitmap.width / 64)
        var count = 0
        for (y in 0 until bitmap.height step step) {
            for (x in 0 until bitmap.width step step) {
                val pixel = bitmap.getPixel(x, y)
                val luma = ((pixel shr 16) and 0xff) * 0.299 + ((pixel shr 8) and 0xff) * 0.587 + (pixel and 0xff) * 0.114
                sum += luma
                count++
            }
        }
        val mean = sum / count.coerceAtLeast(1)
        val previous = lastLumaMean
        lastLumaMean = mean
        if (previous == null) return 1f
        return (1.0 - abs(mean - previous) / 45.0).toFloat().coerceIn(0f, 1f)
    }

    private fun estimatePlaneCloseness(hand: HandDetection?, card: CardDetection?, bitmap: Bitmap): Float {
        if (hand == null || card == null) return 0f
        val jointPair = hand.fingerJointPair(config.targetFinger) ?: return 0f
        val ringCenter = PointF((jointPair.first.x + jointPair.second.x) / 2f, (jointPair.first.y + jointPair.second.y) / 2f)
        val dx = (ringCenter.x - card.rectangle.centerX.toFloat()) / bitmap.width.toFloat()
        val dy = (ringCenter.y - card.rectangle.centerY.toFloat()) / bitmap.height.toFloat()
        val distance = kotlin.math.sqrt(dx * dx + dy * dy)
        return (1.0 - distance / 0.65).toFloat().coerceIn(0f, 1f)
    }

    private fun StepCandidate.blurScoreLike(): Float = qualityScore

    private fun StepCandidate.motionScoreLike(): Float = qualityScore
}
