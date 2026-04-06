package com.handtryon.coreengine

import com.google.common.truth.Truth.assertThat
import com.handtryon.coreengine.model.TryOnAssetSource
import com.handtryon.coreengine.model.TryOnFingerAnchor
import com.handtryon.coreengine.model.TryOnHandPoseSnapshot
import com.handtryon.coreengine.model.TryOnInputQuality
import com.handtryon.coreengine.model.TryOnLandmarkPoint
import com.handtryon.coreengine.model.TryOnMeasurementSnapshot
import com.handtryon.coreengine.model.TryOnMode
import com.handtryon.coreengine.model.TryOnPlacement
import com.handtryon.coreengine.model.TryOnSession
import org.junit.Test

class TryOnSessionResolverPolicyTest {
    private val resolver = TryOnSessionResolverPolicy()
    private val asset = TryOnAssetSource(id = "ring", name = "ring", overlayAssetPath = "ring.png")

    @Test
    fun measured_mode_when_landmark_and_measurement_usable() {
        val session =
            resolver.resolve(
                asset = asset,
                handPose = ringPose(),
                measurement = TryOnMeasurementSnapshot(17.6f, 19f, confidence = 0.8f),
                manualPlacement = null,
                previousSession = null,
                frameWidth = 1080,
                frameHeight = 1920,
            )

        assertThat(session.mode).isEqualTo(TryOnMode.Measured)
        assertThat(session.quality.landmarkUsable).isTrue()
        assertThat(session.quality.measurementUsable).isTrue()
    }

    @Test
    fun fallback_to_manual_when_landmark_missing() {
        val session =
            resolver.resolve(
                asset = asset,
                handPose = null,
                measurement = TryOnMeasurementSnapshot(17.6f, 19f, confidence = 0.8f),
                manualPlacement = null,
                previousSession = null,
                frameWidth = 1080,
                frameHeight = 1920,
            )

        assertThat(session.mode).isEqualTo(TryOnMode.Manual)
        assertThat(session.quality.landmarkUsable).isFalse()
    }

    @Test
    fun reuses_last_good_anchor_within_grace_window() {
        val first =
            resolver.resolve(
                asset = asset,
                handPose = ringPose(timestampMs = 1000L),
                measurement = null,
                manualPlacement = null,
                previousSession = null,
                frameWidth = 1080,
                frameHeight = 1920,
                nowMs = 1000L,
            )

        val second =
            resolver.resolve(
                asset = asset,
                handPose = null,
                measurement = null,
                manualPlacement = null,
                previousSession = first,
                frameWidth = 1080,
                frameHeight = 1920,
                nowMs = 1800L,
            )

        assertThat(second.mode).isEqualTo(TryOnMode.LandmarkOnly)
        assertThat(second.quality.usedLastGoodAnchor).isTrue()
        assertThat(second.anchor).isNotNull()
    }

    @Test
    fun does_not_reuse_last_good_anchor_after_grace_window() {
        resolver.resolve(
            asset = asset,
            handPose = ringPose(timestampMs = 1000L),
            measurement = null,
            manualPlacement = null,
            previousSession = null,
            frameWidth = 1080,
            frameHeight = 1920,
            nowMs = 1000L,
        )

        val second =
            resolver.resolve(
                asset = asset,
                handPose = null,
                measurement = null,
                manualPlacement = null,
                previousSession = null,
                frameWidth = 1080,
                frameHeight = 1920,
                nowMs = 2001L,
            )

        assertThat(second.mode).isEqualTo(TryOnMode.Manual)
        assertThat(second.quality.usedLastGoodAnchor).isFalse()
        assertThat(second.anchor).isNull()
    }

    @Test
    fun uses_manual_placement_in_manual_mode() {
        val manualPlacement = TryOnPlacement(centerX = 321f, centerY = 654f, ringWidthPx = 77f, rotationDegrees = 12f)
        val session =
            resolver.resolve(
                asset = asset,
                handPose = null,
                measurement = null,
                manualPlacement = manualPlacement,
                previousSession = null,
                frameWidth = 1080,
                frameHeight = 1920,
                nowMs = 3000L,
            )

        assertThat(session.mode).isEqualTo(TryOnMode.Manual)
        assertThat(session.placement).isEqualTo(manualPlacement)
    }

