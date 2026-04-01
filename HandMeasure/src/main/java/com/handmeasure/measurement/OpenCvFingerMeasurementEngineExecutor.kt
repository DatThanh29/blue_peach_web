package com.handmeasure.measurement

internal class OpenCvFingerMeasurementEngineExecutor(
    private val engine: FingerMeasurementEngine = FingerMeasurementEngine(),
) : OpenCvFingerMeasurementExecutor {
    override fun execute(request: OpenCvFingerMeasurementRequest): FingerWidthMeasurement =
        engine.measureVisibleWidth(
            bitmap = request.frame,
            handDetection = request.hand,
            targetFinger = request.targetFinger,
            scale = request.scale,
        )
}
