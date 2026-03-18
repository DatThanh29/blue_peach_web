package com.handmeasure.measurement

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class EllipseMathTest {
    @Test
    fun circumferenceFromWidthThickness_matchesStableApproximation() {
        val circumference = EllipseMath.circumferenceFromWidthThickness(widthMm = 18.0, thicknessMm = 14.0)
        val diameter = EllipseMath.equivalentDiameterFromCircumference(circumference)

        assertThat(circumference).isWithin(0.2).of(50.35)
        assertThat(diameter).isWithin(0.2).of(16.03)
    }
}
