package com.handtryon.engine

import com.handtryon.coreengine.TryOnSessionResolverPolicy
import com.handtryon.coreengine.model.TryOnSession
import com.handtryon.engine.model.TryOnEngineRequest
import com.handtryon.engine.model.TryOnEngineResult
import com.handtryon.engine.model.TryOnEngineRenderState
import com.handtryon.engine.model.TryOnEngineSessionState

internal class TryOnEngine(
    private val resolverPolicy: TryOnSessionResolverPolicy,
) {
    fun resolve(request: TryOnEngineRequest): TryOnEngineResult {
        val session =
            resolverPolicy.resolve(
                asset = request.asset,
                handPose = request.handPose,
                measurement = request.measurement,
                manualPlacement = request.manualPlacement,
                previousSession = request.previousSession,
                frameWidth = request.frameWidth,
                frameHeight = request.frameHeight,
                nowMs = request.nowMs,
            )
        return TryOnEngineResult(
            session = session.toEngineSessionState(),
            renderState = session.toEngineRenderState(generatedAtMs = request.nowMs),
        )
    }
}

private fun TryOnSession.toEngineSessionState(): TryOnEngineSessionState =
    TryOnEngineSessionState(
        asset = asset,
        mode = mode,
        quality = quality,
        anchor = anchor,
        placement = placement,
        updatedAtMs = updatedAtMs,
    )

private fun TryOnSession.toEngineRenderState(generatedAtMs: Long): TryOnEngineRenderState =
    TryOnEngineRenderState(
        mode = mode,
        anchor = anchor,
        placement = placement,
        generatedAtMs = generatedAtMs,
    )
