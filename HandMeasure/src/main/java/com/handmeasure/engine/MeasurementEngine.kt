package com.handmeasure.engine

import com.handmeasure.engine.compat.MeasurementEngineApiMapper
import com.handmeasure.engine.model.MeasurementEngineProcessingResult
import com.handmeasure.engine.model.MeasurementEngineStepCandidate
import com.handmeasure.flow.StepCandidate

internal class MeasurementEngine(
    private val sessionProcessor: MeasurementEngineSessionProcessorPort,
    private val resultAssembler: MeasurementEngineResultAssemblerPort,
    private val mapper: MeasurementEngineApiMapper = MeasurementEngineApiMapper(),
) {
    fun process(stepCandidates: List<MeasurementEngineStepCandidate>): MeasurementEngineProcessingResult {
        val completedSteps = stepCandidates.map(mapper::toApiStepCandidate)
        val processing = sessionProcessor.process(completedSteps)
        val apiResult = resultAssembler.assemble(completedSteps, processing)
        return MeasurementEngineProcessingResult(
            result = mapper.toEngineResult(apiResult),
            overlays = processing.overlays.map(mapper::toEngineOverlay),
        )
    }
}
