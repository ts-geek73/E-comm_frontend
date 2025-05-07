import { ReviewImageGrid } from "@/components/Review/ReviewImageGrid";
import { ReviewCardProps } from "@/types/components";
import { Camera, MessageSquare, Pencil, Trash2, User } from "lucide-react";
import ConfirmDelete from "../Header/ConfirmDelete";
import RatingStars from "../Header/Ratings";
import { Button } from "../ui/button";

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onEdit,
  onDelete,
  showActions = true
}) => {

    
  return (
    <div className="flex flex-col border border-gray-200 rounded-lg shadow-sm p-4 gap-3 bg-white transition-all hover:shadow-md">
      {/* Header with user info and rating */}
      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-1.5 text-white flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-medium text-gray-800 text-sm truncate">
              {review.email}
            </h3>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={review.rate} showValue size={14} />
            {/* <span className="font-semibold text-blue-600 text-sm">{review.rate}/5</span> */}
          </div>
        </div>
      </div>

      {/* Review content */}
      <div className="bg-gray-50 p-3 rounded-md text-sm">
        <div className="flex gap-1.5 items-start">
          <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {review.description}
          </p>
        </div>
      </div>

      {/* Review images */}
      {review.images && review.images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-gray-500" />
            <h4 className="font-medium text-xs text-gray-600">
              {review.images.length} {review.images.length === 1 ? 'Photo' : 'Photos'}
            </h4>
          </div>
          <ReviewImageGrid images={review.images}  />
        </div>
      )}

      {/* Action buttons */}
      {showActions && onEdit && onDelete && (
        <div className="flex justify-end gap-2 mt-1 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-1.5 hover:bg-blue-50 border-blue-200 text-blue-700 h-8 px-2.5 rounded-md"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          
          <ConfirmDelete
            title="Delete Review"
            description="Are you sure you want to delete this review? This action cannot be undone."
            onConfirm={onDelete}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 hover:bg-red-50 border-red-200 text-red-600 h-8 px-2.5 rounded-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ReviewCard;