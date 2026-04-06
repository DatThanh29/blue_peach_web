package com.handmeasure.sample.tryon.model

import com.handmeasure.api.DebugMetadata
import com.handmeasure.api.HandMeasureResult
import com.handmeasure.api.TargetFinger
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class TryOnDemoHandoffTest {
    @Test
    fun resolveDemoHandoff_prefersLiveResult_whenAvailable() {
        val result = demoResult(confidence = 0.82f, ringSize = "US 7")

        val handoff = resolveDemoHandoff(result = result, allowSimulatedFallback = true)

        assertEquals("Live HandMeasure result", handoff?.sourceLabel)
        assertTrue(handoff?.summary?.contains("US 7") == true)
    }

    @Test
    fun resolveDemoHandoff_usesSimulatedFallback_whenAllowedAndMissingResult() {
        val handoff = resolveDemoHandoff(result = null, allowSimulatedFallback = true)

        assertEquals("Simulated handoff", handoff?.sourceLabel)
    }

    @Test
    fun resolveDemoHandoff_returnsNull_whenNoResultAndFallbackDisabled() {
        val handoff = resolveDemoHandoff(result = null, allowSimulatedFallback = false)

        assertNull(handoff)
    }

    @Test
    fun handoffFromHandMeasureResult_mapsLiveMeasurementFields() {
        val result =
            demoResult(
                equivalentDiameterMm = 16.8,
                fingerWidthMm = 18.4,
                confidence = 0.86f,
                ringSize = "US 6.5",
                debugMetadata =
                    DebugMetadata(
                        mmPerPxX = 0.22,
                        mmPerPxY = 0.21,
                        frontalWidthPx = 73.0,
                        thicknessSamplesMm = listOf(13.9, 14.1),
                        rawNotes = emptyList(),
                    ),
            )

        val handoff = handoffFromHandMeasureResult(result)

        assertEquals("Live HandMeasure result", handoff.sourceLabel)
        assertEquals(16.8f, handoff.snapshot.equivalentDiameterMm)
        assertEquals(18.4f, handoff.snapshot.fingerWidthMm)
        assertEquals(0.86f, handoff.snapshot.confidence)
        assertEquals(0.22f, handoff.snapshot.mmPerPx)
        assertTrue(handoff.snapshot.usable)
        assertTrue(handoff.summary.contains("US 6.5"))
    }

    @Test
    fun handoffFromHandMeasureResult_marksLowConfidenceAsNotUsable() {
        val result = demoResult(confidence = 0.24f)

        val handoff = handoffFromHandMeasureResult(result)

        assertFalse(handoff.snapshot.usable)
    }

    @Test
    fun sampleTryOnDemoHandoff_isUsableAndDeterministic() {
        val handoff = sampleTryOnDemoHandoff()

        assertEquals("Simulated handoff", handoff.sourceLabel)
        assertEquals(16.2f, handoff.snapshot.equivalentDiameterMm)
        assertEquals(18.0f, handoff.snapshot.fingerWidthMm)
        assertEquals(0.75f, handoff.snapshot.confidence)
        assertTrue(handoff.snapshot.usable)
    }

    private fun demoResult(
        equivalentDiameterMm: Double = 16.0,
        fingerWidthMm: Double = 18.0,
        confidence: Float = 0.75f,
        ringSize: String = "US 6",
        debugMetadata: DebugMetadata? = null,
    ): HandMeasureResult =
        HandMeasureResult(
            targetFinger = TargetFinger.RING,
            fingerWidthMm = fingerWidthMm,
            fingerThicknessMm = 14.0,
            estimatedCircumferenceMm = 50.3,
            equivalentDiameterMm = equivalentDiameterMm,
            suggestedRingSizeLabel = ringSize,
            confidenceScore = confidence,
            warnings = emptyList(),
            capturedSteps = emptyList(),
            debugMetadata = debugMetadata,
        )
}
