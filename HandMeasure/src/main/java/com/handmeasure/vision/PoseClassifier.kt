package com.handmeasure.vision

import com.handmeasure.api.CaptureStep
import kotlin.math.abs
import kotlin.math.sqrt

data class PoseSnapshot(
    val normalX: Float,
    val normalY: Float,
    val normalZ: Float,
)

class PoseClassifier {
    fun classify(step: CaptureStep, handDetection: HandDetection): Float {
        val snapshot = extractPalmNormal(handDetection) ?: return 0f
        return classify(step, snapshot)
    }

    fun classify(step: CaptureStep, snapshot: PoseSnapshot): Float {
        val nx = snapshot.normalX
        val ny = snapshot.normalY
        val nz = snapshot.normalZ
        return when (step) {
            CaptureStep.FRONT_PALM -> axisDominanceScore(abs(nz), abs(nx), abs(ny))
            CaptureStep.LEFT_OBLIQUE -> signedAxisScore(-nx, abs(ny), abs(nz))
            CaptureStep.RIGHT_OBLIQUE -> signedAxisScore(nx, abs(ny), abs(nz))
            CaptureStep.UP_TILT -> signedAxisScore(-ny, abs(nx), abs(nz))
            CaptureStep.DOWN_TILT -> signedAxisScore(ny, abs(nx), abs(nz))
        }
    }

    fun extractPalmNormal(handDetection: HandDetection): PoseSnapshot? {
        val world = handDetection.worldLandmarks
        if (world.size < 18) return null
        val wrist = world[0]
        val indexMcp = world[5]
        val pinkyMcp = world[17]
        val ax = indexMcp.x - wrist.x
        val ay = indexMcp.y - wrist.y
        val az = indexMcp.z - wrist.z
        val bx = pinkyMcp.x - wrist.x
        val by = pinkyMcp.y - wrist.y
        val bz = pinkyMcp.z - wrist.z
        val nx = ay * bz - az * by
        val ny = az * bx - ax * bz
        val nz = ax * by - ay * bx
        val mag = sqrt(nx * nx + ny * ny + nz * nz).coerceAtLeast(1e-6f)
        return PoseSnapshot(nx / mag, ny / mag, nz / mag)
    }

    private fun axisDominanceScore(primary: Float, secondaryA: Float, secondaryB: Float): Float {
        val dominance = (primary - maxOf(secondaryA, secondaryB)).coerceAtLeast(0f)
        return (primary * 0.75f + dominance * 0.25f).coerceIn(0f, 1f)
    }

    private fun signedAxisScore(primarySigned: Float, secondaryA: Float, secondaryB: Float): Float {
        val primary = primarySigned.coerceAtLeast(0f)
        val dominance = (primary - maxOf(secondaryA, secondaryB)).coerceAtLeast(0f)
        return (primary * 0.75f + dominance * 0.25f).coerceIn(0f, 1f)
    }
}
