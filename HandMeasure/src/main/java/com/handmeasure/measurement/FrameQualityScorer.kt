package com.handmeasure.measurement

data class FrameQualityInput(
    val handScore: Float,
    val landmarkScore: Float,
    val ringZoneScore: Float,
    val cardScore: Float,
    val blurScore: Float,
    val motionScore: Float,
    val lightingScore: Float,
    val poseScore: Float,
    val planeScore: Float,
)

data class FrameQualityResult(
    val totalScore: Float,
    val warnings: List<String>,
)

class FrameQualityScorer {
    fun score(input: FrameQualityInput): FrameQualityResult {
        val total =
            (
                input.handScore * 0.15f +
                    input.landmarkScore * 0.10f +
                    input.ringZoneScore * 0.15f +
                    input.cardScore * 0.18f +
                    input.blurScore * 0.10f +
                    input.motionScore * 0.10f +
                    input.lightingScore * 0.07f +
                    input.poseScore * 0.10f +
                    input.planeScore * 0.05f
            ).coerceIn(0f, 1f)

        val warnings = buildList {
            if (input.cardScore < 0.45f) add("card_weak")
            if (input.poseScore < 0.45f) add("pose_weak")
            if (input.blurScore < 0.35f) add("blur_high")
            if (input.motionScore < 0.35f) add("motion_high")
            if (input.lightingScore < 0.35f) add("lighting_low")
        }

        return FrameQualityResult(totalScore = total, warnings = warnings)
    }
}
