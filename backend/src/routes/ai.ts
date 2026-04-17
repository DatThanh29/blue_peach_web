import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { callAIChat } from "../services/ai.service";

const router = Router();

router.post("/chat", requireAuth, async (req, res) => {
  try {
    const message =
      typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const userId = req.authUser!.userId;

    const aiResponse = await callAIChat({
      userId,
      message,
    });

    return res.json({
      ok: true,
      sessionId: aiResponse.sessionId || null,
      reply: aiResponse.reply || "",
      products: Array.isArray(aiResponse.products) ? aiResponse.products : [],
    });
  } catch (error: any) {
    console.error("[AI_ROUTE_ERROR]", error);

    return res.status(500).json({
      error: error?.message || "AI chat failed",
    });
  }
});

export default router;