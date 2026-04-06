package com.handtryon.coreengine

import com.google.common.truth.Truth.assertThat
import com.handtryon.coreengine.model.TryOnFingerAnchor
import com.handtryon.coreengine.model.TryOnPlacement
import org.junit.Test

class PlacementValidationPolicyTest {
    private val validator = PlacementValidationPolicy()

    @Test
    fun flags_unreasonable_width_ratio() {
        val result =
            validator.validate(
                placement = TryOnPlacement(centerX = 100f, centerY = 100f, ringWidthPx = 900f, rotationDegrees = 0f),
                anchor = null,
                previousPlacement = null,
                frameWidth = 1080,
            )
        assertThat(result.isPlacementUsable).isFalse()
        assertThat(result.notes).contains("width_ratio_out_of_range")
    }

    @Test
    fun flags_large_distance_from_anchor() {
        val result =
            validator.validate(
                placement = TryOnPlacement(centerX = 250f, centerY = 250f, ringWidthPx = 60f, rotationDegrees = 0f),
                anchor =
                    TryOnFingerAnchor(
                        centerX = 40f,
                        centerY = 40f,
                        angleDegrees = 0f,
                        fingerWidthPx = 50f,
                        confidence = 0.9f,
                        timestampMs = 1000L,
                    ),
                previousPlacement = null,
                frameWidth = 1080,
            )

        assertThat(result.isPlacementUsable).isFalse()
        assertThat(result.notes).contains("far_from_anchor")
    }

    @Test
    fun flags_large_rotation_jump() {
        val result =
            validator.validate(
                placement = TryOnPlacement(centerX = 100f, centerY = 100f, ringWidthPx = 80f, rotationDegrees = 45f),
                anchor = null,
                previousPlacement = TryOnPlacement(centerX = 100f, centerY = 100f, ringWidthPx = 80f, rotationDegrees = 0f),
                frameWidth = 1080,
            )

        assertThat(result.isPlacementUsable).isFalse()
        assertThat(result.notes).contains("rotation_jump_high")
    }

    @Test
    fun accepts_stable_placement() {
        val result =
            validator.validate(
                placement = TryOnPlacement(centerX = 300f, centerY = 400f, ringWidthPx = 90f, rotationDegrees = 8f),
                anchor =
                    TryOnFingerAnchor(
                        centerX = 305f,
                        centerY = 405f,
                        angleDegrees = 8f,
                        fingerWidthPx = 90f,
                        confidence = 0.9f,
                        timestampMs = 1000L,
                    ),
                previousPlacement = TryOnPlacement(centerX = 299f, centerY = 399f, ringWidthPx = 91f, rotationDegrees = 7f),
                frameWidth = 1080,
            )

        assertThat(result.isPlacementUsable).isTrue()
        assertThat(result.notes).isEmpty()
    }
}
