package com.handmeasure.sample.tryon.domain

import android.graphics.Bitmap

data class RingProduct(
    val id: String,
    val name: String,
    val overlayAssetPath: String,
    val sourceAssetFiles: List<String>,
    val defaultWidthRatio: Float = 0.16f,
    val rotationOffsetDegrees: Float = 0f,
)

data class TryOnInputQuality(
    val measurementUsable: Boolean,
    val landmarkUsable: Boolean,
    val measurementConfidence: Float,
    val landmarkConfidence: Float,
)

data class FingerAnchor(
    val centerX: Float,
    val centerY: Float,
    val angleDegrees: Float,
    val fingerWidthPx: Float,
    val confidence: Float,
)

data class RingPlacement(
    val centerX: Float,
    val centerY: Float,
    val ringWidthPx: Float,
    val rotationDegrees: Float,
)

enum class TryOnMode {
    Measured,
    LandmarkOnly,
    Manual,
}

data class TryOnSession(
    val product: RingProduct,
    val mode: TryOnMode,
    val quality: TryOnInputQuality,
    val anchor: FingerAnchor?,
    val placement: RingPlacement,
)

data class TryOnRenderResult(
    val bitmap: Bitmap,
    val mode: TryOnMode,
    val generatedAtMs: Long,
)
