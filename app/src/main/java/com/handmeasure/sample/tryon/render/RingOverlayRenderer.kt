package com.handmeasure.sample.tryon.render

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import com.handmeasure.sample.tryon.domain.RingPlacement
import com.handmeasure.sample.tryon.domain.TryOnMode
import com.handmeasure.sample.tryon.domain.TryOnRenderResult

class RingOverlayRenderer {
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG)

    fun drawOverlay(
        canvas: Canvas,
        ringBitmap: Bitmap,
        placement: RingPlacement,
        alpha: Int = 255,
    ) {
        val scale = placement.ringWidthPx / ringBitmap.width.coerceAtLeast(1).toFloat()
        paint.alpha = alpha.coerceIn(0, 255)
        canvas.save()
        canvas.translate(placement.centerX, placement.centerY)
        canvas.rotate(placement.rotationDegrees)
        canvas.scale(scale, scale)
        canvas.translate(-ringBitmap.width * 0.5f, -ringBitmap.height * 0.5f)
        canvas.drawBitmap(ringBitmap, 0f, 0f, paint)
        canvas.restore()
    }

    fun renderToBitmap(
        baseFrame: Bitmap,
        ringBitmap: Bitmap,
        placement: RingPlacement,
        mode: TryOnMode,
    ): TryOnRenderResult {
        val output = baseFrame.copy(Bitmap.Config.ARGB_8888, true)
        val canvas = Canvas(output)
        drawOverlay(canvas = canvas, ringBitmap = ringBitmap, placement = placement)
        return TryOnRenderResult(
            bitmap = output,
            mode = mode,
            generatedAtMs = System.currentTimeMillis(),
        )
    }
}
