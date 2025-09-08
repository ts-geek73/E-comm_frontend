import { IMessage, useAiModel } from "@/hooks";
import MDX from "@components/markdown/MDX";
import { Card } from "@components/ui/card";
import { useEffect, useRef, useState } from "react";

export const LoadingDots = ({ dots = 3 }: { dots?: number }) => {
  return (
    <div className="flex justify-start">
      <div
        className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
        px-4 py-2 rounded-lg text-sm shadow rounded-bl-none flex gap-1 items-center"
      >
        {Array.from({ length: dots }).map((_, index) => (
          <span
            key={index}
            style={{ animationDelay: `${index * 0.15}s` }}
            className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full animate-bounce"
          />
        ))}
      </div>
    </div>
  );
};

export const NoMsg = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[98%] bg-gradient-to-b from-blue-200 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-lg p-6 text-center">
      <h3 className="text-2xl text-blue-500 font-semibold mb-2">Welcome to the Chat!</h3>
      <p className="text-gray-500 dark:text-gray-400">
        No messages yet. <span className="text-red-400">Start the chat!</span>
      </p>
    </div>
  );
};

const MessageList: React.FC<{
  messages: IMessage[];
  loading: boolean;
  agent: string;
}> = ({ messages, loading, agent }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new message comes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto gap-3.5 p-4 pt-0 border">
      {messages.length > 0 ? (
        messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${msg.user === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm shadow ${
                msg.user === "me"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.user === "me" && agent === "claude" ? msg.text : <MDX code={msg.text} />}
            </div>
          </div>
        ))
      ) : (
        <NoMsg />
      )}
      {loading && <LoadingDots />}
      <div ref={messagesEndRef} />
    </div>
  );
};

const TextProptCard = () => {
  const [input, setInput] = useState("");

  const { messages, selectedModel, modelOptions, loading, setSelectedModel, sendMessage } =
    useAiModel();

  const sendInput = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <Card
      className="w-full max-w-2xl h-[80vh] flex flex-col 
      border rounded-lg shadow-lg 
      bg-white dark:bg-gray-900 
      text-gray-900 dark:text-gray-100"
    >
      <div className="flex justify-between pb-3 pt-5 px-3">
        <h1 className="text-xl font-bold">{selectedModel.label}</h1>
        <div className="flex items-center gap-4">
          <select
            className="border p-1 rounded bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100"
            value={selectedModel.label}
            onChange={(e) => {
              const model = modelOptions.find((m) => m.label === e.target.value);
              setSelectedModel(model ?? modelOptions[0]);
            }}
          >
            {modelOptions.map((model) => (
              <option key={model.label} value={model.label}>
                {model.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <MessageList messages={messages} loading={loading} agent={selectedModel.agent} />

      <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendInput()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-400
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            border-gray-300 dark:border-gray-600"
        />
        <button
          onClick={sendInput}
          className="px-4 py-2 bg-blue-500 text-white rounded-full 
            hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </Card>
  );
};

export default TextProptCard;
