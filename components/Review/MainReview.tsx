import { useClerk } from '@clerk/nextjs';
import { MessageSquare, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Review, ReviewFecth } from '@/types/review';
import { fetchReviews, handleDeleteReview } from '../function';

import ReviewForm from './ReviewForm';
import { ReviewsList } from './ReviewsList';

const MultiReviewProduct = ({ productId }: { productId: string }) => {
  const { user } = useClerk();
  const userId = user?.id;

  const [reviewsObj, setReviewsObj] = useState<ReviewFecth>({
    reviews: [], otherReviews: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchReviews({ productId, userId }).then(res => res && setReviewsObj(res as ReviewFecth));
  }, [productId, userId]);

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setIsEditing(true);
  };

  const avgRating = reviewsObj.reviews.length
    ? (reviewsObj.reviews.reduce((sum, r: Review) => sum + r.rate, 0) / reviewsObj.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="p-8 border rounded-xl shadow-sm bg-white space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Customer Reviews
        </h2>

        <div className="md:grid md:grid-cols-[1fr_2fr] gap-8 mt-6">

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl text-center shadow-sm max-h-48 ">
            <div className="text-5xl font-bold text-blue-600 mb-2">{avgRating}</div>
            <p className="text-sm text-gray-600 mt-1">out of 5</p>
            <p className="text-sm text-gray-600 mt-4 font-medium">Based on {reviewsObj.reviews.length} {reviewsObj.reviews.length === 1 ? 'review' : 'reviews'}</p>
          </div>

          <div className="mt-6 md:mt-0">
            {/* Display reviews if available */}
            {!isEditing ? (
              <>
                {reviewsObj.otherReviews.length > 0 ? (
                  <ReviewsList
                  reviews={[...reviewsObj.otherReviews, ...reviewsObj.reviews]}
                  showActions={false}
                    onEditReview={handleEditReview}
                    onDeleteReview={handleDeleteReview}
                    emptyStateMessage="No reviews available."
                  />
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No other customer reviews yet</p>
                  </div>
                )}

                {/* Display user review if available */}
                {reviewsObj.reviews.length === 0 && (
                  <div>
                    <Button
                      className="mt-6 bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsEditing(true)}
                    >
                      Write a Review
                    </Button>
                  </div>
                )}
              </>
            ) : (
              // Show the Review Form on edit
              <ReviewForm
                productId={productId}
                userId={userId!}
                selectedReview={selectedReview}
                setSelectedReview={setSelectedReview}
                setIsEditing={setIsEditing}
                  updateReviews={() =>{

                    if (!userId) return;
                    fetchReviews({ productId, userId }).then((res) => {
                      if (res) setReviewsObj(res as ReviewFecth);
                    })
                  }
                  }
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MultiReviewProduct;
