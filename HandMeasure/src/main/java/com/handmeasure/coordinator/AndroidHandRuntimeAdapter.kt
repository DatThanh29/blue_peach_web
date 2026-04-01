package com.handmeasure.coordinator

import android.graphics.Bitmap
import com.handmeasure.vision.HandDetection
import com.handmeasure.vision.HandLandmarkEngine

internal class AndroidHandRuntimeAdapter(
    private val handLandmarkEngine: HandLandmarkEngine,
) : HandRuntimeAdapter {
    override fun detect(frame: Bitmap): HandDetection? = handLandmarkEngine.detect(frame)
}
