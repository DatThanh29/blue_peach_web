package com.handmeasure.measurement

import com.handmeasure.api.RingSizeEntry
import com.handmeasure.api.RingSizeTable
import com.handmeasure.core.measurement.RingSizeEntry as CoreRingSizeEntry
import com.handmeasure.core.measurement.RingSizeMapper as CoreRingSizeMapper
import com.handmeasure.core.measurement.RingSizeTable as CoreRingSizeTable
import com.handmeasure.core.measurement.TableRingSizeMapper as CoreTableRingSizeMapper

interface RingSizeMapper {
    fun nearestForDiameter(
        table: RingSizeTable,
        diameterMm: Double,
    ): RingSizeEntry
}

class TableRingSizeMapper(
    private val delegate: CoreRingSizeMapper = CoreTableRingSizeMapper(),
) : RingSizeMapper {
    override fun nearestForDiameter(
        table: RingSizeTable,
        diameterMm: Double,
    ): RingSizeEntry = delegate.nearestForDiameter(table.toCore(), diameterMm).toAndroid()
}

private fun RingSizeTable.toCore(): CoreRingSizeTable =
    CoreRingSizeTable(
        name = name,
        entries = entries.map { it.toCore() },
    )

private fun RingSizeEntry.toCore(): CoreRingSizeEntry =
    CoreRingSizeEntry(
        label = label,
        diameterMm = diameterMm,
    )

private fun CoreRingSizeEntry.toAndroid(): RingSizeEntry =
    RingSizeEntry(
        label = label,
        diameterMm = diameterMm,
    )
