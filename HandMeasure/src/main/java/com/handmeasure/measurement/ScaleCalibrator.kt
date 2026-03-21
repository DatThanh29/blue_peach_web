package com.handmeasure.measurement

import com.handmeasure.api.CalibrationStatus
import com.handmeasure.vision.CardDetection
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

data class CardRectangle(
    val centerX: Double,
    val centerY: Double,
    val longSidePx: Double,
    val shortSidePx: Double,
    val angleDeg: Double,
)

data class MetricScale(
    val mmPerPxX: Double,
    val mmPerPxY: Double,
) {
    val meanMmPerPx: Double
        get() = (mmPerPxX + mmPerPxY) / 2.0

    val anisotropyRatio: Double
        get() = max(mmPerPxX, mmPerPxY) / min(mmPerPxX, mmPerPxY).coerceAtLeast(1e-6)
}

data class ScaleCalibrationDiagnostics(
    val status: CalibrationStatus,
    val anisotropyRatio: Double,
    val perspectiveDistortion: Float,
    val rectificationConfidence: Float,
    val notes: List<String>,
)

data class ScaleCalibrationResult(
    val scale: MetricScale,
    val diagnostics: ScaleCalibrationDiagnostics,
)

class ScaleCalibrator(
    private val cardWidthMm: Double = 85.60,
    private val cardHeightMm: Double = 53.98,
) {
    fun calibrate(cardRectangle: CardRectangle): MetricScale {
        val rectWidthPx = cardRectangle.longSidePx.coerceAtLeast(1.0)
        val rectHeightPx = cardRectangle.shortSidePx.coerceAtLeast(1.0)
        return MetricScale(
            mmPerPxX = cardWidthMm / rectWidthPx,
            mmPerPxY = cardHeightMm / rectHeightPx,
        )
    }

    fun calibrate(cardDetection: CardDetection): MetricScale = calibrate(cardDetection.rectangle)

    fun calibrateWithDiagnostics(cardDetection: CardDetection): ScaleCalibrationResult {
        val scale = calibrate(cardDetection)
        val anisotropy = scale.anisotropyRatio
        val status =
            when {
                anisotropy > MAX_REASONABLE_ANISOTROPY -> CalibrationStatus.DEGRADED
                cardDetection.perspectiveDistortion > MAX_REASONABLE_PERSPECTIVE -> CalibrationStatus.DEGRADED
                cardDetection.rectificationConfidence < MIN_RECTIFICATION_CONFIDENCE -> CalibrationStatus.DEGRADED
                else -> CalibrationStatus.CALIBRATED
            }

        val notes =
            buildList {
                add("mmPerPxX=${"%.6f".format(scale.mmPerPxX)}")
                add("mmPerPxY=${"%.6f".format(scale.mmPerPxY)}")
                add("scaleAnisotropy=${"%.4f".format(anisotropy)}")
                add("perspectiveDistortion=${"%.4f".format(cardDetection.perspectiveDistortion)}")
                add("rectificationConfidence=${"%.4f".format(cardDetection.rectificationConfidence)}")
                val aspectResidual = abs(cardDetection.aspectResidual.toDouble())
                if (aspectResidual > 0.16) add("aspectResidualHigh=${"%.4f".format(aspectResidual)}")
            }

        return ScaleCalibrationResult(
            scale = scale,
            diagnostics =
                ScaleCalibrationDiagnostics(
                    status = status,
                    anisotropyRatio = anisotropy,
                    perspectiveDistortion = cardDetection.perspectiveDistortion,
                    rectificationConfidence = cardDetection.rectificationConfidence,
                    notes = notes,
                ),
        )
    }

    private companion object {
        const val MAX_REASONABLE_ANISOTROPY = 1.12
        const val MAX_REASONABLE_PERSPECTIVE = 0.25f
        const val MIN_RECTIFICATION_CONFIDENCE = 0.45f
    }
}
