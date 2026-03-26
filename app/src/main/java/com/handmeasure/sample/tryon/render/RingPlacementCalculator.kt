package com.handmeasure.sample.tryon.render

import com.handmeasure.api.HandMeasureResult
import com.handmeasure.api.QualityLevel
import com.handmeasure.sample.tryon.domain.FingerAnchor
import com.handmeasure.sample.tryon.domain.RingPlacement
import com.handmeasure.sample.tryon.domain.RingProduct
import com.handmeasure.sample.tryon.domain.TryOnInputQuality
import com.handmeasure.sample.tryon.domain.TryOnMode
import com.handmeasure.sample.tryon.domain.TryOnSession
import com.handmeasure.vision.HandDetection
import kotlin.math.atan2
import kotlin.math.sqrt

class RingPlacementCalculator {
    fun resolveSession(
        product: RingProduct,
        measurementResult: HandMeasureResult?,
        handDetection: HandDetection?,
        frameWidth: Int,
        frameHeight: Int,
        manualPlacement: RingPlacement?,
    ): TryOnSession {
        val anchor = handDetection?.toRingFingerAnchor()
        val landmarkUsable = anchor?.isUsable() == true
        val measurementUsable = measurementResult.isUsableMeasurement()
        val mode =
            when {
                measurementUsable && landmarkUsable -> TryOnMode.Measured
                landmarkUsable -> TryOnMode.LandmarkOnly
                else -> TryOnMode.Manual
            }
        val quality =
            TryOnInputQuality(
                measurementUsable = measurementUsable,
                landmarkUsable = landmarkUsable,
                measurementConfidence = measurementResult?.confidenceScore ?: 0f,
                landmarkConfidence = anchor?.confidence ?: 0f,
            )
        val placement =
            when (mode) {
                TryOnMode.Measured -> fromMeasured(anchor = anchor!!, result = measurementResult!!)
                TryOnMode.LandmarkOnly -> fromLandmark(anchor = anchor!!)
                TryOnMode.Manual -> manualPlacement ?: defaultPlacement(frameWidth, frameHeight, product.defaultWidthRatio)
            }
        return TryOnSession(
            product = product,
            mode = mode,
            quality = quality,
            anchor = anchor,
            placement = placement.copy(rotationDegrees = placement.rotationDegrees + product.rotationOffsetDegrees),
        )
    }

    fun defaultPlacement(
        frameWidth: Int,
        frameHeight: Int,
        defaultWidthRatio: Float,
    ): RingPlacement {
        val safeWidth = frameWidth.coerceAtLeast(1)
        val safeHeight = frameHeight.coerceAtLeast(1)
        val ringWidth = (safeWidth * defaultWidthRatio).coerceAtLeast(26f)
        return RingPlacement(
            centerX = safeWidth * 0.5f,
            centerY = safeHeight * 0.52f,
            ringWidthPx = ringWidth.coerceAtMost(safeWidth * 0.45f),
            rotationDegrees = 0f,
        )
    }

    private fun fromLandmark(anchor: FingerAnchor): RingPlacement {
        return RingPlacement(
            centerX = anchor.centerX,
            centerY = anchor.centerY,
            ringWidthPx = anchor.fingerWidthPx * 1.06f,
            rotationDegrees = anchor.angleDegrees,
        )
    }

    private fun fromMeasured(
        anchor: FingerAnchor,
        result: HandMeasureResult,
    ): RingPlacement {
        val measuredWidthPx =
            estimateDiameterPx(result, anchor.fingerWidthPx).coerceIn(
                minimumValue = anchor.fingerWidthPx * 0.78f,
                maximumValue = anchor.fingerWidthPx * 1.25f,
            )
        return RingPlacement(
            centerX = anchor.centerX,
            centerY = anchor.centerY,
            ringWidthPx = measuredWidthPx,
            rotationDegrees = anchor.angleDegrees,
        )
    }

    private fun estimateDiameterPx(
        result: HandMeasureResult,
        fallbackFingerWidthPx: Float,
    ): Float {
        val mmPerPx = result.debugMetadata?.mmPerPxX?.takeIf { it > 0.0 }?.toFloat()
        if (mmPerPx != null) {
            return (result.equivalentDiameterMm.toFloat() / mmPerPx).coerceAtLeast(16f)
        }
        val mmWidth = result.fingerWidthMm.toFloat().takeIf { it > 0f }
        if (mmWidth != null) {
            return (fallbackFingerWidthPx * result.equivalentDiameterMm.toFloat() / mmWidth).coerceAtLeast(16f)
        }
        return fallbackFingerWidthPx
    }

    private fun HandDetection.toRingFingerAnchor(): FingerAnchor? {
        if (imageLandmarks.size <= 14) return null
        val mcp = imageLandmarks[13]
        val pip = imageLandmarks[14]
        val vectorX = pip.x - mcp.x
        val vectorY = pip.y - mcp.y
        val length = sqrt(vectorX * vectorX + vectorY * vectorY)
        if (length <= 2f) return null
        val centerX = mcp.x + vectorX * 0.52f
        val centerY = mcp.y + vectorY * 0.52f
        return FingerAnchor(
            centerX = centerX,
            centerY = centerY,
            angleDegrees = (atan2(vectorY, vectorX) * 180f / Math.PI).toFloat(),
            fingerWidthPx = (length * 1.38f).coerceAtLeast(16f),
            confidence = confidence.coerceIn(0f, 1f),
        )
    }

    private fun FingerAnchor.isUsable(): Boolean = confidence >= 0.28f && fingerWidthPx >= 16f

    private fun HandMeasureResult?.isUsableMeasurement(): Boolean {
        val result = this ?: return false
        if (result.equivalentDiameterMm <= 0.0) return false
        if (result.confidenceScore < 0.35f) return false
        return result.qualityLevel != QualityLevel.LOW || !result.retryRecommended
    }
}
