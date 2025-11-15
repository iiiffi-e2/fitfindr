/**
 * Geocoding utilities for converting addresses to coordinates
 */

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type GeocodingResult = {
  coordinates: Coordinates;
  displayName: string;
};

/**
 * Geocode an address using Nominatim (OpenStreetMap's free geocoding service)
 * @param query - The address or location query (e.g., "Austin, TX")
 * @returns Coordinates and display name, or null if not found
 */
export async function geocodeAddress(
  query: string,
): Promise<GeocodingResult | null> {
  if (!query || query.trim().length === 0) {
    return null;
  }

  try {
    // Normalize the query - handle common abbreviations
    let normalizedQuery = query;
    
    // Expand common street abbreviations to improve geocoding accuracy
    normalizedQuery = normalizedQuery
      .replace(/\bSt\b/gi, "Street")
      .replace(/\bAve\b/gi, "Avenue")
      .replace(/\bBlvd\b/gi, "Boulevard")
      .replace(/\bDr\b/gi, "Drive")
      .replace(/\bRd\b/gi, "Road")
      .replace(/\bLn\b/gi, "Lane")
      .replace(/\bCt\b/gi, "Court")
      .replace(/\bPl\b/gi, "Place")
      .replace(/\bPkwy\b/gi, "Parkway")
      .replace(/\bHwy\b/gi, "Highway")
      .replace(/\bFwy\b/gi, "Freeway");
    
    // Check if this is an Allen, TX address (not McAllen)
    // We'll use this for filtering results, not for changing the query
    const allenMatch = normalizedQuery.match(/\bAllen\s*,\s*(TX|Texas)\b/i);
    
    // Use Nominatim API (free, no API key required)
    // Note: Please respect their usage policy: https://operations.osmfoundation.org/policies/nominatim/
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", normalizedQuery);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "5"); // Get top 5 results to increase chances
    url.searchParams.set("addressdetails", "1"); // Get detailed address info
    url.searchParams.set("countrycodes", "us"); // Limit to US for better results

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "FitFindr/1.0", // Nominatim requires a User-Agent
      },
      // Cache for 1 hour to reduce API calls
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("Geocoding API error:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No geocoding results for query:", query);
      return null;
    }

    // For Allen, TX specifically, filter out McAllen results
    let filteredData = data;
    if (allenMatch) {
      filteredData = data.filter((result) => {
        const displayName = result.display_name.toLowerCase();
        // Must contain "allen" but NOT "mcallen"
        return displayName.includes("allen") && !displayName.includes("mcallen");
      });
      
      // If filtering removed all results, fall back to original data
      if (filteredData.length === 0) {
        filteredData = data;
      }
    }

    // Try to find the best result - prefer results with higher importance
    const result = filteredData.sort((a, b) => {
      const importanceA = parseFloat(a.importance || "0");
      const importanceB = parseFloat(b.importance || "0");
      return importanceB - importanceA;
    })[0];

    console.log("Geocoding result:", {
      query,
      normalizedQuery,
      displayName: result.display_name,
      lat: result.lat,
      lon: result.lon,
      importance: result.importance,
    });

    return {
      coordinates: {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      },
      displayName: result.display_name,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lon1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lon2 - Longitude of point 2
 * @returns Distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter locations by proximity to a given coordinate
 * @param locations - Array of locations with latitude/longitude
 * @param centerLat - Center latitude
 * @param centerLon - Center longitude
 * @param radiusMiles - Search radius in miles (default: 25)
 * @returns Filtered and sorted locations with distance
 */
export function filterByProximity<
  T extends { latitude: number | null; longitude: number | null },
>(
  locations: T[],
  centerLat: number,
  centerLon: number,
  radiusMiles: number = 25,
): Array<T & { distance: number }> {
  return locations
    .filter((loc) => loc.latitude !== null && loc.longitude !== null)
    .map((loc) => ({
      ...loc,
      distance: calculateDistance(
        centerLat,
        centerLon,
        loc.latitude!,
        loc.longitude!,
      ),
    }))
    .filter((loc) => loc.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}

