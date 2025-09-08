import axios from "axios";

export const sendChatGPTMessage = async (input: string) => {
  if (!input.trim()) return;

  const openaiApiKey = process.env.OPEN_AI_ID;
  if (!openaiApiKey) {
    console.error("OpenAI API key is not set");
    return;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: input }],
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    const botMessage = response.data.choices[0].message.content.trim();
    return { text: botMessage, user: "bot" };
  } catch (error) {
    console.error("Error fetching from API", error);
    if (axios.isAxiosError(error) && error.response) {
      return { text: error.response.data.error.code, user: "bot" };
    } else {
      return { text: "Error: Could not get response", user: "bot" };
    }
  }
};

export const sendMessageToClaude = async (input: string) => {
  if (!input.trim()) return;
  try {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    let content;
    if (response.ok) {
      const data = await response.json();
      content = data.content[0].text || "No response received";
    } else {
      content = `API Error: ${response.status} `;
    }

    return { text: content, user: "bot" };
  } catch (error) {
    const typedError = error as { message: string };
    console.error("Error communicating with Claude:", typedError);
    return { text: typedError.message, user: "bot" };
  }
};

export const getGeminiResponce = async (input: string) => {
  if (!input.trim()) return;

  try {
    const response = await fetch("/api/gemini-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });
    let content;
    if (response.ok) {
      const { summary } = await response.json();
      content = summary || "No response received";
    } else {
      content = `API Error: ${response.status} `;
    }

    return { text: content, user: "bot" };
  } catch (error) {
    console.log("🚀 ~ getGeminiResponc ~ error:", error);
    return { text: "error.message", user: "bot" };
  }
};

export const commonAPIFunction = async (input: string, provider: string) => {
  console.log("🚀 ~ commonAPIFunction ~ provider:", provider);
  try {
    const response = await fetch("/api/chat", {
    // const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: input,
        prompt: input,
        provider,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("🚀 ~ commonAPIFunction ~ data:", data);
      if (!data.error) {
        return { text: data.text ?? data.result, user: "bot" };
      } else {
        return { text: data.error.lastError.data.error.message, user: "bot" };
      }
    }
  } catch (error) {
    console.log("🚀 ~ sendMessage ~ error:", error);
    return { text: "Error Occure", user: "bot" };
  }
};

export const imageGenerate = async (input: string) => {
  try {
    const response = await fetch("/api/image-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: input,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("🚀 ~ commonAPIFunction ~ data:", data);
      const { images } = data;
      return {
        images,
      };
    }
  } catch (error) {
    console.log("🚀 ~ imageGenerate ~ error:", error);
    return { images: null, error };
  }
};
