import { anthropic, gateway, google, openai } from "@/lib";
import { generateText, LanguageModel } from "ai";
import { NextResponse } from "next/server";

const modelMap: Record<string, () => LanguageModel> = {
  openai: () => openai("gpt-4o-mini"),
  claude: () => anthropic("claude-sonnet-4-20250514"),
  gemini: () => google("gemini-1.5-flash"),
  grok: () => gateway("xai/grok-3"),
};

export async function POST(req: Request) {
  const { prompt, provider } = await req.json();

  // pick provider dynamically
  try {
    const model = (modelMap[provider] ?? modelMap["openai"])();

    const { text } = await generateText({
      model,
      prompt,
    });

    return NextResponse.json({ text, model });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error });
  }
}
