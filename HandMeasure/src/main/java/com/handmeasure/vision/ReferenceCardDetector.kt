package com.handmeasure.vision

import android.graphics.Bitmap
import android.util.Log
import com.handmeasure.measurement.CardRectangle
import org.opencv.android.Utils
import org.opencv.core.Mat
import org.opencv.core.MatOfPoint
import org.opencv.core.MatOfPoint2f
import org.opencv.core.Point
import org.opencv.core.RotatedRect
import org.opencv.core.Size
import org.opencv.imgproc.Imgproc
import kotlin.math.abs
import kotlin.math.max

interface ReferenceCardDetector {
    fun detect(bitmap: Bitmap): CardDetection?
}

class OpenCvReferenceCardDetector : ReferenceCardDetector {
    override fun detect(bitmap: Bitmap): CardDetection? {
        if (!OpenCvBootstrap.ensureLoaded()) return null

        val rgba = Mat()
        val gray = Mat()
        val blurred = Mat()
        val edges = Mat()
        val hierarchy = Mat()
        val contours = ArrayList<MatOfPoint>()

        return try {
            Utils.bitmapToMat(bitmap, rgba)
            Imgproc.cvtColor(rgba, gray, Imgproc.COLOR_RGBA2GRAY)
            Imgproc.GaussianBlur(gray, blurred, Size(5.0, 5.0), 0.0)
            Imgproc.Canny(blurred, edges, 35.0, 100.0)
            val kernel = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, Size(5.0, 5.0))
            Imgproc.morphologyEx(edges, edges, Imgproc.MORPH_CLOSE, kernel)
            kernel.release()

            Imgproc.findContours(edges, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE)
            val frameArea = (bitmap.width * bitmap.height).toDouble().coerceAtLeast(1.0)

            contours
                .mapNotNull { contour ->
                    val area = Imgproc.contourArea(contour)
                    if (area < frameArea * 0.01) return@mapNotNull null

                    val contour2f = MatOfPoint2f(*contour.toArray())
                    val rotated = Imgproc.minAreaRect(contour2f)
                    contour2f.release()
                    val candidate = RectangleFitHelper.fromRotatedRect(rotated)
                    if (candidate.shortSidePx <= 1.0) return@mapNotNull null

                    val rotatedArea = rotated.size.area().coerceAtLeast(1.0)
                    val rectangularity = (area / rotatedArea).toFloat().coerceIn(0f, 1f)
                    val aspect = candidate.longSidePx / candidate.shortSidePx
                    val aspectScore = (1.0 - (abs(aspect - ID1_ASPECT) / ID1_ASPECT) / 0.35).toFloat().coerceIn(0f, 1f)
                    val areaScore = ((area / frameArea) / 0.08).toFloat().coerceIn(0f, 1f)
                    val confidence = (aspectScore * 0.45f + rectangularity * 0.4f + areaScore * 0.15f).coerceIn(0f, 1f)
                    if (confidence < 0.25f) return@mapNotNull null
                    CardDetection(
                        rectangle = candidate,
                        corners = RectangleFitHelper.extractCorners(rotated),
                        contourAreaScore = rectangularity,
                        aspectScore = aspectScore,
                        confidence = confidence,
                    )
                }
                .maxByOrNull { it.confidence }
        } catch (error: Throwable) {
            Log.w("ReferenceCardDetector", "Card detection failed: ${error.message}")
            null
        } finally {
            contours.forEach { it.release() }
            hierarchy.release()
            edges.release()
            blurred.release()
            gray.release()
            rgba.release()
        }
    }

    private companion object {
        const val ID1_ASPECT = 85.60 / 53.98
    }
}

object RectangleFitHelper {
    fun fromRotatedRect(rotatedRect: RotatedRect): CardRectangle {
        val longSide = max(rotatedRect.size.width, rotatedRect.size.height)
        val shortSide = minOf(rotatedRect.size.width, rotatedRect.size.height)
        val normalizedAngle =
            if (rotatedRect.size.width >= rotatedRect.size.height) rotatedRect.angle.toDouble() else rotatedRect.angle.toDouble() + 90.0
        return CardRectangle(
            centerX = rotatedRect.center.x,
            centerY = rotatedRect.center.y,
            longSidePx = longSide,
            shortSidePx = shortSide,
            angleDeg = normalizedAngle,
        )
    }

    fun extractCorners(rotatedRect: RotatedRect): List<Pair<Float, Float>> {
        val points = arrayOfNulls<Point>(4)
        rotatedRect.points(points)
        return points.mapNotNull { point -> point?.let { it.x.toFloat() to it.y.toFloat() } }
    }

    fun rectifyCard(bitmap: Bitmap, detection: CardDetection, outputWidth: Int = 856, outputHeight: Int = 540): Bitmap? {
        if (!OpenCvBootstrap.ensureLoaded()) return null
        val src = Mat()
        val dst = Mat()
        return try {
            Utils.bitmapToMat(bitmap, src)
            val corners = detection.corners.map { Point(it.first.toDouble(), it.second.toDouble()) }
            if (corners.size != 4) return null
            val input = MatOfPoint2f(*corners.toTypedArray())
            val output =
                MatOfPoint2f(
                    Point(0.0, 0.0),
                    Point(outputWidth.toDouble(), 0.0),
                    Point(outputWidth.toDouble(), outputHeight.toDouble()),
                    Point(0.0, outputHeight.toDouble()),
                )
            val transform = Imgproc.getPerspectiveTransform(input, output)
            Imgproc.warpPerspective(src, dst, transform, Size(outputWidth.toDouble(), outputHeight.toDouble()))
            val outBitmap = Bitmap.createBitmap(outputWidth, outputHeight, Bitmap.Config.ARGB_8888)
            Utils.matToBitmap(dst, outBitmap)
            transform.release()
            input.release()
            output.release()
            outBitmap
        } finally {
            dst.release()
            src.release()
        }
    }
}
