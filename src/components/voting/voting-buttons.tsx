"use client";

import { useState, useTransition } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { VoteType } from "@prisma/client";

import { voteOnLocationAction, voteOnEventAction } from "@/actions/vote-actions";

type Props = {
  itemId: string;
  itemType: "location" | "event";
  upvotes: number;
  downvotes: number;
  userVote: VoteType | null;
  isLoggedIn: boolean;
};

export function VotingButtons({
  itemId,
  itemType,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  userVote: initialUserVote,
  isLoggedIn,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<VoteType | null>(initialUserVote);

  const handleVote = (voteType: VoteType) => {
    if (!isLoggedIn) {
      alert("Please log in to vote");
      return;
    }

    // Optimistic update
    const previousUpvotes = upvotes;
    const previousDownvotes = downvotes;
    const previousUserVote = userVote;

    if (userVote === voteType) {
      // Toggle off
      if (voteType === VoteType.UP) {
        setUpvotes(upvotes - 1);
      } else {
        setDownvotes(downvotes - 1);
      }
      setUserVote(null);
    } else if (userVote === null) {
      // New vote
      if (voteType === VoteType.UP) {
        setUpvotes(upvotes + 1);
      } else {
        setDownvotes(downvotes + 1);
      }
      setUserVote(voteType);
    } else {
      // Change vote
      if (voteType === VoteType.UP) {
        setUpvotes(upvotes + 1);
        setDownvotes(downvotes - 1);
      } else {
        setUpvotes(upvotes - 1);
        setDownvotes(downvotes + 1);
      }
      setUserVote(voteType);
    }

    startTransition(async () => {
      const action =
        itemType === "location" ? voteOnLocationAction : voteOnEventAction;
      const result = await action(itemId, voteType);

      if (!result.success) {
        // Revert on error
        setUpvotes(previousUpvotes);
        setDownvotes(previousDownvotes);
        setUserVote(previousUserVote);
        alert(result.message);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote(VoteType.UP)}
        disabled={isPending || !isLoggedIn}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
          userVote === VoteType.UP
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        } ${isPending || !isLoggedIn ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{upvotes}</span>
      </button>
      <button
        onClick={() => handleVote(VoteType.DOWN)}
        disabled={isPending || !isLoggedIn}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
          userVote === VoteType.DOWN
            ? "border-red-500 bg-red-50 text-red-700"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        } ${isPending || !isLoggedIn ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{downvotes}</span>
      </button>
      {!isLoggedIn && (
        <span className="text-xs text-slate-500">Log in to vote</span>
      )}
    </div>
  );
}

