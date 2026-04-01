package com.handmeasure.coordinator

import android.graphics.Bitmap
import com.handmeasure.api.TargetFinger
import com.handmeasure.vision.CardDetection
import com.handmeasure.vision.HandDetection

internal class AndroidCoplanarityRuntimeAdapter(
    private val frameSignalEstimator: FrameSignalEstimator,
) : CoplanarityRuntimeAdapter {
    override fun estimate(
        hand: HandDetection?,
        card: CardDetection?,
        frame: Bitmap,
        targetFinger: TargetFinger,
    ): Float =
        frameSignalEstimator.estimateFingerCard2dProximity(
            hand = hand,
            card = card,
            frameWidth = frame.width,
            frameHeight = frame.height,
            targetFinger = targetFinger,
        )
}
