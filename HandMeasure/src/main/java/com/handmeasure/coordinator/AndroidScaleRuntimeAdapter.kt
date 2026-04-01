package com.handmeasure.coordinator

import com.handmeasure.core.session.SessionScale
import com.handmeasure.core.session.SessionScaleDiagnostics
import com.handmeasure.core.session.SessionScaleResult
import com.handmeasure.measurement.ScaleCalibrator
import com.handmeasure.vision.CardDetection

internal class AndroidScaleRuntimeAdapter(
    private val scaleCalibrator: ScaleCalibrator,
) : ScaleRuntimeAdapter {
    override fun calibrate(card: CardDetection): SessionScaleResult? {
        val result = scaleCalibrator.calibrateWithDiagnostics(card)
        return SessionScaleResult(
            scale =
                SessionScale(
                    mmPerPxX = result.scale.mmPerPxX,
                    mmPerPxY = result.scale.mmPerPxY,
                ),
            diagnostics =
                SessionScaleDiagnostics(
                    status = result.diagnostics.status.toCoreCalibrationStatus(),
                    notes = result.diagnostics.notes,
                ),
        )
    }
}
