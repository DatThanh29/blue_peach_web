package com.handmeasure.measurement

import com.google.common.truth.Truth.assertThat
import com.handmeasure.api.RingSizeTable
import org.junit.Test

class RingSizeMapperTest {
    @Test
    fun nearestForDiameter_returnsClosestEntry() {
        val mapper = TableRingSizeMapper()
        val entry = mapper.nearestForDiameter(RingSizeTable.sampleUsLike(), 18.25)

        assertThat(entry.label).isEqualTo("US 8")
    }
}
