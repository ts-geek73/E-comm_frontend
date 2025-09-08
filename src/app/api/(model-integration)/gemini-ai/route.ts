import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  tools: [
    {
      codeExecution: {},
    },
  ],
});

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { prompt } = body;

  const result = await model.generateContent(prompt);
  return new Response(
    JSON.stringify({
      summary: result.response.text(),
    })
  );
}
