package com.handmeasure.flow

import com.handmeasure.api.CaptureStep
import com.handmeasure.api.QualityThresholds
import com.handmeasure.flow.ProtocolGuides.steps
import com.handmeasure.api.CaptureProtocol

data class StepCandidate(
    val step: CaptureStep,
    val frameBytes: ByteArray,
    val qualityScore: Float,
    val poseScore: Float,
    val cardScore: Float,
    val handScore: Float,
    val blurScore: Float = 0f,
    val motionScore: Float = 0f,
    val lightingScore: Float = 0f,
    val confidencePenaltyReasons: List<String> = emptyList(),
)

data class CaptureUiState(
    val currentStep: MeasureStepDefinition,
    val completedSteps: List<StepCandidate>,
    val bestCurrentCandidate: StepCandidate?,
    val progressFraction: Float,
    val canAdvanceWithBest: Boolean,
    val isFlowComplete: Boolean,
    val totalSteps: Int,
)

class HandMeasureStateMachine(
    private val thresholds: QualityThresholds,
    private val stepDefinitions: List<MeasureStepDefinition> = ProtocolGuides.steps(CaptureProtocol.DORSAL_V1),
) {
    private var currentStepIndex = 0
    private var bestCandidate: StepCandidate? = null
    private var evaluatedFrameCountForStep = 0
    private var retryCountForStep = 0
    private val completed = mutableListOf<StepCandidate>()

    fun onFrameEvaluated(candidate: StepCandidate): CaptureUiState {
        if (candidate.step != currentStep().step || isComplete()) {
            return snapshot()
        }
        evaluatedFrameCountForStep += 1
        if (bestCandidate == null || candidate.qualityScore > bestCandidate!!.qualityScore) {
            bestCandidate = candidate
        }
        if (candidate.qualityScore >= thresholds.autoCaptureScore) {
            acceptBestCandidate()
        }
        return snapshot()
    }

    fun advanceWithBestCandidate(): CaptureUiState {
        acceptBestCandidate()
        return snapshot()
    }

    fun retryCurrentStep(): CaptureUiState {
        bestCandidate = null
        retryCountForStep += 1
        return snapshot()
    }

    fun currentStep(): MeasureStepDefinition = stepDefinitions[currentStepIndex.coerceAtMost(stepDefinitions.lastIndex)]

    fun isComplete(): Boolean = completed.size == stepDefinitions.size

    private fun acceptBestCandidate() {
        val candidate = bestCandidate ?: return
        completed.removeAll { it.step == candidate.step }
        completed.add(candidate)
        bestCandidate = null
        evaluatedFrameCountForStep = 0
        retryCountForStep = 0
        if (currentStepIndex < stepDefinitions.lastIndex) {
            currentStepIndex += 1
        } else {
            currentStepIndex = stepDefinitions.lastIndex
        }
    }

    fun snapshot(): CaptureUiState =
        CaptureUiState(
            currentStep = currentStep(),
            completedSteps = completed.toList(),
            bestCurrentCandidate = bestCandidate,
            progressFraction = completed.size.toFloat() / stepDefinitions.size.toFloat(),
            canAdvanceWithBest = canAdvanceWithBest(bestCandidate),
            isFlowComplete = isComplete(),
            totalSteps = stepDefinitions.size,
        )

    private fun canAdvanceWithBest(candidate: StepCandidate?): Boolean {
        val score = candidate?.qualityScore ?: return false
        if (score >= thresholds.bestCandidateProgressScore) return true
        val relaxedGateSatisfied = evaluatedFrameCountForStep >= RELAXED_PROGRESS_FRAME_GATE || retryCountForStep > 0
        return relaxedGateSatisfied && score >= RELAXED_PROGRESS_MIN_SCORE
    }

    private companion object {
        const val RELAXED_PROGRESS_FRAME_GATE = 40
        const val RELAXED_PROGRESS_MIN_SCORE = 0.46f
    }
}
