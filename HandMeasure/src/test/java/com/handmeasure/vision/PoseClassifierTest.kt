package com.handmeasure.vision

import com.google.common.truth.Truth.assertThat
import com.handmeasure.api.CaptureStep
import org.junit.Test

class PoseClassifierTest {
    private val classifier = PoseClassifier()

    @Test
    fun classify_frontPalm_prefersZDominantNormal() {
        val score =
            classifier.classify(
                CaptureStep.FRONT_PALM,
                PoseSnapshot(normalX = 0.1f, normalY = 0.1f, normalZ = 0.95f),
            )

        assertThat(score).isGreaterThan(0.8f)
    }

    @Test
    fun classify_leftOblique_prefersNegativeXNormal() {
        val score =
            classifier.classify(
                CaptureStep.LEFT_OBLIQUE,
                PoseSnapshot(normalX = -0.85f, normalY = 0.05f, normalZ = 0.25f),
            )

        assertThat(score).isGreaterThan(0.6f)
    }
}
