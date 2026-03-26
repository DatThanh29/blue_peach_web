package com.handmeasure.sample.tryon.ui

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.view.PreviewView
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.handmeasure.api.HandMeasureConfig
import com.handmeasure.api.HandMeasureContract
import com.handmeasure.api.HandMeasureResult
import com.handmeasure.api.QualityThresholds
import com.handmeasure.api.TargetFinger
import com.handmeasure.camera.CameraController
import com.handmeasure.sample.tryon.data.RingAssetLoader
import com.handmeasure.sample.tryon.data.SingleRingCatalog
import com.handmeasure.sample.tryon.domain.RingPlacement
import com.handmeasure.sample.tryon.domain.TryOnMode
import com.handmeasure.sample.tryon.domain.TryOnSession
import com.handmeasure.sample.tryon.render.PreviewCoordinateMapper
import com.handmeasure.sample.tryon.render.RingOverlayRenderer
import com.handmeasure.sample.tryon.render.RingPlacementCalculator
import com.handmeasure.vision.HandDetection
import com.handmeasure.vision.MediaPipeHandLandmarkEngine
import java.io.File
import java.io.FileOutputStream

@Composable
fun TryOnDemoScreen(
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val ringProduct = remember { SingleRingCatalog.ringProduct }
    val ringBitmap =
        remember {
            runCatching { RingAssetLoader(context.assets).loadOverlayBitmap(ringProduct) }.getOrNull()
        }
    val renderer = remember { RingOverlayRenderer() }
    val placementCalculator = remember { RingPlacementCalculator() }
    val previewView = remember { PreviewView(context).apply { scaleType = PreviewView.ScaleType.FIT_CENTER } }
    val cameraController = remember { CameraController(context) }
    val handLandmarkEngine = remember { MediaPipeHandLandmarkEngine(context) }
    var hasCameraPermission by remember { mutableStateOf(false) }
    var latestFrame by remember { mutableStateOf<Bitmap?>(null) }
    var latestDetection by remember { mutableStateOf<HandDetection?>(null) }
    var measurementResult by remember { mutableStateOf<HandMeasureResult?>(null) }
    var manualPlacement by remember { mutableStateOf<RingPlacement?>(null) }
    var overlayWidth by remember { mutableIntStateOf(0) }
    var overlayHeight by remember { mutableIntStateOf(0) }
    var session by remember { mutableStateOf<TryOnSession?>(null) }
    var exportedPath by remember { mutableStateOf<String?>(null) }

    val permissionLauncher =
        rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            hasCameraPermission = granted
        }
    val measureLauncher =
        rememberLauncherForActivityResult(HandMeasureContract()) { result ->
            measurementResult = result
            if (result != null) {
                val updated =
                    buildSession(
                        ringProduct = ringProduct,
                        measurementResult = result,
                        latestDetection = latestDetection,
                        latestFrame = latestFrame,
                        placementCalculator = placementCalculator,
                        manualPlacement = manualPlacement,
                        overlayWidth = overlayWidth,
                        overlayHeight = overlayHeight,
                    )
                session = updated
                if (updated.mode != TryOnMode.Manual) manualPlacement = null
            }
        }

    LaunchedEffect(Unit) {
        hasCameraPermission =
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        if (!hasCameraPermission) {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    DisposableEffect(lifecycleOwner, hasCameraPermission, handLandmarkEngine) {
        if (!hasCameraPermission) {
            onDispose { }
        } else {
            val analyzer =
                TryOnFrameAnalyzer(handLandmarkEngine = handLandmarkEngine) { frame, detection ->
                    ContextCompat.getMainExecutor(context).execute {
                        latestFrame?.recycle()
                        latestFrame = frame
                        latestDetection = detection
                        if (session == null && ringBitmap != null) {
                            session =
                                buildSession(
                                    ringProduct = ringProduct,
                                    measurementResult = measurementResult,
                                    latestDetection = latestDetection,
                                    latestFrame = latestFrame,
                                    placementCalculator = placementCalculator,
                                    manualPlacement = manualPlacement,
                                    overlayWidth = overlayWidth,
                                    overlayHeight = overlayHeight,
                                )
                        }
                    }
                }
            cameraController.bind(
                lifecycleOwner = lifecycleOwner,
                previewView = previewView,
                analyzer = analyzer,
                lensFacing = com.handmeasure.api.LensFacing.BACK,
                onError = {
                    Toast.makeText(context, "Camera bind failed: ${it.message}", Toast.LENGTH_SHORT).show()
                },
            )
            onDispose {
                cameraController.shutdown()
                latestFrame?.recycle()
                latestFrame = null
            }
        }
    }

    DisposableEffect(handLandmarkEngine, ringBitmap) {
        onDispose {
            handLandmarkEngine.close()
            ringBitmap?.recycle()
        }
    }

    val activeSession = session
    val frame = latestFrame
    val transform =
        remember(frame?.width, frame?.height, overlayWidth, overlayHeight) {
            PreviewCoordinateMapper.frameToViewport(
                frameWidth = frame?.width ?: 0,
                frameHeight = frame?.height ?: 0,
                viewportWidth = overlayWidth,
                viewportHeight = overlayHeight,
            )
        }
    val overlayModifier =
        Modifier
            .fillMaxSize()
            .pointerInput(activeSession?.mode, transform.scale) {
                detectTransformGestures { _, pan, zoom, rotation ->
                    if (activeSession?.mode != TryOnMode.Manual) return@detectTransformGestures
                    val currentManual = manualPlacement ?: activeSession.placement
                    val delta = PreviewCoordinateMapper.viewportDeltaToFrame(pan.x, pan.y, transform)
                    val frameWidth = frame?.width ?: overlayWidth.coerceAtLeast(1)
                    val minWidth = 22f
                    val maxWidth = frameWidth * 0.55f
                    val nextPlacement =
                        currentManual.copy(
                            centerX = currentManual.centerX + delta.x,
                            centerY = currentManual.centerY + delta.y,
                            ringWidthPx = (currentManual.ringWidthPx * zoom).coerceIn(minWidth, maxWidth),
                            rotationDegrees = currentManual.rotationDegrees + rotation,
                        )
                    manualPlacement = nextPlacement
                    session = activeSession.copy(mode = TryOnMode.Manual, placement = nextPlacement)
                }
            }

    Box(modifier = modifier.fillMaxSize()) {
        AndroidView(
            factory = { previewView },
            modifier = Modifier.fillMaxSize(),
        )
        Canvas(
            modifier =
                overlayModifier
                    .fillMaxSize()
                    .align(Alignment.Center)
                    .background(androidx.compose.ui.graphics.Color.Transparent)
                    .padding(0.dp),
        ) {
            overlayWidth = size.width.toInt()
            overlayHeight = size.height.toInt()
            if (ringBitmap != null && activeSession != null && frame != null) {
                val mappedPlacement = PreviewCoordinateMapper.placementToViewport(activeSession.placement, transform)
                renderer.drawOverlay(
                    canvas = drawContext.canvas.nativeCanvas,
                    ringBitmap = ringBitmap,
                    placement = mappedPlacement,
                    alpha = 240,
                )
            }
        }

        Column(
            modifier =
                Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .background(
                        color = androidx.compose.ui.graphics.Color(0xAA000000),
                        shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp),
                    )
                    .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text(
                text = "Mode: ${activeSession?.mode.toModeLabel()}",
                color = androidx.compose.ui.graphics.Color.White,
                style = MaterialTheme.typography.titleMedium,
            )
            Text(
                text =
                    "measurement=${activeSession?.quality?.measurementUsable == true} " +
                        "landmark=${activeSession?.quality?.landmarkUsable == true}",
                color = androidx.compose.ui.graphics.Color(0xFFE0E0E0),
                style = MaterialTheme.typography.bodySmall,
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Button(
                    onClick = {
                        val updated =
                            buildSession(
                                ringProduct = ringProduct,
                                measurementResult = measurementResult,
                                latestDetection = latestDetection,
                                latestFrame = latestFrame,
                                placementCalculator = placementCalculator,
                                manualPlacement = manualPlacement,
                                overlayWidth = overlayWidth,
                                overlayHeight = overlayHeight,
                            )
                        session = updated
                        if (updated.mode != TryOnMode.Manual) manualPlacement = null
                    },
                    enabled = ringBitmap != null,
                    modifier = Modifier.weight(1f),
                ) {
                    Text("Thử detect tay")
                }
                Button(
                    onClick = {
                        val currentSession =
                            activeSession
                                ?: buildSession(
                                    ringProduct = ringProduct,
                                    measurementResult = measurementResult,
                                    latestDetection = latestDetection,
                                    latestFrame = latestFrame,
                                    placementCalculator = placementCalculator,
                                    manualPlacement = manualPlacement,
                                    overlayWidth = overlayWidth,
                                    overlayHeight = overlayHeight,
                                )
                        val manual = manualPlacement ?: currentSession.placement
                        manualPlacement = manual
                        session = currentSession.copy(mode = TryOnMode.Manual, placement = manual)
                    },
                    enabled = ringBitmap != null,
                    modifier = Modifier.weight(1f),
                ) {
                    Text("Manual adjust")
                }
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Button(
                    onClick = {
                        measureLauncher.launch(
                            HandMeasureConfig(
                                targetFinger = TargetFinger.RING,
                                qualityThresholds =
                                    QualityThresholds(
                                        autoCaptureScore = 0.85f,
                                        bestCandidateProgressScore = 0.56f,
                                    ),
                            ),
                        )
                    },
                    modifier = Modifier.weight(1f),
                ) {
                    Text("Đo tay")
                }
                Button(
                    onClick = {
                        if (ringBitmap == null || activeSession == null || frame == null) return@Button
                        val rendered =
                            renderer.renderToBitmap(
                                baseFrame = frame,
                                ringBitmap = ringBitmap,
                                placement = activeSession.placement,
                                mode = activeSession.mode,
                            )
                        val file = saveRenderedBitmap(context, rendered.bitmap)
                        exportedPath = file.absolutePath
                        Toast.makeText(context, "Đã export: ${file.name}", Toast.LENGTH_SHORT).show()
                        rendered.bitmap.recycle()
                    },
                    modifier = Modifier.weight(1f),
                ) {
                    Text("Export/capture")
                }
            }
            if (exportedPath != null) {
                Text(
                    text = "Saved: $exportedPath",
                    color = androidx.compose.ui.graphics.Color(0xFFB2FF59),
                    style = MaterialTheme.typography.bodySmall,
                )
            }
            if (!hasCameraPermission) {
                Text(
                    text = "Cần quyền camera để detect landmark.",
                    color = androidx.compose.ui.graphics.Color(0xFFFFAB91),
                    style = MaterialTheme.typography.bodySmall,
                )
            }
        }
    }
}

