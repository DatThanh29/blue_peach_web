package com.handmeasure.sample.tryon.data

import android.content.res.AssetManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.handmeasure.sample.tryon.domain.RingProduct
import java.io.IOException

object SingleRingCatalog {
    // TODO: Replace with API/backend/catalog when multi-product flow is implemented.
    val ringProduct =
        RingProduct(
            id = "single_ring_poc_v1",
            name = "POC Ring",
            overlayAssetPath = "tryon/ring_overlay_v1.png",
            sourceAssetFiles =
                listOf(
                    "vn-11134207-7r98o-ltxgkqbixqn365.webp",
                    "vn-11134207-7r98o-lu4bkesich0f3d.webp",
                    "vn-11134207-7r98o-lu76hhpsbcbj78.webp",
                ),
            defaultWidthRatio = 0.16f,
            rotationOffsetDegrees = 0f,
        )
}

class RingAssetLoader(
    private val assetManager: AssetManager,
) {
    fun loadOverlayBitmap(product: RingProduct): Bitmap {
        assetManager.open(product.overlayAssetPath).use {
            return BitmapFactory.decodeStream(it)
                ?: throw IOException("Cannot decode bitmap: ${product.overlayAssetPath}")
        }
    }
}
