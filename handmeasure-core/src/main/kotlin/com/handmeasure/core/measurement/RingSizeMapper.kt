package com.handmeasure.core.measurement

import kotlin.math.abs

interface RingSizeMapper {
    fun nearestForDiameter(
        table: RingSizeTable,
        diameterMm: Double,
    ): RingSizeEntry
}

class TableRingSizeMapper : RingSizeMapper {
    override fun nearestForDiameter(
        table: RingSizeTable,
        diameterMm: Double,
    ): RingSizeEntry = table.entries.minBy { abs(it.diameterMm - diameterMm) }
}
