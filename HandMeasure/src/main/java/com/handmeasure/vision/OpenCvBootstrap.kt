package com.handmeasure.vision

object OpenCvBootstrap {
    @Volatile private var initialized = false

    fun ensureLoaded(): Boolean {
        if (initialized) return true
        return try {
            runCatching { System.loadLibrary("opencv_java4") }
                .recoverCatching { System.loadLibrary("opencv_java490") }
                .getOrThrow()
            initialized = true
            true
        } catch (_: Throwable) {
            false
        }
    }
}
