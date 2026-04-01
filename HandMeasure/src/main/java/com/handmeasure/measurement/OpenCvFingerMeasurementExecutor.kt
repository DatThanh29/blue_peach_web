package com.handmeasure.measurement

internal fun interface OpenCvFingerMeasurementExecutor {
    fun execute(request: OpenCvFingerMeasurementRequest): FingerWidthMeasurement
}
