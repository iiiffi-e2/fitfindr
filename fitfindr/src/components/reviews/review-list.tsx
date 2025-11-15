import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
};

type Props = {
  reviews: Review[];
};

export function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        No reviews yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-3xl border border-slate-100 bg-white p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900">
                  {review.user.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line text-slate-700">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}

