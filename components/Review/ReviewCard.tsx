import { Camera, Pencil, Trash2, User } from "lucide-react";
import ConfirmDelete from "../Header/ConfirmDelete";
import { Button } from "../ui/button";
import { ReviewImageGrid } from "@/components/Review/ReviewImageGrid";
import RatingStars from "../Header/Ratings";
import { ReviewCardProps } from "@/types/components";

const ReviewCard : React.FC<ReviewCardProps> = ({
  review,
  onEdit,
  onDelete,
  showActions = true
}) => {
  return (
    <div className="flex flex-col border border-gray-100 rounded-xl shadow-sm p-6 gap-4 bg-white transition-all hover:shadow-md"
    >
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-2 text-white">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{review.email}</h3>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <RatingStars rating={review.rate} />
            <span className="text-lg font-bold text-blue-600">{review.rate}/5</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-700 leading-relaxed">{review.description}</p>
      </div>

      {review.images && review.images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-gray-500" />
            <h4 className="font-medium text-gray-700">Photos from this review</h4>
          </div>
          <ReviewImageGrid images={review.images} />
        </div>
      )}

      {/* Action buttons */}
      {showActions && onEdit && onDelete && (
        <div className="flex gap-3 mt-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-2 hover:bg-blue-50 border-blue-200 text-blue-700"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          
          <ConfirmDelete
            title="Delete Review"
            description="Are you sure you want to delete this review? This action cannot be undone."
            onConfirm={onDelete}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-red-50 border-red-200 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ReviewCard