import { useAiModel } from "@/hooks";
import { Card, CardContent } from "@components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { NoMsg } from "./TextProptCard";

const ImageProptCard = () => {
  const [imageInput, setImageInput] = useState<string>("");

  const { imagePrompt, images } = useAiModel();

  return (
    <Card className="w-full max-w-2xl h-[80vh]  flex flex-col border rounded-lg shadow-lg bg-white">
      {/* <CardHeader></CardHeader> */}
      <CardContent className="h-full">
        <div className="h-[92%]">
          {images ? (
            images.map((image, index) => {
              return (
                <Image
                  key={index}
                  src={image.src}
                  alt={image.alt ?? "AI Image"}
                  height={image.height}
                  width={image.width}
                />
              );
            })
          ) : (
            <NoMsg />
          )}
        </div>

        <div className="p-3 border-t flex items-center gap-2">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && imagePrompt(imageInput)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => imagePrompt(imageInput)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageProptCard;
