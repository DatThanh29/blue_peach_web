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

internal fun interface HandRuntimeAdapter {
    fun detect(frame: Bitmap): HandDetection?
}

internal interface CardRuntimeAdapter {
    fun detect(frame: Bitmap): CardDetection?

    fun toCardDiagnostics(card: CardDetection): SessionCardDiagnostics
}

internal fun interface PoseRuntimeAdapter {
    fun classify(
        step: CoreCaptureStep,
        hand: HandDetection,
    ): Float?
}

internal fun interface CoplanarityRuntimeAdapter {
    fun estimate(
        hand: HandDetection?,
        card: CardDetection?,
        frame: Bitmap,
        targetFinger: TargetFinger,
    ): Float
}

internal fun interface ScaleRuntimeAdapter {
    fun calibrate(card: CardDetection): SessionScaleResult?
}

internal fun interface FingerRuntimeAdapter {
    fun measure(
        frame: Bitmap,
        hand: HandDetection,
        targetFinger: TargetFinger,
        scale: SessionScale,
    ): SessionFingerMeasurement?
}

internal fun interface OverlayRuntimeAdapter {
    fun encode(
        step: CoreCaptureStep,
        frame: Bitmap,
        hand: HandDetection?,
        card: CardDetection?,
    ): ByteArray?
}
