package com.handmeasure.measurement

object EllipseMath {
    fun circumferenceFromWidthThickness(
        widthMm: Double,
        thicknessMm: Double,
    ): Double = com.handmeasure.core.measurement.EllipseMath.circumferenceFromWidthThickness(widthMm, thicknessMm)

    fun equivalentDiameterFromCircumference(circumferenceMm: Double): Double =
        com.handmeasure.core.measurement.EllipseMath.equivalentDiameterFromCircumference(circumferenceMm)
}
