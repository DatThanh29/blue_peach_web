package com.handmeasure.vision

import com.google.common.truth.Truth.assertThat
import org.junit.Test
import org.opencv.core.Point
import org.opencv.core.RotatedRect
import org.opencv.core.Size

class RectangleFitHelperTest {
    @Test
    fun fromRotatedRect_normalizesLongAndShortSides() {
        val rect = RotatedRect(Point(120.0, 60.0), Size(53.98, 85.60), -90.0)

        val fitted = RectangleFitHelper.fromRotatedRect(rect)

        assertThat(fitted.longSidePx).isWithin(0.001).of(85.60)
        assertThat(fitted.shortSidePx).isWithin(0.001).of(53.98)
    }
}
