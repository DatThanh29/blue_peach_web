package com.handtryon.coreengine.model

data class TryOnEngineResult(
    val session: TryOnEngineSessionState,
    val renderState: TryOnEngineRenderState,
)

data class TryOnEngineSessionState(
    val asset: TryOnAssetSource,
    val mode: TryOnMode,
    val quality: TryOnInputQuality,
    val anchor: TryOnFingerAnchor?,
    val placement: TryOnPlacement,
    val updatedAtMs: Long,
)

data class TryOnEngineRenderState(
    val mode: TryOnMode,
    val anchor: TryOnFingerAnchor?,
    val placement: TryOnPlacement,
    val generatedAtMs: Long,
)

fun TryOnSession.toEngineResult(generatedAtMs: Long = updatedAtMs): TryOnEngineResult =
    TryOnEngineResult(
        session =
            TryOnEngineSessionState(
                asset = asset,
                mode = mode,
                quality = quality,
                anchor = anchor,
                placement = placement,
                updatedAtMs = updatedAtMs,
            ),
        renderState =
            TryOnEngineRenderState(
                mode = mode,
                anchor = anchor,
                placement = placement,
                generatedAtMs = generatedAtMs,
            ),
    )
