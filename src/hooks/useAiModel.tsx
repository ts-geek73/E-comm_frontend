import {
  commonAPIFunction,
  getGeminiResponce,
  imageGenerate,
  sendChatGPTMessage,
  sendMessageToClaude,
} from "@components/Functions";
// import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export interface IMessage {
  text: string;
  user: string;
}

export interface ImageData {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

const useAiModel = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageData[] | null>(null);

  const modelOptions = [
    {
      label: "OpenAI GPT 4o(self)",
      model: "gpt-4o-mini",
      agent: "openai",
      handler: sendChatGPTMessage,
    },
    {
      label: "Claude Sonnet 4(self)",
      model: "claude-sonnet-4-20250514",
      agent: "claude",
      handler: sendMessageToClaude,
    },
    {
      label: "Gemini(self)",
      model: "gemini-2.0-flash-001",
      agent: "gemini",
      handler: getGeminiResponce,
    },
    {
      label: "OpenAI GPT 4o",
      model: "gpt-4o-mini",
      agent: "openai",
    },
    {
      label: "Claude Sonnet 4",
      model: "claude-sonnet-4-20250514",
      agent: "claude",
    },
    {
      label: "Gemini",
      model: "gemini-2.0-flash-001",
      agent: "gemini",
    },
    {
      label: "Grok",
      model: "grok",
      agent: "grok",
    },
  ];
  const [selectedModel, setSelectedModel] = useState(modelOptions[0]);

  const sendMessage = async (input: string) => {
    setLoading(true);
    const newMessages = [...messages, { text: input, user: "me" }];
    setMessages(newMessages);
    const newRes = await commonAPIFunction(input, selectedModel.agent);

    if (newRes) {
      setMessages([...newMessages, newRes]);
    } else {
      setMessages(newMessages);
    }

    setLoading(false);
  };

  const imagePrompt = async (input: string) => {
    console.log("🚀 ~ imagePrompt Call");
    setImages(null);
    setLoading(true);
    const newMessages = [...messages, { text: input, user: "me" }];
    setMessages(newMessages);

    const result = await imageGenerate(input);
    console.log("🚀 ~ imagePrompt ~ result:", result);
    if (result) {
      const { images } = result;
      setLoading(false);
      setImages(images);
    }
  };

  return {
    selectedModel,
    setSelectedModel,
    modelOptions,
    images,
    sendMessage,
    loading,
    imagePrompt,
    messages,
  };
};

export default useAiModel;
