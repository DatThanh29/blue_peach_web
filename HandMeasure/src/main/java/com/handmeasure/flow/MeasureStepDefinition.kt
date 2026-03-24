package com.handmeasure.flow

import com.handmeasure.api.CaptureStep
import com.handmeasure.protocol.ProtocolStepRole

data class MeasureStepDefinition(
    val step: CaptureStep,
    val role: ProtocolStepRole,
)
