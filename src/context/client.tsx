"use client";

import { CartProvider } from "@/context/cart";
import ChatBotChatify from "@components/chatbot/ChatBotChatify";
import HeadBar from "@components/Header/Headbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class" // adds "class" to <html> or <body>
        defaultTheme="light" // light/dark based on OS setting
        enableSystem={true} // allow system preference
        disableTransitionOnChange
      >
        <CartProvider>
          <HeadBar />
          <header className="flex justify-end items-center"></header>
          {children}
          <ToastContainer />
          <ChatBotChatify />
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default ClientProvider;