    @Test
    fun clamps_large_center_and_rotation_jumps_against_previous_session() {
        val previousPlacement = TryOnPlacement(centerX = 100f, centerY = 100f, ringWidthPx = 100f, rotationDegrees = 0f)
        val previousSession = previousSession(previousPlacement)
        val measured =
            resolver.resolve(
                asset = asset,
                handPose = ringPose(timestampMs = 5000L),
                measurement = TryOnMeasurementSnapshot(equivalentDiameterMm = 17.6f, fingerWidthMm = 19f, confidence = 0.85f, mmPerPx = 0.1f),
                manualPlacement = null,
                previousSession = previousSession,
                frameWidth = 1080,
                frameHeight = 1920,
                nowMs = 5000L,
            )

        assertThat(measured.mode).isEqualTo(TryOnMode.Measured)
        assertThat(measured.placement.centerX).isEqualTo(146f)
        assertThat(measured.placement.centerY).isEqualTo(146f)
        assertThat(measured.placement.ringWidthPx).isAtMost(116f)
        assertThat(measured.placement.rotationDegrees).isEqualTo(14f)
    }

    @Test
    fun uses_now_ms_for_anchor_grace_even_when_pose_timestamp_domain_differs() {
        val first =
            resolver.resolve(
                asset = asset,
                handPose = ringPose(timestampMs = 10L),
                measurement = null,
                manualPlacement = null,
                previousSession = null,
                frameWidth = 1080,
                frameHeight = 1920,
                nowMs = 1_000_000L,
            )

        val second =
            resolver.resolve(
                asset = asset,
                handPose = null,
                measurement = null,
                manualPlacement = null,
                previousSession = first,
                frameWidth = 1080,
                frameHeight = 1920,
                nowMs = 1_000_500L,
            )

        assertThat(second.mode).isEqualTo(TryOnMode.LandmarkOnly)
        assertThat(second.quality.usedLastGoodAnchor).isTrue()
        assertThat(second.anchor).isNotNull()
    }

    @Test
    fun rotation_bias_does_not_accumulate_drift_when_previous_session_exists() {
        val fixedAnchorFactory =
            object : FingerAnchorFactory {
                override fun createAnchor(pose: TryOnHandPoseSnapshot): TryOnFingerAnchor =
                    TryOnFingerAnchor(
                        centerX = 300f,
                        centerY = 400f,
                        angleDegrees = 0f,
                        fingerWidthPx = 100f,
                        confidence = 0.9f,
                        timestampMs = pose.timestampMs,
                    )
            }
        val biasedResolver = TryOnSessionResolverPolicy(fingerAnchorFactory = fixedAnchorFactory)
        val biasedAsset =
            asset.copy(
                id = "biased",
                rotationBiasDeg = 20f,
            )
        val first =
            biasedResolver.resolve(
                asset = biasedAsset,
                handPose = ringPose(timestampMs = 1_000L),
                measurement = null,
                manualPlacement = null,
                previousSession = null,
                frameWidth = 1080,
                frameHeight = 1920,
                nowMs = 1_000L,
            )
        val second =
            biasedResolver.resolve(
                asset = biasedAsset,
                handPose = ringPose(timestampMs = 2_000L),
                measurement = null,
                manualPlacement = null,
                previousSession = first,
                frameWidth = 1080,
                frameHeight = 1920,
                nowMs = 2_000L,
            )

        assertThat(first.mode).isEqualTo(TryOnMode.LandmarkOnly)
        assertThat(second.mode).isEqualTo(TryOnMode.LandmarkOnly)
        assertThat(first.placement.rotationDegrees).isEqualTo(20f)
        assertThat(second.placement.rotationDegrees).isEqualTo(20f)
    }

    private fun ringPose(timestampMs: Long = 1000L): TryOnHandPoseSnapshot {
        val points = MutableList(21) { TryOnLandmarkPoint(400f, 900f) }
        points[13] = TryOnLandmarkPoint(540f, 960f)
        points[14] = TryOnLandmarkPoint(600f, 980f)
        return TryOnHandPoseSnapshot(
            frameWidth = 1080,
            frameHeight = 1920,
            landmarks = points,
            confidence = 0.92f,
            timestampMs = timestampMs,
        )
    }

    private fun previousSession(placement: TryOnPlacement): TryOnSession =
        TryOnSession(
            asset = asset,
            mode = TryOnMode.Manual,
            quality =
                TryOnInputQuality(
                    measurementUsable = false,
                    landmarkUsable = false,
                    measurementConfidence = 0f,
                    landmarkConfidence = 0f,
                    usedLastGoodAnchor = false,
                ),
            anchor = null,
            placement = placement,
            updatedAtMs = 4000L,
        )
}
