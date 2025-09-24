"use client";
// import ChatBot from "react-chatbotify";
import { useState } from "react";

const ChatBotChatify = () => {
  const [isOpen, setIsOpen] = useState(false);
  const landBotUrl = process.env.NEXT_PUBLIC_LAND_BOT_URL;

  let content;

  if (!landBotUrl) {
    content = <p>Error: Land bot URL not found</p>;
  } else if (!isOpen) {
    content = (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#ed3e79] text-white px-4 py-2 rounded shadow hover:bg-[#f82068]"
      >
        Open Chat
      </button>
    );
  } else {
    content = (
      <div className="w-96 h-[700px] bg-white shadow-lg rounded-lg flex flex-col">
        <div className="flex justify-between items-center p-2 bg-[#ed3e79] text-white rounded-t-lg">
          <span>Customer Support</span>
          <button onClick={() => setIsOpen(false)} className="text-white font-bold">
            ✕
          </button>
        </div>
        <iframe
          src={landBotUrl}
          className="flex-1 w-full"
          style={{ border: "none" }}
          title="Customer Support Chatbot"
        />
      </div>
    );
  }

  return <div className="fixed bottom-4 right-4 z-50">{content}</div>;
};

export default ChatBotChatify;
