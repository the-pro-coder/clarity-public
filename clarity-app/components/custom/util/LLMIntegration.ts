"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export default async function PromptModel(
  model_instructions: string,
  message: string,
  model: string = "xiaomi/mimo-v2-flash:free"
) {
  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: model_instructions,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });
  return completion.choices[0].message;
}
