package com.handmeasure.measurement

import com.handmeasure.api.RingSizeEntry
import com.handmeasure.api.RingSizeTable
import kotlin.math.abs

interface RingSizeMapper {
    fun nearestForDiameter(table: RingSizeTable, diameterMm: Double): RingSizeEntry
}

class TableRingSizeMapper : RingSizeMapper {
    override fun nearestForDiameter(table: RingSizeTable, diameterMm: Double): RingSizeEntry =
        table.entries.minBy { abs(it.diameterMm - diameterMm) }
}
