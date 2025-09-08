import { useValidImage } from "@/hooks";
import Image from "next/image";
import { ITech } from "./TechList";

interface ITechCard extends ITech {
  onHover: (rect: DOMRect) => void;
  onLeave: () => void;
}

export const TechCard: React.FC<ITechCard> = ({ title, description, onHover, onLeave }) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onHover(rect);
  };
  const formetTitle = title.replaceAll(/[ .]/g, "").toLowerCase();
  const urls: string[] = [
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${formetTitle}/${formetTitle}-original.svg`,
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${formetTitle}/${formetTitle}-plain.svg`,
  ];
  const placeholderImage = "/no-product.png";

  const finalurl = useValidImage(urls, placeholderImage);

  return (
    <div
      className="group relative block h-48 w-40 p-2 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 rounded-xl bg-white dark:bg-gray-800 px-6 py-4 shadow-md">
        <div className="relative h-10 w-10">
          <Image src={finalurl} alt={title} className="object-contain" height={40} width={40} />
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
            {description.length > 35 ? description.slice(0, 35) + "..." : description}
          </p>
        </div>
      </div>
    </div>
  );
};
