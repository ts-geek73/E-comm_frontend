"use client";

import Image from "next/image";
import { ReactNode } from "react";

const PageSection: React.FC<{
  image: { url: string; colour: string; postion: "left" | "right" };
  element: ReactNode;
}> = ({ element, image }) => {
  return (
    <div className={`flex h-[750px] w-full ${image.postion === "left" && "flex-row-reverse"}`}>
      <div
        className="w-1/2 h-full flex items-center justify-center text-white p-8"
        style={{
          background: `linear-gradient(to right, ${image.colour})`,
        }}
      >
        {element}
      </div>
      <div
        className="w-1/2 h-full bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${image.url})`,
          backgroundSize: "cover",
          backgroundColor: "red",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

const HeroSection: React.FC<{
  title: string;
  forwardUrl: string;
  backwardUrl: string;
}> = ({ title, forwardUrl, backwardUrl }) => {
  return (
    <div className="relative w-full h-screen [perspective: 1000px] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full  [transform-style:preserve-3d] z-0">
        <Image src={backwardUrl} alt="Mountain background" fill className="object-cover" />
      </div>

      <h1 className="absolute top-20 left-10 text-white text-5xl font-bold z-30">{title}</h1>
      <Image
        src={forwardUrl}
        alt="Climber foreground"
        height={500}
        width={500}
        className="object-contain z-20 border border-blue-200"
      />
    </div>
  );
};

const Motion3dComp = () => {
  return (
    <>
      <HeroSection
        title="Advantures"
        forwardUrl="https://img.freepik.com/premium-photo/hiker-with-his-back-turned-top-snowy-mountain-wearing-warm-clothes_301129-7315.jpg"
        backwardUrl="https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82"
      />
      <PageSection
        element={
          <div className="bg-black">
            <h1 className="text-xl font-bold mt-0">
              The open source platform designed for the future. Build enterprise
            </h1>
            <p>
              A complete development kit for building scalable server-side apps. Contact us to find
              out more about expertise consulting, on-site enterprise support, trainings, and
              private sessions.
            </p>
          </div>
        }
        image={{
          url: "https://img.freepik.com/free-photo/front-view-beautiful-dog-with-copy-space_23-2148786517.jpg?semt=ais_hybrid&w=740&q=80",
          colour: "#c11e23",
          postion: "left",
        }}
      />

      <div className="p-10 h-[24px] text-center">
        <p>This is additional content below the parallax section.</p>
      </div>
    </>
  );
};

export default Motion3dComp;
