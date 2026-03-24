package com.handmeasure.coordinator

data class PoseTarget(
    val nx: Float,
    val ny: Float,
    val nz: Float,
    val tolerance: Float = 0.25f,
)
