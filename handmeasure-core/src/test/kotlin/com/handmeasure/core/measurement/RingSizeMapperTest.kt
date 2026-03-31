package com.handmeasure.core.measurement

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class RingSizeMapperTest {
    @Test
    fun nearestForDiameter_returnsClosestEntry() {
        val mapper = TableRingSizeMapper()
        val table =
            RingSizeTable(
                name = "Sample US-like",
                entries =
                    listOf(
                        RingSizeEntry("US 6", 16.51),
                        RingSizeEntry("US 7", 17.35),
                        RingSizeEntry("US 8", 18.19),
                    ),
            )
        val entry = mapper.nearestForDiameter(table, 17.4)

        assertThat(entry.label).isEqualTo("US 7")
    }
}
