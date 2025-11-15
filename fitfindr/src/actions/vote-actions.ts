"use server";

import { revalidatePath } from "next/cache";
import { VoteType } from "@prisma/client";

import { ActionState } from "@/actions/types";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function voteOnLocationAction(
  locationId: string,
  voteType: VoteType,
): Promise<ActionState> {
  const session = await getCurrentUser();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to vote.",
    };
  }

  try {
    // Check if user already voted
    const existingVote = await prisma.locationVote.findUnique({
      where: {
        userId_locationId: {
          userId: session.user.id,
          locationId,
        },
      },
    });

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.voteType === voteType) {
        await prisma.locationVote.delete({
          where: { id: existingVote.id },
        });
      } else {
        // Update to new vote type
        await prisma.locationVote.update({
          where: { id: existingVote.id },
          data: { voteType },
        });
      }
    } else {
      // Create new vote
      await prisma.locationVote.create({
        data: {
          userId: session.user.id,
          locationId,
          voteType,
        },
      });
    }

    revalidatePath(`/locations/${locationId}`);

    return {
      success: true,
      message: "Vote recorded successfully.",
    };
  } catch (error) {
    console.error("Error voting on location:", error);
    return {
      success: false,
      message: "Failed to record vote. Please try again.",
    };
  }
}

export async function voteOnEventAction(
  eventId: string,
  voteType: VoteType,
): Promise<ActionState> {
  const session = await getCurrentUser();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to vote.",
    };
  }

  try {
    // Check if user already voted
    const existingVote = await prisma.eventVote.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.voteType === voteType) {
        await prisma.eventVote.delete({
          where: { id: existingVote.id },
        });
      } else {
        // Update to new vote type
        await prisma.eventVote.update({
          where: { id: existingVote.id },
          data: { voteType },
        });
      }
    } else {
      // Create new vote
      await prisma.eventVote.create({
        data: {
          userId: session.user.id,
          eventId,
          voteType,
        },
      });
    }

    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      message: "Vote recorded successfully.",
    };
  } catch (error) {
    console.error("Error voting on event:", error);
    return {
      success: false,
      message: "Failed to record vote. Please try again.",
    };
  }
}

