package com.handmeasure.api

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class RingSizeEntry(
    val label: String,
    val diameterMm: Double,
) : Parcelable {
    val circumferenceMm: Double
        get() = diameterMm * Math.PI
}

@Parcelize
data class RingSizeTable(
    val name: String,
    val entries: List<RingSizeEntry>,
) : Parcelable {
    init {
        require(entries.isNotEmpty()) { "RingSizeTable must contain at least one entry." }
    }

    companion object {
        fun sampleUsLike(): RingSizeTable =
            RingSizeTable(
                name = "Sample US-like",
                entries =
                    listOf(
                        RingSizeEntry("US 4", 14.86),
                        RingSizeEntry("US 5", 15.70),
                        RingSizeEntry("US 6", 16.51),
                        RingSizeEntry("US 7", 17.35),
                        RingSizeEntry("US 8", 18.19),
                        RingSizeEntry("US 9", 18.89),
                        RingSizeEntry("US 10", 19.84),
                        RingSizeEntry("US 11", 20.68),
                        RingSizeEntry("US 12", 21.49),
                    ),
            )
    }
}
