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

type Props = {
  searchParams: {
    q?: string;
    eventType?: string;
    date?: string;
  };
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
  const query = searchParams.q?.toString().trim() ?? "";
  const selectedType = eventTypes.includes(searchParams.eventType as EventType)
    ? (searchParams.eventType as EventType)
    : undefined;
  const dateFilter = dateRanges[
    searchParams.date as keyof typeof dateRanges
  ] as (typeof dateRanges)["today"] | undefined;

  const filters = [
    query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            {
              location: {
                city: { contains: query, mode: "insensitive" },
              },
            },
          ],
        }
      : undefined,
    selectedType ? { eventType: selectedType } : undefined,
    dateFilter
      ? {
          startDateTime: {
            gte: dateFilter.start,
            lte: dateFilter.end,
          },
        }
      : undefined,
  ].filter(Boolean);

  const where = filters.length ? { AND: filters } : undefined;

  const events = await prisma.event.findMany({
    where,
    include: { location: true },
    orderBy: { startDateTime: "asc" },
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase text-slate-500">Find</p>
        <h1 className="text-3xl font-semibold text-slate-900">Events</h1>
        <p className="text-sm text-slate-500">
          Group runs, yoga classes, races, and pickup games — all in one feed.
        </p>
      </header>

      <form className="space-y-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-600">
            Keyword
            <input
              name="q"
              defaultValue={query}
              placeholder="Search by title or city"
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
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(dateRanges).map(([key, value]) => (
            <button
              key={key}
              name="date"
              value={key}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                searchParams.date === key
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
            Apply filters
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
          events.map((event) => <EventCard key={event.id} event={event} />)
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