private fun buildSession(
    ringProduct: com.handmeasure.sample.tryon.domain.RingProduct,
    measurementResult: HandMeasureResult?,
    latestDetection: HandDetection?,
    latestFrame: Bitmap?,
    placementCalculator: RingPlacementCalculator,
    manualPlacement: RingPlacement?,
    overlayWidth: Int,
    overlayHeight: Int,
): TryOnSession {
    val frameWidth = latestFrame?.width ?: overlayWidth.coerceAtLeast(1080)
    val frameHeight = latestFrame?.height ?: overlayHeight.coerceAtLeast(1920)
    return placementCalculator.resolveSession(
        product = ringProduct,
        measurementResult = measurementResult,
        handDetection = latestDetection,
        frameWidth = frameWidth,
        frameHeight = frameHeight,
        manualPlacement = manualPlacement,
    )
}

private fun saveRenderedBitmap(
    context: Context,
    bitmap: Bitmap,
): File {
    val exportDir = File(context.filesDir, "tryon_exports").apply { mkdirs() }
    val file = File(exportDir, "ring_tryon_${System.currentTimeMillis()}.png")
    FileOutputStream(file).use { stream ->
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
    }
    return file
}

private fun TryOnMode?.toModeLabel(): String =
    when (this) {
        TryOnMode.Measured -> "Fit theo đo tay"
        TryOnMode.LandmarkOnly -> "Preview theo landmark"
        TryOnMode.Manual -> "Tự căn chỉnh"
        null -> "Tự căn chỉnh"
    }
