"use client";

import { useState } from "react";
// import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import InfiniteScroll from "react-infinite-scroll-component";
import { List, ListRowProps } from "react-virtualized";
import { TechCard, techList } from ".";

// export default function TechListWindow() {
//   const Row = ({ index, style }: ListChildComponentProps) => {
//     const tech = techList[index];
//     return (
//       <div style={style}>
//         <TechCard
//           {...tech}
//           onHover={() => console.log("Hovered:", tech.title)}
//           onLeave={() => console.log("Left:", tech.title)}
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
    const tech = techList[index];
    return (
      <div key={key} style={style} className="h-56">
        <TechCard
          {...tech}
          onHover={() => console.log("Hovered:", tech.title)}
          onLeave={() => console.log("Left:", tech.title)}
        />
      </div>
    );
  };

  return (
    <List
      width={500}
      height={400}
      rowCount={techList.length}
      rowHeight={80} // same height as TechCard
      rowRenderer={rowRenderer}
    />
  );
}

export function TechListInfinite() {
  const [items, setItems] = useState(techList.slice(0, 10));

  const fetchMoreData = () => {
    const nextItems = techList.slice(items.length, items.length + 10);
    setTimeout(() => {
      setItems((prev) => [...prev, ...nextItems]);
    }, 3500);
  };

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={items.length < techList.length}
      loader={
        <div style={{ textAlign: "center", padding: "10px" }}>
          <span>Loading more...</span>
        </div>
      }
      scrollThreshold={0.99}
      height={400}
    >
      {items.map((tech, index) => (
        <TechCard
          key={index}
          {...tech}
          onHover={() => console.log("Hovered:", tech.title)}
          onLeave={() => console.log("Left:", tech.title)}
        />
      ))}
    </InfiniteScroll>
  );
}

export const InfiniteScrollComp = () => {
  return (
    <div className="flex justify-center w-full max-w-4xl items-center bg-red-200">
      {/* <TechListVirtualized /> */}
      <TechListInfinite />
    </div>
  );
};
