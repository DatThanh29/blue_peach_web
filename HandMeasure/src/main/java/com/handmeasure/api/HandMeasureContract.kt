package com.handmeasure.api

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.result.contract.ActivityResultContract
import com.handmeasure.ui.HandMeasureActivity

class HandMeasureContract : ActivityResultContract<HandMeasureConfig, HandMeasureResult?>() {
    override fun createIntent(context: Context, input: HandMeasureConfig): Intent =
        Intent(context, HandMeasureActivity::class.java)
            .putExtra(HandMeasureActivity.EXTRA_CONFIG, input)

    override fun parseResult(resultCode: Int, intent: Intent?): HandMeasureResult? {
        if (resultCode != Activity.RESULT_OK) return null
        return intent?.getParcelableExtra(HandMeasureActivity.EXTRA_RESULT)
    }
}
