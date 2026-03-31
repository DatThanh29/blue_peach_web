package com.handmeasure.coordinator

import com.handmeasure.api.CaptureStep
import com.handmeasure.measurement.ScaleCalibrator
import com.handmeasure.vision.HandLandmarkEngine
import com.handmeasure.vision.PoseClassifier
import com.handmeasure.vision.ReferenceCardDetector

internal object AndroidSessionRuntimeAnalyzerFactory {
    fun create(
        handLandmarkEngine: HandLandmarkEngine,
        referenceCardDetector: ReferenceCardDetector,
        poseClassifier: PoseClassifier,
        scaleCalibrator: ScaleCalibrator,
        fingerMeasurementPort: AndroidFingerMeasurementPort,
        frameSignalEstimator: FrameSignalEstimator,
        frameAnnotator: DebugFrameAnnotator,
        poseTargets: Map<CaptureStep, PoseTarget>,
    ): AndroidSessionRuntimeAnalyzerPort =
        AndroidSessionRuntimeAnalyzerPort(
            handRuntimeAdapter = AndroidHandRuntimeAdapter(handLandmarkEngine),
            cardRuntimeAdapter = AndroidCardRuntimeAdapter(referenceCardDetector),
            poseRuntimeAdapter = AndroidPoseRuntimeAdapter(poseClassifier, poseTargets),
            coplanarityRuntimeAdapter = AndroidCoplanarityRuntimeAdapter(frameSignalEstimator),
            scaleRuntimeAdapter = AndroidScaleRuntimeAdapter(scaleCalibrator),
            fingerRuntimeAdapter = AndroidFingerRuntimeAdapter(fingerMeasurementPort),
            overlayRuntimeAdapter = AndroidOverlayRuntimeAdapter(frameAnnotator),
        )
}
