"use client";

import { type CSSProperties, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { List, type ListRowProps } from "react-virtualized";
import { TechCard, techList, TechLists } from ".";
import Image from "next/image";
import { useValidImage } from "@/hooks";

type TechRowProps = {
  title: string;
  description: string;
  style: CSSProperties;
  rowKey: string;
};

const TechRow = ({ title, description, style, rowKey }: TechRowProps) => {
  const finalurl = useValidImage(title);

  return (
    <div key={rowKey} style={style}>
      <div className="relative z-10 flex h-full items-center justify-center gap-3 bg-white dark:bg-gray-800 px-6 py-4 shadow-md">
        <div className="relative h-10 w-10">
          <Image
            src={finalurl}
            alt={title}
            className="object-contain"
            height={40}
            width={40}
          />
        </div>
        <div className="text-center">
          <h3
            className="sm:text-md mb-1.5 text-sm font-semibold 
          text-gray-900 dark:text-gray-100"
          >
            {title}
          </h3>
          <p
            className="hidden sm:inline-block text-xs
          text-gray-500 dark:text-gray-400"
          >
            {description.length > 35
              ? description.slice(0, 35) + "..."
              : description}
          </p>
        </div>
      </div>
    </div>
  );
};

// export default function TechListWindow() {
//   const Row = ({ index, style }: ListChildComponentProps) => {
//     const tech = TechLists[index];
//     return (
//       <div style={style}>
//         <TechCard
//           {...tech}
//         />
//       </div>
//     );
//   };

//   return (
//     <List
//       height={400}
//       itemCount={techList.length}
//       itemSize={80} // height of each TechCard
//       width={500}
//     >
//       {Row}
//     </List>
//   );
// }

export function TechListVirtualized() {

  
  const rowRenderer = ({ key, index, style }: ListRowProps) => {
    const { description, title } = techList[index%techList.length];

    return (
      <TechRow
        rowKey={String(index+key)}
        title={title}
        description={description}
        style={style}
      />
    );
  };

  return (
    <List
      height={400}
      rowCount={TechLists.length}
      rowHeight={100} // same height as TechCard
      rowRenderer={rowRenderer}
      width={850}
    />
  );
}

export function TechListInfinite() {
const [items, setItems] = useState(TechLists.slice(0,12))
  const fetchMoreData = () => {
    const nextItems = TechLists.slice(items.length, items.length + 12);
    setTimeout(() => {
      setItems((prev) => [...prev, ...nextItems]);
    }, 500);
  };
  // return (
  //   <div className="grid grid-cols-5">
  //     {items.map((tech, index) => (
  //       <TechCard
  //         key={index}
  //         {...tech}
  //         onHover={() =>{}}
  //         onLeave={() => {}}
  //         />
  //       ))}
  //       </div>
  // );

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={items.length < TechLists.length}
      loader={
        <div style={{ textAlign: "center", padding: "10px" }}>
          <span>Loading more...</span>
        </div>
      }
      scrollThreshold={0.99}
      height={400}
    >
      <div className="grid grid-cols-4">

      {items.map((tech, index) => (
        <TechCard
          key={index}
          {...tech}
        />
      ))}
      </div>
    </InfiniteScroll>
  );
}

export const InfiniteScrollComp = () => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">

  <div className="flex items-center justify-between bg-gray-100 rounded-xl px-5 py-4 shadow-sm">
    <h2 className="text-lg font-semibold tracking-wide">
      Tech List
    </h2>
    <span className="text-sm font-medium bg-white px-3 py-1 rounded-lg border shadow-sm">
      Data: {TechLists.length}
    </span>
  </div>

  <div className="bg-blue-300 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
    <h3 className="text-base font-semibold mb-3 opacity-70">
      Virtualized View
    </h3>
    <TechListVirtualized />
  </div>

  <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
    <h3 className="text-base font-semibold mb-3 opacity-70">
      Infinite Scroll View
    </h3>
    <TechListInfinite />
  </div>

</div>

  );
};
