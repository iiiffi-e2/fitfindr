"use server";

import { revalidatePath } from "next/cache";

import { ActionState } from "@/actions/types";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function createLocationReviewAction(
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await getCurrentUser();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to leave a review.",
    };
  }

  const locationId = formData.get("locationId") as string;
  const rating = parseInt(formData.get("rating") as string, 10);
  const comment = formData.get("comment") as string;

  if (!locationId || !rating || !comment) {
    return {
      success: false,
      message: "Please provide a rating and comment.",
    };
  }

  if (rating < 1 || rating > 5) {
    return {
      success: false,
      message: "Rating must be between 1 and 5.",
    };
  }

  if (comment.trim().length < 10) {
    return {
      success: false,
      message: "Comment must be at least 10 characters long.",
    };
  }

  try {
    await prisma.locationReview.create({
      data: {
        userId: session.user.id,
        locationId,
        rating,
        comment: comment.trim(),
      },
    });

    revalidatePath(`/locations/${locationId}`);

    return {
      success: true,
      message: "Review posted successfully!",
    };
  } catch (error) {
    console.error("Error creating location review:", error);
    return {
      success: false,
      message: "Failed to post review. Please try again.",
    };
  }
}

export async function createEventReviewAction(
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await getCurrentUser();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to leave a review.",
    };
  }

  const eventId = formData.get("eventId") as string;
  const rating = parseInt(formData.get("rating") as string, 10);
  const comment = formData.get("comment") as string;

  if (!eventId || !rating || !comment) {
    return {
      success: false,
      message: "Please provide a rating and comment.",
    };
  }

  if (rating < 1 || rating > 5) {
    return {
      success: false,
      message: "Rating must be between 1 and 5.",
    };
  }

  if (comment.trim().length < 10) {
    return {
      success: false,
      message: "Comment must be at least 10 characters long.",
    };
  }

  try {
    await prisma.eventReview.create({
      data: {
        userId: session.user.id,
        eventId,
        rating,
        comment: comment.trim(),
      },
    });

    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      message: "Review posted successfully!",
    };
  } catch (error) {
    console.error("Error creating event review:", error);
    return {
      success: false,
      message: "Failed to post review. Please try again.",
    };
  }
}

