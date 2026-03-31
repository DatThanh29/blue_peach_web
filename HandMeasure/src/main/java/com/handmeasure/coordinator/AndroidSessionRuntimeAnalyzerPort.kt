package com.handmeasure.coordinator

import android.graphics.Bitmap
import com.handmeasure.api.TargetFinger
import com.handmeasure.vision.CardDetection
import com.handmeasure.vision.HandDetection
import com.handmeasure.core.measurement.CaptureStep as CoreCaptureStep
import com.handmeasure.core.session.SessionCardDiagnostics
import com.handmeasure.core.session.SessionFingerMeasurement
import com.handmeasure.core.session.SessionScale
import com.handmeasure.core.session.SessionScaleResult

internal class AndroidSessionRuntimeAnalyzerPort(
    private val handRuntimeAdapter: HandRuntimeAdapter,
    private val cardRuntimeAdapter: CardRuntimeAdapter,
    private val poseRuntimeAdapter: PoseRuntimeAdapter,
    private val coplanarityRuntimeAdapter: CoplanarityRuntimeAdapter,
    private val scaleRuntimeAdapter: ScaleRuntimeAdapter,
    private val fingerRuntimeAdapter: FingerRuntimeAdapter,
    private val overlayRuntimeAdapter: OverlayRuntimeAdapter,
) : AndroidRuntimeAnalyzerPort {
    override fun detectHand(frame: Bitmap): HandDetection? = handRuntimeAdapter.detect(frame)

    override fun detectCard(frame: Bitmap): CardDetection? = cardRuntimeAdapter.detect(frame)

    override fun classifyPose(
        step: CoreCaptureStep,
        hand: HandDetection,
    ): Float? = poseRuntimeAdapter.classify(step, hand)

    override fun estimateCoplanarity(
        hand: HandDetection?,
        card: CardDetection?,
        frame: Bitmap,
        targetFinger: TargetFinger,
    ): Float = coplanarityRuntimeAdapter.estimate(hand, card, frame, targetFinger)

    override fun extractCardDiagnostics(card: CardDetection): SessionCardDiagnostics =
        cardRuntimeAdapter.toCardDiagnostics(card)

    override fun calibrateScale(card: CardDetection): SessionScaleResult? = scaleRuntimeAdapter.calibrate(card)

    override fun measureFingerWidth(
        frame: Bitmap,
        hand: HandDetection,
        targetFinger: TargetFinger,
        scale: SessionScale,
    ): SessionFingerMeasurement? = fingerRuntimeAdapter.measure(frame, hand, targetFinger, scale)

    override fun encodeOverlay(
        step: CoreCaptureStep,
        frame: Bitmap,
        hand: HandDetection?,
        card: CardDetection?,
    ): ByteArray? = overlayRuntimeAdapter.encode(step, frame, hand, card)
}
