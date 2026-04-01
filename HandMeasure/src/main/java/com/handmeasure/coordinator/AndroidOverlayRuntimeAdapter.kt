package com.handmeasure.coordinator

import android.graphics.Bitmap
import com.handmeasure.vision.CardDetection
import com.handmeasure.vision.HandDetection
import com.handmeasure.core.measurement.CaptureStep as CoreCaptureStep

internal class AndroidOverlayRuntimeAdapter(
    private val frameAnnotator: DebugFrameAnnotator,
) : OverlayRuntimeAdapter {
    override fun encode(
        step: CoreCaptureStep,
        frame: Bitmap,
        hand: HandDetection?,
        card: CardDetection?,
    ): ByteArray? = frameAnnotator.encodeAnnotatedJpeg(frame, hand, card)
}
