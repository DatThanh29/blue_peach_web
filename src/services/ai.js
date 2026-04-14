import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function askAI(message) {

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "Bạn là chatbot tư vấn cho cửa hàng trang sức bạc Blue Peach. Trả lời thân thiện và giúp khách chọn sản phẩm."
      },
      {
        role: "user",
        content: message
      }
    ]
  });

  return chatCompletion.choices[0].message.content;
}