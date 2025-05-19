import { RatingStarsProps } from "@/types/components";
import { Star } from "lucide-react";
import { useState } from "react";

const RatingStars = ({ rating, onRate, showValue = false, size = 6 }: RatingStarsProps) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex-1 w-full gap-2">
      <div
        className="flex justify-center cursor-pointer"
        onMouseLeave={() => !showValue && setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            onMouseEnter={() => !showValue && setHovered(star)}
            onClick={() => onRate?.(star)}
          >
            <Star
              className={`w-${size} h-${size} transition-colors duration-150 ${(showValue ? rating : hovered || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
                }`}
              fill="currentColor"
            />



          </div>
        ))}
      </div>

      {showValue && rating > 0 && (
        <span className="text-lg font-bold text-blue-600 ml-2">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default RatingStars;
