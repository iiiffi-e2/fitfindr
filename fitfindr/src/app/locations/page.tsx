import { LocationCategory } from "@prisma/client";
import Link from "next/link";

import { LocationCard } from "@/components/locations/location-card";
import prisma from "@/lib/prisma";

type Props = {
  searchParams: {
    q?: string;
    category?: string;
  };
};

const categories = Object.values(LocationCategory);

export default async function LocationsPage({ searchParams }: Props) {
  const query = searchParams.q?.toString().trim() ?? "";
  const selectedCategory = categories.includes(
    searchParams.category as LocationCategory,
  )
    ? (searchParams.category as LocationCategory)
    : undefined;

  const filters = [
    query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { state: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    selectedCategory ? { category: selectedCategory } : undefined,
  ].filter(Boolean);

  const where = filters.length ? { AND: filters } : undefined;

  const locations = await prisma.location.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase text-slate-500">
          Explore
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Locations</h1>
        <p className="text-sm text-slate-500">
          Browse fitness-friendly places nearby. Filter by category or search by
          name and city.
        </p>
      </header>

      <form className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:flex sm:items-end sm:gap-4">
        <label className="flex-1 text-sm font-semibold text-slate-600">
          Keyword
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by name or city"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="mt-4 flex-1 text-sm font-semibold text-slate-600 sm:mt-0">
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
        <div className="mt-4 flex items-center gap-3 sm:mt-0">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Apply
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
