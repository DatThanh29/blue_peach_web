package com.handmeasure.measurement

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class FrameQualityScorerTest {
    @Test
    fun score_penalizesWeakCardAndPose() {
        val scorer = FrameQualityScorer()
        val result =
            scorer.score(
                FrameQualityInput(
                    handScore = 0.9f,
                    landmarkScore = 0.9f,
                    ringZoneScore = 0.8f,
                    cardScore = 0.2f,
                    blurScore = 0.8f,
                    motionScore = 0.8f,
                    lightingScore = 0.8f,
                    poseScore = 0.3f,
                    planeScore = 0.7f,
                ),
            )

        assertThat(result.totalScore).isLessThan(0.7f)
        assertThat(result.warnings).contains("card_weak")
        assertThat(result.warnings).contains("pose_weak")
    }
}
