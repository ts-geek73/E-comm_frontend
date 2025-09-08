"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const badges = [
  {
    href: "http://clutch.co/profile/techstaunch",
    src: "/global-clutch-badge.svg",
    alt: "Clutch Global Badge",
  },
  {
    href: "https://www.goodfirms.co/company/techstaunch",
    src: "/good-firms-badge.svg",
    alt: "GoodFirms Badge",
  },
  {
    href: "http://clutch.co/profile/techstaunch",
    src: "/clutch-badge.svg",
    alt: "Clutch Badge",
  },
  {
    href: "https://www.appfutura.com/companies/techstaunch-solutions",
    src: "/appfutura-badge.svg",
    alt: "AppFutura Badge",
  },
  {
    href: "https://techbehemoths.com/company/techstaunch-solutions",
    src: "/tech-reviewer-badge.svg",
    alt: "TechReviewer Badge",
  },
];

export function ClientStatsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // autoplay carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % badges.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 max-x-xl justify-items-center gap-12 xl:grid-cols-2">
        {/* Left Content */}
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2 text-center xl:text-left">
            <p className="text-md md:text-xl max-w-3xl mx-auto xl:mx-0">
              Join the <span className="text-primary">100% delighted </span> clients who are gladly
              `willing to refer` us. Our clients rate us 4.5 or higher.
            </p>
            <span className="text-primary text-md md:text-xl underline">
              Proven stats by Clutch.
            </span>
          </div>

          {/* Two Ratings Boxes */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
            {/* Clutch Example */}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full flex-col items-center rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md"
              href="https://clutch.co/profile/techstaunch-software-solutions"
            >
              <Image
                src="/global-clutch-badge.svg"
                alt="Clutch Logo"
                width={120}
                height={40}
                className="mb-3 w-24"
              />
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-foreground">5.0</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-primary text-primary"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-xs text-primary underline">clutch.co</p>
            </a>

            {/* GoodFirms Example */}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full flex-col items-center rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md"
              href="https://www.goodfirms.co/company/techstaunch"
            >
              <Image
                src="/good-firms-badge.svg"
                alt="GoodFirms Logo"
                width={120}
                height={40}
                className="mb-3 w-24"
              />
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-foreground">5.0</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-primary text-primary"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-xs text-primary underline">goodfirms.co</p>
            </a>
          </div>
        </div>

        {/* Right Badge Carousel */}
        <div className="relative flex min-h-[300px] w-full items-center">
          <div className="absolute inset-0 flex items-center justify-center">
            {badges.map((badge, i) => {
              const diff = (i - activeIndex + badges.length) % badges.length;

              let positionClass = "opacity-0 scale-75"; // hidden
              if (diff === 0) {
                positionClass = "z-30 scale-100 opacity-100"; // center
              } else if (diff === badges.length - 1) {
                positionClass = "z-20 -translate-x-[60%] scale-90 opacity-70"; // left
              } else if (diff === 1) {
                positionClass = "z-20 translate-x-[60%] scale-90 opacity-70"; // right
              }

              return (
                <a
                  key={i}
                  href={badge.href}
                  className={`absolute transition-all duration-500 ease-in-out cursor-pointer ${positionClass}`}
                >
                  <div className="relative h-[250px] w-[250px] max-sm:h-[200px] max-sm:w-[200px]">
                    <Image src={badge.src} alt={badge.alt} fill className="object-contain" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
