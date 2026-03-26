package com.handmeasure.sample.tryon.ui

import android.graphics.Bitmap
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.handmeasure.camera.ImageUtils
import com.handmeasure.vision.HandDetection
import com.handmeasure.vision.HandLandmarkEngine
import java.util.concurrent.atomic.AtomicLong

class TryOnFrameAnalyzer(
    private val handLandmarkEngine: HandLandmarkEngine,
    private val minAnalysisIntervalMs: Long = 120L,
    private val onAnalyzed: (Bitmap, HandDetection?) -> Unit,
) : ImageAnalysis.Analyzer {
    private val lastAnalyzedAt = AtomicLong(0L)

    override fun analyze(image: ImageProxy) {
        val now = System.currentTimeMillis()
        if (now - lastAnalyzedAt.get() < minAnalysisIntervalMs) {
            image.close()
            return
        }
        lastAnalyzedAt.set(now)

        var bitmap: Bitmap? = null
        try {
            val jpegBytes = ImageUtils.imageProxyToJpeg(image)
            bitmap = ImageUtils.jpegToBitmap(jpegBytes, maxDim = 1080) ?: return
            val detection = handLandmarkEngine.detect(bitmap)
            onAnalyzed(bitmap, detection)
            bitmap = null
        } finally {
            bitmap?.recycle()
            image.close()
        }
    }
}
