package com.handmeasure.flow

import com.handmeasure.api.CaptureStep

data class MeasureStepDefinition(
    val step: CaptureStep,
    val title: String,
    val hint: String,
)

object GuidedSteps {
    val all =
        listOf(
            MeasureStepDefinition(CaptureStep.FRONT_PALM, "Front palm", "Place your palm toward the camera and keep the card near the ring finger."),
            MeasureStepDefinition(CaptureStep.LEFT_OBLIQUE, "Left oblique", "Rotate your hand slightly left while keeping the ring finger visible."),
            MeasureStepDefinition(CaptureStep.RIGHT_OBLIQUE, "Right oblique", "Rotate your hand slightly right and keep the card in frame."),
            MeasureStepDefinition(CaptureStep.UP_TILT, "Up tilt", "Tilt your hand upward to reveal finger thickness."),
            MeasureStepDefinition(CaptureStep.DOWN_TILT, "Down tilt", "Tilt your hand downward for the final angle."),
        )
}
