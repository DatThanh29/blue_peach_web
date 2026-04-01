package com.handtryon.engine.model

import com.handtryon.coreengine.model.TryOnAssetSource
import com.handtryon.coreengine.model.TryOnFingerAnchor
import com.handtryon.coreengine.model.TryOnHandPoseSnapshot
import com.handtryon.coreengine.model.TryOnInputQuality
import com.handtryon.coreengine.model.TryOnMeasurementSnapshot
import com.handtryon.coreengine.model.TryOnMode
import com.handtryon.coreengine.model.TryOnPlacement
import com.handtryon.coreengine.model.TryOnSession

internal data class TryOnEngineRequest(
    val asset: TryOnAssetSource,
    val handPose: TryOnHandPoseSnapshot?,
    val measurement: TryOnMeasurementSnapshot?,
    val manualPlacement: TryOnPlacement?,
    val previousSession: TryOnSession?,
    val frameWidth: Int,
    val frameHeight: Int,
    val nowMs: Long,
)

internal data class TryOnEngineResult(
    val session: TryOnEngineSessionState,
    val renderState: TryOnEngineRenderState,
)

internal data class TryOnEngineSessionState(
    val asset: TryOnAssetSource,
    val mode: TryOnMode,
    val quality: TryOnInputQuality,
    val anchor: TryOnFingerAnchor?,
    val placement: TryOnPlacement,
    val updatedAtMs: Long,
)

internal data class TryOnEngineRenderState(
    val mode: TryOnMode,
    val anchor: TryOnFingerAnchor?,
    val placement: TryOnPlacement,
    val generatedAtMs: Long,
)
