"use server";

import { revalidatePath } from "next/cache";

import { ActionState } from "@/actions/types";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { eventSchema } from "@/lib/validators";

export async function createEventAction(
  _prevState: ActionState<{ id: string }> | undefined,
  formData: FormData,
): Promise<ActionState<{ id: string }>> {
  const session = await getCurrentUser();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Please sign in to add an event.",
    };
  }

  const values = {
    title: formData.get("title"),
    description: formData.get("description"),
    eventType: formData.get("eventType"),
    locationId: formData.get("locationId"),
    startDateTime: formData.get("startDateTime"),
    endDateTime: formData.get("endDateTime") || undefined,
    recurringRule: formData.get("recurringRule") || undefined,
  };

  const parsed = eventSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      startDateTime: new Date(parsed.data.startDateTime),
      endDateTime: parsed.data.endDateTime
        ? new Date(parsed.data.endDateTime)
        : null,
      recurringRule: parsed.data.recurringRule || null,
      createdByUserId: session.user.id,
    },
  });

  revalidatePath("/events");
  revalidatePath("/locations");
  revalidatePath("/");

  return {
    success: true,
    message: "Event created!",
    data: { id: event.id },
  };
}
