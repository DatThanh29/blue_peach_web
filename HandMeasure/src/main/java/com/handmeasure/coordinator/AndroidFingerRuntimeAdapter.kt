package com.handmeasure.coordinator

import android.graphics.Bitmap
import com.handmeasure.api.TargetFinger
import com.handmeasure.vision.HandDetection
import com.handmeasure.core.session.SessionFingerMeasurement
import com.handmeasure.core.session.SessionFingerMeasurementRequest
import com.handmeasure.core.session.SessionScale

internal class AndroidFingerRuntimeAdapter(
    private val fingerMeasurementPort: AndroidFingerMeasurementPort,
) : FingerRuntimeAdapter {
    override fun measure(
        frame: Bitmap,
        hand: HandDetection,
        targetFinger: TargetFinger,
        scale: SessionScale,
    ): SessionFingerMeasurement? =
        fingerMeasurementPort.measureVisibleWidth(
            SessionFingerMeasurementRequest(
                frame = frame,
                hand = hand,
                targetFinger = targetFinger,
                scale = scale,
            ),
        )
}
