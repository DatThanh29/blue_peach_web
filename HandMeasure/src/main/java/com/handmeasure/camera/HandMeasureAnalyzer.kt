package com.handmeasure.camera

import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.handmeasure.coordinator.HandMeasureCoordinator
import com.handmeasure.coordinator.LiveAnalysisState
import java.util.concurrent.atomic.AtomicLong

class HandMeasureAnalyzer(
    private val coordinator: HandMeasureCoordinator,
    private val minAnalysisIntervalMs: Long = 120L,
    private val onStateUpdated: (LiveAnalysisState) -> Unit,
    private val onFlowCompleted: () -> Unit,
) : ImageAnalysis.Analyzer {
    private val lastAnalyzedAt = AtomicLong(0L)

    override fun analyze(image: ImageProxy) {
        val now = System.currentTimeMillis()
        if (now - lastAnalyzedAt.get() < minAnalysisIntervalMs) {
            image.close()
            return
        }
        lastAnalyzedAt.set(now)

        try {
            val jpegBytes = ImageUtils.imageProxyToJpeg(image)
            val bitmap = ImageUtils.jpegToBitmap(jpegBytes) ?: return
            val state = coordinator.analyzeFrame(jpegBytes, bitmap)
            bitmap.recycle()
            onStateUpdated(state)
            if (coordinator.isCaptureComplete()) {
                onFlowCompleted()
            }
        } finally {
            image.close()
        }
    }
}
