import { LocationCategory } from "@prisma/client";
import Link from "next/link";

import { LocationCard } from "@/components/locations/location-card";
import prisma from "@/lib/prisma";
import { geocodeAddress, filterByProximity } from "@/lib/geocoding";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    radius?: string;
  }>;
};

const categories = Object.values(LocationCategory);

export default async function LocationsPage({ searchParams }: Props) {
  const { q, category, radius } = await searchParams;
  const query = q?.toString().trim() ?? "";
  const selectedCategory = categories.includes(
    category as LocationCategory,
  )
    ? (category as LocationCategory)
    : undefined;
  const searchRadius = radius ? parseInt(radius, 10) : 25;

  let locations;
  let geocodingResult = null;

  // If there's a location query, try to geocode it
  if (query) {
    geocodingResult = await geocodeAddress(query);

    if (geocodingResult) {
      // Fetch all locations (with optional category filter)
      const allLocations = await prisma.location.findMany({
        where: selectedCategory ? { category: selectedCategory } : undefined,
        orderBy: { createdAt: "desc" },
      });

      // Filter by proximity
      locations = filterByProximity(
        allLocations,
        geocodingResult.coordinates.latitude,
        geocodingResult.coordinates.longitude,
        searchRadius,
      );
    } else {
      // Fallback to text search if geocoding fails
      const filters: Array<Record<string, unknown>> = [
        {
          OR: [
            { name: { contains: query } },
            { city: { contains: query } },
            { state: { contains: query } },
          ],
        },
      ];
      
      if (selectedCategory) {
        filters.push({ category: selectedCategory });
      }

      const where = { AND: filters };

      locations = await prisma.location.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    }
  } else {
    // No query, just apply category filter if present
    locations = await prisma.location.findMany({
      where: selectedCategory ? { category: selectedCategory } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase text-slate-500">
          Explore
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Locations</h1>
        <p className="text-sm text-slate-500">
          Browse fitness-friendly places nearby. Search by location (e.g., "Austin, TX") to find spots near you.
        </p>
      </header>

      {geocodingResult && (
        <div className="rounded-2xl bg-brand/5 border border-brand/20 p-4 text-sm">
          <p className="font-semibold text-brand">
            Showing results within {searchRadius} miles of {geocodingResult.displayName}
          </p>
          <p className="mt-1 text-slate-600">
            Found {locations.length} location{locations.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <form className="space-y-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-600">
            Location
            <input
              name="q"
              defaultValue={query}
              placeholder="e.g., Austin, TX or 78701"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="text-sm font-semibold text-slate-600">
            Category
            <select
              name="category"
              defaultValue={selectedCategory ?? ""}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm font-semibold text-slate-600">
          Search radius
          <select
            name="radius"
            defaultValue={searchRadius.toString()}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
          </select>
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Search
          </button>
          {(query || selectedCategory) && (
            <Link
              href="/locations"
              className="text-sm font-semibold text-slate-500 underline"
            >
              Reset
            </Link>
          )}
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {locations.length > 0 ? (
          locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
            No locations found. Try a different search or{" "}
            <Link href="/locations/new" className="font-semibold text-brand">
              add a new spot
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
