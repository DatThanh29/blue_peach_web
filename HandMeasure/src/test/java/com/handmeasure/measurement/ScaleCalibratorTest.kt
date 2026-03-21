package com.handmeasure.measurement

import com.google.common.truth.Truth.assertThat
import com.handmeasure.api.CalibrationStatus
import com.handmeasure.vision.CardDetection
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

    @Test
    fun calibrateWithDiagnostics_marksDegradedWhenPerspectiveIsHigh() {
        val calibrator = ScaleCalibrator()
        val result =
            calibrator.calibrateWithDiagnostics(
                CardDetection(
                    rectangle = CardRectangle(0.0, 0.0, 856.0, 540.0, 0.0),
                    corners = listOf(0f to 0f, 10f to 0f, 10f to 10f, 0f to 10f),
                    contourAreaScore = 0.8f,
                    aspectScore = 0.8f,
                    confidence = 0.8f,
                    perspectiveDistortion = 0.35f,
                    rectificationConfidence = 0.4f,
                ),
            )

        assertThat(result.diagnostics.status).isEqualTo(CalibrationStatus.DEGRADED)
        assertThat(result.diagnostics.notes).isNotEmpty()
    }
}
