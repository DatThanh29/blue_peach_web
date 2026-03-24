package com.handmeasure.vision

import com.handmeasure.coordinator.PoseTarget
import kotlin.math.abs
import kotlin.math.sqrt

enum class PoseMatchLevel {
    CORRECT,
    ALMOST_CORRECT,
    WRONG,
}

enum class PoseGuidanceAction {
    FRAME_HAND_CLEARER,
    ROTATE_LEFT_MORE,
    ROTATE_RIGHT_MORE,
    TILT_UP_MORE,
    TILT_DOWN_MORE,
    FACE_PALM_TO_CAMERA,
    HOLD_STEADY,
}

data class PoseEvaluation(
    val rawScore: Float,
    val smoothedScore: Float,
    val level: PoseMatchLevel,
    val guidanceAction: PoseGuidanceAction?,
)

data class PoseSnapshot(
    val normalX: Float,
    val normalY: Float,
    val normalZ: Float,
)

class PoseClassifier {
    private val recentScores = ArrayDeque<Float>()
    private val maxHistory = 6
    private var lastStableScore: Float = 0f

    fun reset() {
        recentScores.clear()
        lastStableScore = 0f
    }

    fun classify(target: PoseTarget, handDetection: HandDetection): Float {
        val snapshot = extractPalmNormal(handDetection) ?: return 0f
        return classify(target, snapshot)
    }

    fun classify(target: PoseTarget, snapshot: PoseSnapshot): Float {
        val norm = normalize(snapshot)
        val dot = norm.normalX * target.nx + norm.normalY * target.ny + norm.normalZ * target.nz
        return ((dot + 1f) / 2f).coerceIn(0f, 1f)
    }

    fun evaluate(target: PoseTarget, handDetection: HandDetection): PoseEvaluation {
        val snapshot = extractPalmNormal(handDetection)
        val rawScore = if (snapshot == null) 0f else classify(target, snapshot)
        val smoothed = updateSmoothedScore(rawScore)
        val level =
            when {
                smoothed >= 0.72f -> PoseMatchLevel.CORRECT
                smoothed >= 0.5f -> PoseMatchLevel.ALMOST_CORRECT
                else -> PoseMatchLevel.WRONG
            }
        return PoseEvaluation(
            rawScore = rawScore,
            smoothedScore = smoothed,
            level = level,
            guidanceAction = buildGuidanceAction(target, snapshot, level),
        )
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

    private fun normalize(snapshot: PoseSnapshot): PoseSnapshot {
        val mag = sqrt(snapshot.normalX * snapshot.normalX + snapshot.normalY * snapshot.normalY + snapshot.normalZ * snapshot.normalZ).coerceAtLeast(1e-6f)
        return PoseSnapshot(snapshot.normalX / mag, snapshot.normalY / mag, snapshot.normalZ / mag)
    }

    private fun updateSmoothedScore(rawScore: Float): Float {
        recentScores.addLast(rawScore)
        while (recentScores.size > maxHistory) {
            recentScores.removeFirst()
        }
        val average = recentScores.average().toFloat()
        val hysteresis = if (average < lastStableScore) 0.85f else 0.65f
        lastStableScore = (lastStableScore * hysteresis + average * (1f - hysteresis)).coerceIn(0f, 1f)
        return lastStableScore
    }

    private fun buildGuidanceAction(
        target: PoseTarget,
        snapshot: PoseSnapshot?,
        level: PoseMatchLevel,
    ): PoseGuidanceAction? {
        if (level == PoseMatchLevel.CORRECT) return null
        if (snapshot == null) return PoseGuidanceAction.FRAME_HAND_CLEARER
        val aligned = normalize(snapshot)
        val dot = aligned.normalX * target.nx + aligned.normalY * target.ny + aligned.normalZ * target.nz
        if (dot < 0.45f) {
            val dx = aligned.normalX - target.nx
            val dy = aligned.normalY - target.ny
            return when {
                dx > 0.12f -> PoseGuidanceAction.ROTATE_RIGHT_MORE
                dx < -0.12f -> PoseGuidanceAction.ROTATE_LEFT_MORE
                dy > 0.12f -> PoseGuidanceAction.TILT_DOWN_MORE
                dy < -0.12f -> PoseGuidanceAction.TILT_UP_MORE
                else -> PoseGuidanceAction.HOLD_STEADY
            }
        }
        return PoseGuidanceAction.HOLD_STEADY
    }
}
