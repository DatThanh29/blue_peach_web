package com.handmeasure.protocol

import com.handmeasure.api.CaptureProtocol
import com.handmeasure.api.CaptureStep
import com.handmeasure.coordinator.PoseTarget

enum class ProtocolStepRole {
    FRONTAL,
    LEFT_OBLIQUE,
    RIGHT_OBLIQUE,
    TILT_UP,
    TILT_DOWN,
}

data class ProtocolStep(
    val step: CaptureStep,
    val role: ProtocolStepRole,
    val poseTarget: PoseTarget,
)

object CaptureProtocols {
    fun steps(protocol: CaptureProtocol): List<ProtocolStep> =
        when (protocol) {
            CaptureProtocol.DORSAL_V1 -> dorsalV1
            CaptureProtocol.PALMAR_V1 -> palmarV1
        }

    private val dorsalV1 =
        listOf(
            ProtocolStep(CaptureStep.BACK_OF_HAND, ProtocolStepRole.FRONTAL, PoseTarget(0f, 0f, -1f)),
            ProtocolStep(CaptureStep.LEFT_OBLIQUE_DORSAL, ProtocolStepRole.LEFT_OBLIQUE, PoseTarget(-0.55f, 0f, -0.85f)),
            ProtocolStep(CaptureStep.RIGHT_OBLIQUE_DORSAL, ProtocolStepRole.RIGHT_OBLIQUE, PoseTarget(0.55f, 0f, -0.85f)),
            ProtocolStep(CaptureStep.UP_TILT_DORSAL, ProtocolStepRole.TILT_UP, PoseTarget(0f, -0.65f, -0.75f)),
            ProtocolStep(CaptureStep.DOWN_TILT_DORSAL, ProtocolStepRole.TILT_DOWN, PoseTarget(0f, 0.65f, -0.75f)),
        )

    private val palmarV1 =
        listOf(
            ProtocolStep(CaptureStep.FRONT_PALM, ProtocolStepRole.FRONTAL, PoseTarget(0f, 0f, 1f)),
            ProtocolStep(CaptureStep.LEFT_OBLIQUE, ProtocolStepRole.LEFT_OBLIQUE, PoseTarget(-0.55f, 0f, 0.85f)),
            ProtocolStep(CaptureStep.RIGHT_OBLIQUE, ProtocolStepRole.RIGHT_OBLIQUE, PoseTarget(0.55f, 0f, 0.85f)),
            ProtocolStep(CaptureStep.UP_TILT, ProtocolStepRole.TILT_UP, PoseTarget(0f, -0.65f, 0.75f)),
            ProtocolStep(CaptureStep.DOWN_TILT, ProtocolStepRole.TILT_DOWN, PoseTarget(0f, 0.65f, 0.75f)),
        )
}

fun CaptureStep.role(): ProtocolStepRole =
    when (this) {
        CaptureStep.FRONT_PALM -> ProtocolStepRole.FRONTAL
        CaptureStep.BACK_OF_HAND -> ProtocolStepRole.FRONTAL
        CaptureStep.LEFT_OBLIQUE, CaptureStep.LEFT_OBLIQUE_DORSAL -> ProtocolStepRole.LEFT_OBLIQUE
        CaptureStep.RIGHT_OBLIQUE, CaptureStep.RIGHT_OBLIQUE_DORSAL -> ProtocolStepRole.RIGHT_OBLIQUE
        CaptureStep.UP_TILT, CaptureStep.UP_TILT_DORSAL -> ProtocolStepRole.TILT_UP
        CaptureStep.DOWN_TILT, CaptureStep.DOWN_TILT_DORSAL -> ProtocolStepRole.TILT_DOWN
    }
