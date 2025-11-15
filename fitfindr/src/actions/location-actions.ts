"use server";

import { revalidatePath } from "next/cache";

import { ActionState } from "@/actions/types";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { locationSchema } from "@/lib/validators";

export async function createLocationAction(
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState<{ id: string }>> {
  const session = await getCurrentUser();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Please sign in to add a location.",
    };
  }

  const values = {
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    latitude: formData.get("latitude") || undefined,
    longitude: formData.get("longitude") || undefined,
    websiteUrl: formData.get("websiteUrl") || undefined,
    phone: formData.get("phone") || undefined,
  };

  const parsed = locationSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const location = await prisma.location.create({
    data: {
      ...parsed.data,
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
      websiteUrl: parsed.data.websiteUrl || null,
      phone: parsed.data.phone || null,
      createdByUserId: session.user.id,
    },
  });

  revalidatePath("/locations");
  revalidatePath("/");

  return {
    success: true,
    message: "Location created!",
    data: { id: location.id },
  };
}
