package com.handmeasure.measurement

import android.graphics.Bitmap
import com.handmeasure.api.TargetFinger
import com.handmeasure.vision.HandDetection
import com.handmeasure.core.session.SessionFingerMeasurement
import com.handmeasure.core.session.SessionFingerMeasurementPort
import com.handmeasure.core.session.SessionFingerMeasurementRequest

internal class OpenCvSessionFingerMeasurementPort(
    private val executor: OpenCvFingerMeasurementExecutor = OpenCvFingerMeasurementEngineExecutor(),
    private val mapper: OpenCvSessionFingerMeasurementMapper = OpenCvSessionFingerMeasurementMapper(),
) : SessionFingerMeasurementPort<Bitmap, HandDetection, TargetFinger> {
    override fun measureVisibleWidth(request: SessionFingerMeasurementRequest<Bitmap, HandDetection, TargetFinger>): SessionFingerMeasurement =
        executor.execute(
            OpenCvFingerMeasurementRequest(
                frame = request.frame,
                hand = request.hand,
                targetFinger = request.targetFinger,
                scale = mapper.toMetricScale(request.scale),
            ),
        ).let(mapper::toCoreMeasurement)
}
