"use server";

import prisma from "@/lib/prisma";
import { geocodeAddress } from "@/lib/geocoding";

/**
 * Geocode a single location by ID with multiple fallback strategies
 */
export async function geocodeSingleLocation(locationId: string) {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    return { success: false, error: "Location not found" };
  }

  // Try multiple address formats
  const addressFormats = [
    // Full address
    [
      location.addressLine1,
      location.addressLine2,
      location.city,
      location.state,
      location.postalCode,
      location.country,
    ]
      .filter(Boolean)
      .join(", "),
    // Without address line 2
    [
      location.addressLine1,
      location.city,
      location.state,
      location.postalCode,
      location.country,
    ]
      .filter(Boolean)
      .join(", "),
    // Just city, state, and postal code
    [location.city, location.state, location.postalCode]
      .filter(Boolean)
      .join(", "),
    // Just city and state
    [location.city, location.state].filter(Boolean).join(", "),
  ];

  for (const address of addressFormats) {
    console.log(`Trying to geocode: ${address}`);
    const result = await geocodeAddress(address);

    if (result) {
      await prisma.location.update({
        where: { id: locationId },
        data: {
          latitude: result.coordinates.latitude,
          longitude: result.coordinates.longitude,
        },
      });

      return {
        success: true,
        coordinates: result.coordinates,
        displayName: result.displayName,
        addressUsed: address,
      };
    }

    // Wait a bit between attempts
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return { success: false, error: "No geocoding results with any format" };
}

/**
 * Geocode all locations that don't have coordinates
 */
export async function geocodeExistingLocations() {
  const locationsWithoutCoords = await prisma.location.findMany({
    where: {
      OR: [{ latitude: null }, { longitude: null }],
    },
  });

  console.log(
    `Found ${locationsWithoutCoords.length} locations without coordinates`,
  );

  const results = [];

  for (const location of locationsWithoutCoords) {
    console.log(`\nGeocoding: ${location.name}`);
    const result = await geocodeSingleLocation(location.id);
    
    if (result.success) {
      results.push({
        id: location.id,
        name: location.name,
        success: true,
        coordinates: result.coordinates,
        addressUsed: result.addressUsed,
      });
      console.log(`✓ ${location.name}: ${result.coordinates?.latitude}, ${result.coordinates?.longitude}`);
      console.log(`  Address used: ${result.addressUsed}`);
    } else {
      results.push({
        id: location.id,
        name: location.name,
        success: false,
        error: result.error,
      });
      console.warn(`✗ ${location.name}: ${result.error}`);
    }

    // Add a small delay to respect API rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * Re-geocode ALL locations (even those with existing coordinates)
 * Useful when you want to fix incorrect coordinates
 */
export async function reGeocodeAllLocations() {
  const allLocations = await prisma.location.findMany();

  console.log(`Re-geocoding ${allLocations.length} locations`);

  const results = [];

  for (const location of allLocations) {
    console.log(`\nRe-geocoding: ${location.name}`);
    const result = await geocodeSingleLocation(location.id);
    
    if (result.success) {
      results.push({
        id: location.id,
        name: location.name,
        success: true,
        coordinates: result.coordinates,
        addressUsed: result.addressUsed,
      });
      console.log(`✓ ${location.name}: ${result.coordinates?.latitude}, ${result.coordinates?.longitude}`);
      console.log(`  Address used: ${result.addressUsed}`);
    } else {
      results.push({
        id: location.id,
        name: location.name,
        success: false,
        error: result.error,
      });
      console.warn(`✗ ${location.name}: ${result.error}`);
    }

    // Add a small delay to respect API rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}

