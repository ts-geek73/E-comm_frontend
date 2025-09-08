"use client";

import { InfiniteScrollComp as InfiniteScroll, TechList } from "@/components/TechListComs";

const FakePage = () => {
  return (
    <div className="w-full min-h-[92vh] flex flex-col gap-5 items-center justify-center bg-gradient-to-b from-blue-200 via-white to-blue-200 dark:bg-gradient-to-b dark:from-black/100 dark:via-white dark:to-black/10 p-4">
      {/* <TextProptCard /> */}
      {/* <ImageProptCard /> */}
      <TechList />
      <InfiniteScroll />
      {/* <ClientStatsSection /> */}
    </div>
  );
};

export default FakePage;
