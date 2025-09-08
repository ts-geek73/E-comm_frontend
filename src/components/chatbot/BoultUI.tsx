"use client";

import { BotUI, BotUIAction, BotUIMessageList } from "@botui/react";
import { BotuiInterface, createBot } from "botui";
import { useEffect, useState } from "react";

const BoultUI = () => {
  const [myBot, setMyBot] = useState<BotuiInterface | null>(null);

  useEffect(() => {
    const bot = createBot();
    console.log("🚀 ~ useEffect ~ bot:", bot);
    setMyBot(bot);

    bot
      .wait({ waitTime: 1000 })
      .then(() => bot.message.add({ text: "hello, what is your name?" }))
      .then(() =>
        bot.action.set(
          {
            options: [
              { label: "John", value: "john" },
              { label: "Jane", value: "jane" },
            ],
          },
          { actionType: "select" }
        )
      )
      .then((data) =>
        bot.message.add({ text: `nice to meet you ${data.selected.label}` })
      );
  }, []);

  if (!myBot) return null;

  return (
    <div className="absolute bottom-0 right-0 w-full h-full z-20">
      <BotUI bot={myBot}>
        <BotUIMessageList />
        <BotUIAction />
      </BotUI>
    </div>
  );
};

export default BoultUI;
