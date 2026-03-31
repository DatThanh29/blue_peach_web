package com.handmeasure.core.measurement

import kotlin.math.PI
import kotlin.math.pow
import kotlin.math.sqrt

object EllipseMath {
    fun circumferenceFromWidthThickness(
        widthMm: Double,
        thicknessMm: Double,
    ): Double {
        val a = widthMm / 2.0
        val b = thicknessMm / 2.0
        if (a <= 0.0 || b <= 0.0) return 0.0
        val h = ((a - b) / (a + b)).pow(2.0)
        return PI * (a + b) * (1.0 + (3.0 * h) / (10.0 + sqrt(4.0 - 3.0 * h)))
    }

    fun equivalentDiameterFromCircumference(circumferenceMm: Double): Double =
        if (circumferenceMm <= 0.0) 0.0 else circumferenceMm / PI
}
