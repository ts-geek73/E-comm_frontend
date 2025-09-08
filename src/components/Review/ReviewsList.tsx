import { useClerk } from "@clerk/nextjs";
import { Review, ReviewsListProps } from "@types";
import { MessageSquare } from "lucide-react";
import { ReviewCard } from ".";

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  onEditReview,
  onDeleteReview,
  emptyStateMessage = "No reviews available",
}) => {
  const { user } = useClerk();
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-h-[420px] overflow-y-auto space-y-6 pr-2">
      {reviews.map((review: Review) => (
        <ReviewCard
          key={review._id || `review-${Math.random()}`}
          review={review}
          onEdit={() => onEditReview && onEditReview(review)}
          onDelete={() =>
            onDeleteReview &&
            review._id &&
            onDeleteReview({
              id: review._id,
              user_id: review.user_id,
            })
          }
          showActions={review.email === user?.primaryEmailAddress?.emailAddress}
        />
      ))}
    </div>
  );
};

export default ReviewsList