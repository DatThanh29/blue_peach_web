package com.handtryon.coreengine

import com.google.common.truth.Truth.assertThat
import com.handtryon.coreengine.model.TryOnPlacement
import org.junit.Test

class TemporalPlacementSmootherPolicyTest {
    private val smoother = TemporalPlacementSmootherPolicy()

    @Test
    fun smoothes_toward_raw_values() {
        val previous = TryOnPlacement(centerX = 100f, centerY = 100f, ringWidthPx = 80f, rotationDegrees = 5f)
        val raw = TryOnPlacement(centerX = 200f, centerY = 180f, ringWidthPx = 120f, rotationDegrees = 35f)
        val smoothed = smoother.smooth(raw = raw, previous = previous, deltaMs = 50L)

        assertThat(smoothed.centerX).isGreaterThan(previous.centerX)
        assertThat(smoothed.centerX).isLessThan(raw.centerX)
        assertThat(smoothed.ringWidthPx).isGreaterThan(previous.ringWidthPx)
        assertThat(smoothed.ringWidthPx).isLessThan(raw.ringWidthPx)
    }

    @Test
    fun returns_raw_when_no_previous_sample() {
        val raw = TryOnPlacement(centerX = 40f, centerY = 65f, ringWidthPx = 72f, rotationDegrees = 12f)

        val smoothed = smoother.smooth(raw = raw, previous = null, deltaMs = 30L)

        assertThat(smoothed).isEqualTo(raw)
    }

    @Test
    fun alpha_is_clamped_by_delta_time_window() {
        val previous = TryOnPlacement(centerX = 0f, centerY = 0f, ringWidthPx = 100f, rotationDegrees = 0f)
        val raw = TryOnPlacement(centerX = 100f, centerY = 100f, ringWidthPx = 200f, rotationDegrees = 100f)

        val minDeltaSmoothed = smoother.smooth(raw = raw, previous = previous, deltaMs = 1L)
        val maxDeltaSmoothed = smoother.smooth(raw = raw, previous = previous, deltaMs = 500L)

        assertThat(minDeltaSmoothed.centerX).isEqualTo(18f)
        assertThat(maxDeltaSmoothed.centerX).isEqualTo(42f)
    }

    @Test
    fun handles_rotation_wraparound_on_shortest_path() {
        val previous = TryOnPlacement(centerX = 0f, centerY = 0f, ringWidthPx = 90f, rotationDegrees = 175f)
        val raw = TryOnPlacement(centerX = 0f, centerY = 0f, ringWidthPx = 90f, rotationDegrees = -176f)

        val smoothed = smoother.smooth(raw = raw, previous = previous, deltaMs = 90L)

        assertThat(smoothed.rotationDegrees).isGreaterThan(175f)
        assertThat(smoothed.rotationDegrees).isLessThan(180f)
    }
}
