import { GoogleGenerativeAIError } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("🚀 ~ POST ~ POST:");
  try {
    const { question } = await req.json();

    const echoTool = new DynamicTool({
      name: "echo",
      description: "Repeats whatever text you send",
      func: async (input: string) => `Echo: ${input}`,
    });

    // 1. Use Gemini instead of OpenAI
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash", // or gemini-1.5-pro
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 2. Add a calculator tool
    const tools = [echoTool];

    // 3. Create the agent executor
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "zero-shot-react-description",
    });

    // 4. Ask the agent your question
    const result = await executor.run(question);
    console.log("🚀 ~ POST ~ result:", result);

    return NextResponse.json({ result });
  } catch (err: unknown) {
    console.error("Agent error:", err);

    if (err instanceof GoogleGenerativeAIError) {
      // This is a proper Gemini API error
      console.log("🚀 ~ POST ~ error:", )
      return NextResponse.json(
        {
          error: err.message,
          status: err.cause,
          details: err.stack,
        },
        { status: 500 }
      );
    }

    if (err instanceof Error) {
      // Normal JS error
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    // Fallback for unexpected things
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
