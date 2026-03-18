package com.handmeasure.vision

import com.handmeasure.api.TargetFinger
import com.handmeasure.measurement.CardRectangle

data class Landmark2D(
    val x: Float,
    val y: Float,
    val z: Float = 0f,
)

data class Landmark3D(
    val x: Float,
    val y: Float,
    val z: Float,
)

data class HandDetection(
    val imageLandmarks: List<Landmark2D>,
    val worldLandmarks: List<Landmark3D>,
    val handedness: String,
    val confidence: Float,
) {
    fun fingerJointPair(targetFinger: TargetFinger): Pair<Landmark2D, Landmark2D>? {
        val (mcpIndex, pipIndex) =
            when (targetFinger) {
                TargetFinger.THUMB -> 2 to 3
                TargetFinger.INDEX -> 5 to 6
                TargetFinger.MIDDLE -> 9 to 10
                TargetFinger.RING -> 13 to 14
                TargetFinger.LITTLE -> 17 to 18
            }
        if (imageLandmarks.size <= pipIndex) return null
        return imageLandmarks[mcpIndex] to imageLandmarks[pipIndex]
    }
}

data class CardDetection(
    val rectangle: CardRectangle,
    val corners: List<Pair<Float, Float>>,
    val contourAreaScore: Float,
    val aspectScore: Float,
    val confidence: Float,
)
