"use server";

import { revalidatePath } from "next/cache";

import { ActionState } from "@/actions/types";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { locationSchema } from "@/lib/validators";
import { geocodeAddress } from "@/lib/geocoding";

export async function createLocationAction(
  _prevState: ActionState<{ id: string }> | undefined,
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

  // Geocode the address to get coordinates
  let latitude = parsed.data.latitude ?? null;
  let longitude = parsed.data.longitude ?? null;

  // If coordinates weren't provided, try to geocode the address
  if (!latitude || !longitude) {
    const addressParts = [
      parsed.data.addressLine1,
      parsed.data.addressLine2,
      parsed.data.city,
      parsed.data.state,
      parsed.data.postalCode,
      parsed.data.country,
    ].filter(Boolean);

    const fullAddress = addressParts.join(", ");
    console.log("Geocoding address:", fullAddress);
    
    try {
      const geocodingResult = await geocodeAddress(fullAddress);

      if (geocodingResult) {
        latitude = geocodingResult.coordinates.latitude;
        longitude = geocodingResult.coordinates.longitude;
        console.log("Geocoding successful:", { latitude, longitude });
      } else {
        console.warn("Geocoding returned no results for:", fullAddress);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  }

  const location = await prisma.location.create({
    data: {
      ...parsed.data,
      latitude,
      longitude,
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
