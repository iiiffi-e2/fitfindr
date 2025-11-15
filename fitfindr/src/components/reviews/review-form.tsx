"use client";

import { useActionState, useEffect, useState } from "react";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createLocationReviewAction,
  createEventReviewAction,
} from "@/actions/review-actions";
import { ActionState } from "@/actions/types";

type Props = {
  itemId: string;
  itemType: "location" | "event";
};

export function ReviewForm({ itemId, itemType }: Props) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const action =
    itemType === "location"
      ? createLocationReviewAction
      : createEventReviewAction;

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      setRating(0);
      // Reset form
      const form = document.getElementById(
        `review-form-${itemType}-${itemId}`,
      ) as HTMLFormElement;
      if (form) {
        form.reset();
      }
    }
  }, [state, itemType, itemId]);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900">Leave a Review</h3>
      <form
        id={`review-form-${itemType}-${itemId}`}
        action={formAction}
        className="mt-4 space-y-4"
      >
        <input
          type="hidden"
          name={itemType === "location" ? "locationId" : "eventId"}
          value={itemId}
        />
        <input type="hidden" name="rating" value={rating} />

        <div>
          <label className="text-sm font-medium text-slate-700">
            Your Rating
          </label>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-slate-600">
                {rating} star{rating !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {state?.errors?.rating && (
            <p className="mt-1 text-sm text-rose-600">
              {state.errors.rating[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="text-sm font-medium text-slate-700">
            Your Review
          </label>
          <Textarea
            id="comment"
            name="comment"
            placeholder="Share your experience..."
            rows={4}
            className="mt-1"
            required
          />
          {state?.errors?.comment && (
            <p className="mt-1 text-sm text-rose-600">
              {state.errors.comment[0]}
            </p>
          )}
        </div>

        {state?.message && (
          <p
            className={`text-sm font-medium ${
              state.success ? "text-green-600" : "text-rose-600"
            }`}
          >
            {state.message}
          </p>
        )}

        <Button type="submit" isLoading={isPending} disabled={rating === 0}>
          Post Review
        </Button>
      </form>
    </div>
  );
}

