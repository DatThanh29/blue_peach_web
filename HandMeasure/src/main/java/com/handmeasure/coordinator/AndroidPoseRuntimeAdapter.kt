package com.handmeasure.coordinator

import com.handmeasure.api.CaptureStep
import com.handmeasure.vision.HandDetection
import com.handmeasure.vision.PoseClassifier
import com.handmeasure.core.measurement.CaptureStep as CoreCaptureStep

internal class AndroidPoseRuntimeAdapter(
    private val poseClassifier: PoseClassifier,
    private val poseTargets: Map<CaptureStep, PoseTarget>,
) : PoseRuntimeAdapter {
    override fun classify(
        step: CoreCaptureStep,
        hand: HandDetection,
    ): Float? {
        val target = poseTargets[step.toApiStep()] ?: return null
        return poseClassifier.classify(target, hand)
    }
}
