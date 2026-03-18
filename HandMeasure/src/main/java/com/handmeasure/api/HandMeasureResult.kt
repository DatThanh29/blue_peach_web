package com.handmeasure.api

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class HandMeasureResult(
    val targetFinger: TargetFinger,
    val fingerWidthMm: Double,
    val fingerThicknessMm: Double,
    val estimatedCircumferenceMm: Double,
    val equivalentDiameterMm: Double,
    val suggestedRingSizeLabel: String,
    val confidenceScore: Float,
    val warnings: List<HandMeasureWarning>,
    val capturedSteps: List<CapturedStepInfo>,
    val debugMetadata: DebugMetadata? = null,
) : Parcelable

@Parcelize
data class CapturedStepInfo(
    val step: CaptureStep,
    val score: Float,
    val poseScore: Float,
    val cardScore: Float,
    val handScore: Float,
) : Parcelable

@Parcelize
data class DebugMetadata(
    val mmPerPxX: Double,
    val mmPerPxY: Double,
    val frontalWidthPx: Double,
    val thicknessSamplesMm: List<Double>,
    val rawNotes: List<String>,
) : Parcelable

@Parcelize
enum class HandMeasureWarning : Parcelable {
    BEST_EFFORT_ESTIMATE,
    LOW_CARD_CONFIDENCE,
    LOW_POSE_CONFIDENCE,
    LOW_LIGHTING,
    HIGH_MOTION,
    HIGH_BLUR,
    THICKNESS_ESTIMATED_FROM_WEAK_ANGLES,
}

@Parcelize
enum class CaptureStep : Parcelable {
    FRONT_PALM,
    LEFT_OBLIQUE,
    RIGHT_OBLIQUE,
    UP_TILT,
    DOWN_TILT,
}
