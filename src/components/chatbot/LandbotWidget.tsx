"use client";
import Script from "next/script";
import { FC } from "react";

interface LandbotWidgetProps {
  configUrl: string;
}

declare global {
  interface Window {
    Landbot: {
      Livechat: new (config: { configUrl: string }) => void;
    };
  }
}

const LandbotWidget: FC<LandbotWidgetProps> = ({ configUrl }) => {
  console.log("🚀 ~ configUrl:", configUrl);

  function setupLandbot() {
    if (typeof window !== "undefined" && window.Landbot) {
      new window.Landbot.Livechat({
        configUrl: configUrl,
      });
    }
  }

  return (
    <Script
      strategy="lazyOnload"
      src="https://static.landbot.io/landbot-3/landbot-3.0.0.js"
      onLoad={setupLandbot}
    />
  );
};

export default LandbotWidget;
