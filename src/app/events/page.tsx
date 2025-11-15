import { EventType } from "@prisma/client";
import {
  addDays,
  endOfWeek,
  startOfToday,
  endOfToday,
  startOfWeek,
} from "date-fns";
import Link from "next/link";

import { EventCard } from "@/components/events/event-card";
import prisma from "@/lib/prisma";
import { geocodeAddress, filterByProximity } from "@/lib/geocoding";

type Props = {
  searchParams: Promise<{
    q?: string;
    eventType?: string;
    date?: string;
    radius?: string;
  }>;
};

const eventTypes = Object.values(EventType);

const dateRanges = {
  today: {
    label: "Today",
    start: startOfToday(),
    end: endOfToday(),
  },
  week: {
    label: "This week",
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  },
  upcoming: {
    label: "Upcoming",
    start: new Date(),
    end: addDays(new Date(), 30),
  },
};

export default async function EventsPage({ searchParams }: Props) {
  const { q, eventType, date, radius } = await searchParams;
  const query = q?.toString().trim() ?? "";
  const selectedType = eventTypes.includes(eventType as EventType)
    ? (eventType as EventType)
    : undefined;
  const dateFilter = dateRanges[
    date as keyof typeof dateRanges
  ] as (typeof dateRanges)["today"] | undefined;
  const searchRadius = radius ? parseInt(radius, 10) : 25;

  let events;
  let geocodingResult = null;

  // If there's a location query, try to geocode it
  if (query) {
    geocodingResult = await geocodeAddress(query);

    if (geocodingResult) {
      // Build filters for event type and date
      const filters: Array<Record<string, unknown>> = [];
      
      if (selectedType) {
        filters.push({ eventType: selectedType });
      }
      
      if (dateFilter) {
        filters.push({
          startDateTime: {
            gte: dateFilter.start,
            lte: dateFilter.end,
          },
        });
      }

      const where = filters.length > 0 ? { AND: filters } : undefined;

      // Fetch all events with their locations
      const allEvents = await prisma.event.findMany({
        where,
        include: { location: true },
        orderBy: { startDateTime: "asc" },
      });

      // Filter by proximity based on the event's location
      events = filterByProximity(
        allEvents.map((event: any) => ({
          ...event,
          latitude: event.location.latitude,
          longitude: event.location.longitude,
        })),
        geocodingResult.coordinates.latitude,
        geocodingResult.coordinates.longitude,
        searchRadius,
      );
    } else {
      // Fallback to text search if geocoding fails
      const filters: Array<Record<string, unknown>> = [
        {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            {
              location: {
                city: { contains: query },
              },
            },
          ],
        },
      ];
      
      if (selectedType) {
        filters.push({ eventType: selectedType });
      }
      
      if (dateFilter) {
        filters.push({
          startDateTime: {
            gte: dateFilter.start,
            lte: dateFilter.end,
          },
        });
      }

      const where = { AND: filters };

      events = await prisma.event.findMany({
        where,
        include: { location: true },
        orderBy: { startDateTime: "asc" },
      });
    }
  } else {
    // No location query, just apply other filters
    const filters: Array<Record<string, unknown>> = [];
    
    if (selectedType) {
      filters.push({ eventType: selectedType });
    }
    
    if (dateFilter) {
      filters.push({
        startDateTime: {
          gte: dateFilter.start,
          lte: dateFilter.end,
        },
      });
    }

    const where = filters.length > 0 ? { AND: filters } : undefined;

    events = await prisma.event.findMany({
      where,
      include: { location: true },
      orderBy: { startDateTime: "asc" },
    });
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase text-slate-500">Find</p>
        <h1 className="text-3xl font-semibold text-slate-900">Events</h1>
        <p className="text-sm text-slate-500">
          Group runs, yoga classes, races, and pickup games. Search by location to find events near you.
        </p>
      </header>

      {geocodingResult && (
        <div className="rounded-2xl bg-brand/5 border border-brand/20 p-4 text-sm">
          <p className="font-semibold text-brand">
            Showing events within {searchRadius} miles of {geocodingResult.displayName}
          </p>
          <p className="mt-1 text-slate-600">
            Found {events.length} event{events.length !== 1 ? "s" : ""}
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
            Event type
            <select
              name="eventType"
              defaultValue={selectedType ?? ""}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="">All types</option>
              {(eventTypes as string[]).map((type) => (
                <option key={type} value={type}>
                  {type}
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

        <div className="flex flex-wrap gap-2">
          {Object.entries(dateRanges).map(([key, value]) => (
            <button
              key={key}
              name="date"
              value={key}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                date === key
                  ? "bg-brand text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
              type="submit"
            >
              {value.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Search
          </button>
          {(query || selectedType || dateFilter) && (
            <Link
              href="/events"
              className="text-sm font-semibold text-slate-500 underline"
            >
              Reset
            </Link>
          )}
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {events.length > 0 ? (
          events.map((event: any) => <EventCard key={event.id} event={event} />)
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
            No events match your filters. Try expanding your search or{" "}
            <Link href="/events/new" className="font-semibold text-brand">
              host one
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
