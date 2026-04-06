package com.handtryon.engine

import com.handtryon.coreengine.TryOnSessionResolverPolicy
import com.handtryon.coreengine.model.TryOnEngineResult
import com.handtryon.coreengine.model.toEngineResult
import com.handtryon.engine.model.TryOnEngineRequest

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
        return session.toEngineResult(generatedAtMs = request.nowMs)
    }
}
