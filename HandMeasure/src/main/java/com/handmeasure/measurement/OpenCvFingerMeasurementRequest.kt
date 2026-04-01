package com.handmeasure.measurement

import android.graphics.Bitmap
import com.handmeasure.api.TargetFinger
import com.handmeasure.vision.HandDetection

internal data class OpenCvFingerMeasurementRequest(
    val frame: Bitmap,
    val hand: HandDetection,
    val targetFinger: TargetFinger,
    val scale: MetricScale,
)
