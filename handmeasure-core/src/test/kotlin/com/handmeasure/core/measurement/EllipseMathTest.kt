package com.handmeasure.core.measurement

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class EllipseMathTest {
    @Test
    fun equivalentDiameter_matchesExpectedRange() {
        val circumference = EllipseMath.circumferenceFromWidthThickness(widthMm = 18.0, thicknessMm = 14.0)
        val diameter = EllipseMath.equivalentDiameterFromCircumference(circumference)

        assertThat(circumference).isGreaterThan(40.0)
        assertThat(diameter).isGreaterThan(13.0)
        assertThat(diameter).isLessThan(20.0)
    }
}
