// app/api/image-generate/route.ts
import { VertexAI } from "@google-cloud/vertexai";
import fs from "fs";

const creadFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!creadFile) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
}

// read and parse JSON credentials
const raw = fs.readFileSync(creadFile, "utf-8");
const credentials = JSON.parse(raw);

// init VertexAI with googleAuth
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_VERTEX_PROJECT!,
  location: "us-central1",
  googleAuthOptions: {
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  },
});

const imagenModel = vertexAI.getGenerativeModel({
  model: "imagen-3.0-fast-generate-002",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await imagenModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const images =
      result.response.candidates?.flatMap((c) =>
        c.content.parts
          .filter((p) => p.inlineData?.mimeType?.startsWith("image/"))
          .map((p) => p.inlineData?.data)
      ) ?? [];

    return Response.json({ images });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
