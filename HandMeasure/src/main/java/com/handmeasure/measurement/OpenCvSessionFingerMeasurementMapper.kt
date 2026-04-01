package com.handmeasure.measurement

import com.handmeasure.core.measurement.WidthMeasurementSource as CoreWidthMeasurementSource
import com.handmeasure.core.session.SessionFingerMeasurement
import com.handmeasure.core.session.SessionScale

internal class OpenCvSessionFingerMeasurementMapper {
    fun toMetricScale(scale: SessionScale): MetricScale =
        MetricScale(
            mmPerPxX = scale.mmPerPxX,
            mmPerPxY = scale.mmPerPxY,
        )

    fun toCoreMeasurement(measurement: FingerWidthMeasurement): SessionFingerMeasurement =
        SessionFingerMeasurement(
            widthPx = measurement.widthPx,
            widthMm = measurement.widthMm,
            usedFallback = measurement.usedFallback,
            source = measurement.source.toCoreWidthMeasurementSource(),
            validSamples = measurement.validSamples,
            widthVarianceMm = measurement.widthVarianceMm,
            sampledWidthsMm = measurement.sampledWidthsMm,
        )

    private fun WidthMeasurementSource.toCoreWidthMeasurementSource(): CoreWidthMeasurementSource =
        when (this) {
            WidthMeasurementSource.EDGE_PROFILE -> CoreWidthMeasurementSource.EDGE_PROFILE
            WidthMeasurementSource.LANDMARK_HEURISTIC -> CoreWidthMeasurementSource.LANDMARK_HEURISTIC
            WidthMeasurementSource.DEFAULT_HEURISTIC -> CoreWidthMeasurementSource.DEFAULT_HEURISTIC
        }
}
