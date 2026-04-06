package com.handtryon.coreengine

import com.google.common.truth.Truth.assertThat
import com.handtryon.coreengine.model.TryOnAssetSource
import com.handtryon.coreengine.model.TryOnFingerAnchor
import com.handtryon.coreengine.model.TryOnInputQuality
import com.handtryon.coreengine.model.TryOnMode
import com.handtryon.coreengine.model.TryOnPlacement
import com.handtryon.coreengine.model.TryOnSession
import com.handtryon.coreengine.model.toEngineResult
import org.junit.Test

class TryOnEngineStateProjectionTest {
    @Test
    fun toEngineResult_usesSessionUpdatedAtAsDefaultRenderTimestamp() {
        val session = sampleSession(updatedAtMs = 1200L)

        val result = session.toEngineResult()

        assertThat(result.session.updatedAtMs).isEqualTo(1200L)
        assertThat(result.renderState.generatedAtMs).isEqualTo(1200L)
        assertThat(result.renderState.mode).isEqualTo(session.mode)
        assertThat(result.renderState.placement).isEqualTo(session.placement)
    }

    @Test
    fun toEngineResult_allowsExplicitRenderTimestampOverride() {
        val session = sampleSession(updatedAtMs = 1200L)

        val result = session.toEngineResult(generatedAtMs = 2500L)

        assertThat(result.session.updatedAtMs).isEqualTo(1200L)
        assertThat(result.renderState.generatedAtMs).isEqualTo(2500L)
        assertThat(result.session.anchor).isEqualTo(session.anchor)
        assertThat(result.renderState.anchor).isEqualTo(session.anchor)
    }

    private fun sampleSession(updatedAtMs: Long): TryOnSession =
        TryOnSession(
            asset = TryOnAssetSource(id = "ring", name = "ring", overlayAssetPath = "ring.png"),
            mode = TryOnMode.Measured,
            quality =
                TryOnInputQuality(
                    measurementUsable = true,
                    landmarkUsable = true,
                    measurementConfidence = 0.9f,
                    landmarkConfidence = 0.95f,
                    usedLastGoodAnchor = false,
                ),
            anchor =
                TryOnFingerAnchor(
                    centerX = 320f,
                    centerY = 480f,
                    angleDegrees = 12f,
                    fingerWidthPx = 88f,
                    confidence = 0.93f,
                    timestampMs = updatedAtMs,
                ),
            placement = TryOnPlacement(centerX = 321f, centerY = 481f, ringWidthPx = 90f, rotationDegrees = 11f),
            updatedAtMs = updatedAtMs,
        )
}
