package com.handmeasure.coordinator

import android.graphics.Bitmap
import com.handmeasure.core.session.SessionCardDiagnostics
import com.handmeasure.vision.CardDetection
import com.handmeasure.vision.ReferenceCardDetector

internal class AndroidCardRuntimeAdapter(
    private val referenceCardDetector: ReferenceCardDetector,
) : CardRuntimeAdapter {
    override fun detect(frame: Bitmap): CardDetection? = referenceCardDetector.detect(frame)

    override fun toCardDiagnostics(card: CardDetection): SessionCardDiagnostics =
        SessionCardDiagnostics(
            coverageRatio = card.coverageRatio,
            aspectResidual = card.aspectResidual,
            rectangularityScore = card.rectangularityScore,
            edgeSupportScore = card.edgeSupportScore,
            rectificationConfidence = card.rectificationConfidence,
        )
}
