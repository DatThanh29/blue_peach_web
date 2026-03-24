package com.handmeasure.flow

import com.handmeasure.api.CaptureProtocol
import com.handmeasure.protocol.CaptureProtocols

object ProtocolGuides {
    fun steps(protocol: CaptureProtocol): List<MeasureStepDefinition> =
        CaptureProtocols.steps(protocol).map { step ->
            MeasureStepDefinition(step = step.step, role = step.role)
        }
}
