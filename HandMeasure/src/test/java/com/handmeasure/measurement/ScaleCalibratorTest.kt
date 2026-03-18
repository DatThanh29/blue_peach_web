package com.handmeasure.measurement

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ScaleCalibratorTest {
    @Test
    fun calibrate_returnsExpectedMillimetersPerPixel() {
        val calibrator = ScaleCalibrator()
        val scale =
            calibrator.calibrate(
                CardRectangle(
                    centerX = 0.0,
                    centerY = 0.0,
                    longSidePx = 856.0,
                    shortSidePx = 540.0,
                    angleDeg = 0.0,
                ),
            )

        assertThat(scale.mmPerPxX).isWithin(0.0001).of(0.1)
        assertThat(scale.mmPerPxY).isWithin(0.0001).of(0.0999629)
    }
}
