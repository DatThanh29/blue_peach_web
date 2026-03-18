package com.handmeasure.measurement

import android.graphics.Bitmap
import android.graphics.PointF
import com.handmeasure.api.TargetFinger
import com.handmeasure.vision.HandDetection
import com.handmeasure.vision.Landmark2D
import com.handmeasure.vision.OpenCvBootstrap
import org.opencv.android.Utils
import org.opencv.core.Core
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.Point
import org.opencv.core.Rect
import org.opencv.imgproc.Imgproc
import kotlin.math.abs
import kotlin.math.hypot
import kotlin.math.max
import kotlin.math.min

data class FingerWidthMeasurement(
    val widthPx: Double,
    val widthMm: Double,
    val usedFallback: Boolean,
)

class FingerMeasurementEngine {
    fun measureVisibleWidth(
        bitmap: Bitmap,
        handDetection: HandDetection,
        targetFinger: TargetFinger,
        scale: MetricScale,
    ): FingerWidthMeasurement {
        if (!OpenCvBootstrap.ensureLoaded()) {
            return heuristicFallback(handDetection, targetFinger, scale)
        }
        val jointPair = handDetection.fingerJointPair(targetFinger) ?: return heuristicFallback(handDetection, targetFinger, scale)
        val mcp = jointPair.first
        val pip = jointPair.second
        val ringZone = PointF(mcp.x + (pip.x - mcp.x) * 0.4f, mcp.y + (pip.y - mcp.y) * 0.4f)
        val axis = PointF(pip.x - mcp.x, pip.y - mcp.y)
        val axisLength = hypot(axis.x.toDouble(), axis.y.toDouble()).coerceAtLeast(1.0)
        val perp = PointF((-axis.y / axisLength).toFloat(), (axis.x / axisLength).toFloat())

        val src = Mat()
        val gray = Mat()
        val gradX = Mat()
        val gradY = Mat()
        val gradMag = Mat()
        return try {
            Utils.bitmapToMat(bitmap, src)
            Imgproc.cvtColor(src, gray, Imgproc.COLOR_RGBA2GRAY)
            Imgproc.Sobel(gray, gradX, CvType.CV_32F, 1, 0)
            Imgproc.Sobel(gray, gradY, CvType.CV_32F, 0, 1)
            Core.magnitude(gradX, gradY, gradMag)

            val roiRadius = 120
            val left = (ringZone.x.toInt() - roiRadius).coerceAtLeast(0)
            val top = (ringZone.y.toInt() - roiRadius).coerceAtLeast(0)
            val rect = Rect(left, top, min(roiRadius * 2, gradMag.cols() - left), min(roiRadius * 2, gradMag.rows() - top))
            if (rect.width <= 0 || rect.height <= 0) return heuristicFallback(handDetection, targetFinger, scale)
            val center = PointF(ringZone.x - rect.x, ringZone.y - rect.y)
            val roi = Mat(gradMag, rect)
            val leftEdge = findEdge(roi, center, perp, -1)
            val rightEdge = findEdge(roi, center, perp, 1)
            roi.release()

            if (leftEdge == null || rightEdge == null) return heuristicFallback(handDetection, targetFinger, scale)
            val widthPx = distance(leftEdge, rightEdge)
            if (widthPx <= 1.0) return heuristicFallback(handDetection, targetFinger, scale)
            val widthMm = widthPx * scale.meanMmPerPx
            FingerWidthMeasurement(widthPx = widthPx, widthMm = widthMm, usedFallback = false)
        } finally {
            gradMag.release()
            gradY.release()
            gradX.release()
            gray.release()
            src.release()
        }
    }

    private fun heuristicFallback(
        handDetection: HandDetection,
        targetFinger: TargetFinger,
        scale: MetricScale,
    ): FingerWidthMeasurement {
        val jointPair = handDetection.fingerJointPair(targetFinger)
        val widthPx =
            if (jointPair == null) {
                120.0
            } else {
                distance(jointPair.first, jointPair.second) * 0.42
            }
        return FingerWidthMeasurement(
            widthPx = widthPx,
            widthMm = widthPx * scale.meanMmPerPx,
            usedFallback = true,
        )
    }

    private fun findEdge(gradient: Mat, center: PointF, direction: PointF, sign: Int): PointF? {
        var bestValue = 0.0
        var best: PointF? = null
        val maxSteps = min(gradient.cols(), gradient.rows()) / 2
        for (step in 3 until maxSteps) {
            val x = (center.x + direction.x * step * sign).toInt()
            val y = (center.y + direction.y * step * sign).toInt()
            if (x !in 1 until gradient.cols() - 1 || y !in 1 until gradient.rows() - 1) break
            val value = gradient.get(y, x)[0]
            if (value > bestValue) {
                bestValue = value
                best = PointF(x.toFloat(), y.toFloat())
            }
        }
        return if (bestValue >= 20.0) best else null
    }

    private fun distance(a: PointF, b: PointF): Double = hypot((a.x - b.x).toDouble(), (a.y - b.y).toDouble())

    private fun distance(a: Landmark2D, b: Landmark2D): Double = hypot((a.x - b.x).toDouble(), (a.y - b.y).toDouble())

    private fun distance(a: Point, b: Point): Double = hypot(a.x - b.x, a.y - b.y)
}
