package com.handtryon.render.model

import com.handtryon.domain.FingerAnchor
import com.handtryon.domain.RingPlacement
import com.handtryon.domain.TryOnMode

data class TryOnRenderState(
    val mode: TryOnMode,
    val anchor: FingerAnchor?,
    val placement: RingPlacement,
    val generatedAtMs: Long,
)
