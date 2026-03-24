package com.handmeasure.sample

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.handmeasure.api.HandMeasureConfig
import com.handmeasure.api.HandMeasureContract
import com.handmeasure.api.HandMeasureResult

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    var result by remember { mutableStateOf<HandMeasureResult?>(null) }
                    val launcher =
                        rememberLauncherForActivityResult(HandMeasureContract()) { output ->
                            result = output
                        }

                    Column(
                        modifier = Modifier.fillMaxSize().padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
                    ) {
                        Button(onClick = { launcher.launch(HandMeasureConfig()) }) {
                            Text("Start hand measure")
                        }
                        Text(
                            text =
                                if (result == null) {
                                    "No result yet"
                                } else {
                                    val diameter = "%.2f".format(result!!.equivalentDiameterMm)
                                    val confidence = "%.2f".format(result!!.confidenceScore)
                                    "Ring: ${result!!.suggestedRingSizeLabel} | diameter=$diameter mm | confidence=$confidence"
                                },
                        )
                    }
                }
            }
        }
    }
}
