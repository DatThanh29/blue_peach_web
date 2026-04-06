package com.handmeasure.sample.measure.ui

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.handmeasure.api.HandMeasureConfig
import com.handmeasure.api.HandMeasureContract
import com.handmeasure.api.HandMeasureResult
import com.handmeasure.api.QualityThresholds
import com.handmeasure.api.TargetFinger

@Composable
fun HandMeasureDemoScreen(
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
    var latestSummary by rememberSaveable { mutableStateOf("No result yet.") }
    var latestWarnings by rememberSaveable { mutableStateOf("Warnings: none") }

    val launcher =
        rememberLauncherForActivityResult(HandMeasureContract()) { result ->
            if (result == null) {
                latestSummary = "No result returned (cancelled or exited early)."
                latestWarnings = "Warnings: n/a"
            } else {
                latestSummary = result.toSummaryText()
                latestWarnings =
                    if (result.warnings.isEmpty()) {
                        "Warnings: none"
                    } else {
                        "Warnings: ${result.warnings.joinToString()}"
                    }
            }
        }

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(
            text = "HandMeasure Demo",
            style = MaterialTheme.typography.headlineSmall,
        )
        Text(
            text = "Uses stable demo defaults for ring finger measurement.",
            style = MaterialTheme.typography.bodyMedium,
        )
        Button(
            onClick = { launcher.launch(defaultDemoMeasureConfig()) },
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Start HandMeasure")
        }
        Button(onClick = onBack, modifier = Modifier.fillMaxWidth()) {
            Text("Back to Demo Landing")
        }
        Text(text = latestSummary, style = MaterialTheme.typography.bodyMedium)
        Text(text = latestWarnings, style = MaterialTheme.typography.bodySmall)
    }
}

fun defaultDemoMeasureConfig(): HandMeasureConfig =
    HandMeasureConfig(
        targetFinger = TargetFinger.RING,
        qualityThresholds =
            QualityThresholds(
                autoCaptureScore = 0.80f,
                bestCandidateProgressScore = 0.52f,
            ),
    )

private fun HandMeasureResult.toSummaryText(): String =
    "Size ${suggestedRingSizeLabel}, diameter ${"%.2f".format(equivalentDiameterMm)}mm, confidence ${"%.2f".format(confidenceScore)}"
