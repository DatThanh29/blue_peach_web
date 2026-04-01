package com.handmeasure.engine

import com.handmeasure.api.HandMeasureResult
import com.handmeasure.coordinator.SessionProcessingOutput
import com.handmeasure.flow.StepCandidate

internal fun interface MeasurementEngineSessionProcessorPort {
    fun process(stepResults: List<StepCandidate>): SessionProcessingOutput
}

internal fun interface MeasurementEngineResultAssemblerPort {
    fun assemble(
        completedSteps: List<StepCandidate>,
        processing: SessionProcessingOutput,
    ): HandMeasureResult
}
