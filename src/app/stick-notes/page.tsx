"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const RndBasicTutorial = dynamic(() => import("./RndBasicTutorial"), {
  loading: () => <p>Loading...</p>,
});

const RndAdvancedTutorial = dynamic(() => import("./RndAdvancedTutorial"), {
  loading: () => <p>Loading...</p>,
});

const DndBasicTutorial = dynamic(() => import("./DndBasicTutorial"), {
  loading: () => <p>Loading...</p>,
});

const DndAdvancedTutorial = dynamic(() => import("./DndAdvancedTutorial"), {
  loading: () => <p>Loading...</p>,
});

interface TutorialNavProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TutorialNav: React.FC<TutorialNavProps> = ({ activeTab, setActiveTab }) => (
  <div className="flex justify-center gap-3 mb-6">
    {["rnd-basic", "rnd-advanced", "dnd-basic", "dnd-advanced"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 rounded-lg transition ${
          activeTab === tab
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {tab.replace("-", " ").toUpperCase()}
      </button>
    ))}
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("rnd-basic");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 flex flex-col">
        <TutorialNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "rnd-basic" && <RndBasicTutorial />}
        {activeTab === "rnd-advanced" && <RndAdvancedTutorial />}
        {activeTab === "dnd-basic" && <DndBasicTutorial />}
        {activeTab === "dnd-advanced" && <DndAdvancedTutorial />}
      </div>
    </DndProvider>
  );
};

export default App;
