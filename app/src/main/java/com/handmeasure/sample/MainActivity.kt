package com.handmeasure.sample

import android.os.Bundle
import androidx.activity.compose.BackHandler
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.handmeasure.sample.measure.ui.HandMeasureDemoScreen
import com.handmeasure.sample.tryon.ui.TryOnDemoScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    DemoHostScreen()
                }
            }
        }
    }
}

private enum class DemoRoute {
    Landing,
    MeasureOnly,
    TryOnOnly,
    MeasureThenTryOn,
}

@Composable
private fun DemoHostScreen(modifier: Modifier = Modifier) {
    var route by rememberSaveable { mutableStateOf(DemoRoute.Landing) }

    when (route) {
        DemoRoute.Landing -> DemoLandingScreen(
            onOpenMeasure = { route = DemoRoute.MeasureOnly },
            onOpenTryOn = { route = DemoRoute.TryOnOnly },
            onOpenMeasureThenTryOn = { route = DemoRoute.MeasureThenTryOn },
            modifier = modifier,
        )
        DemoRoute.MeasureOnly -> {
            BackHandler { route = DemoRoute.Landing }
            HandMeasureDemoScreen(
                onBack = { route = DemoRoute.Landing },
                modifier = modifier,
            )
        }
        DemoRoute.TryOnOnly -> {
            BackHandler { route = DemoRoute.Landing }
            TryOnDemoScreen(
                onBack = { route = DemoRoute.Landing },
                autoLaunchMeasureOnStart = false,
                modifier = modifier,
            )
        }
        DemoRoute.MeasureThenTryOn -> {
            BackHandler { route = DemoRoute.Landing }
            TryOnDemoScreen(
                onBack = { route = DemoRoute.Landing },
                autoLaunchMeasureOnStart = true,
                modifier = modifier,
            )
        }
    }
}

@Composable
private fun DemoLandingScreen(
    onOpenMeasure: () -> Unit,
    onOpenTryOn: () -> Unit,
    onOpenMeasureThenTryOn: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier =
            modifier
                .fillMaxSize()
                .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(
            text = "HandMeasure + HandTryOn Internal Demo",
            style = MaterialTheme.typography.headlineSmall,
        )
        Text(
            text = "Choose a demo path:",
            style = MaterialTheme.typography.bodyMedium,
        )
        Button(onClick = onOpenMeasure, modifier = Modifier.fillMaxWidth()) {
            Text("Launch HandMeasure Demo")
        }
        Button(onClick = onOpenTryOn, modifier = Modifier.fillMaxWidth()) {
            Text("Launch HandTryOn Demo")
        }
        Button(onClick = onOpenMeasureThenTryOn, modifier = Modifier.fillMaxWidth()) {
            Text("Launch Measure -> TryOn Flow")
        }
        Text(
            text = "Measure -> TryOn auto-starts measurement and applies a simulated handoff if measurement is canceled.",
            style = MaterialTheme.typography.bodySmall,
        )
    }
}
