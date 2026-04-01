package com.handtryon.core

import com.handtryon.domain.TryOnSession
import com.handtryon.render.model.TryOnRenderState

data class TryOnSessionResolution(
    val session: TryOnSession,
    val renderState: TryOnRenderState,
)
