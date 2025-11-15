import type { ReactNode } from "react";
import { LocationCategory } from "@prisma/client";
import { CalendarDays, MapPin, Search } from "lucide-react";
import Link from "next/link";

import { EventCard } from "@/components/events/event-card";
import { LocationCard } from "@/components/locations/location-card";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  const [featuredLocations, upcomingEvents] = await Promise.all([
    prisma.location.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.event.findMany({
      where: {
        startDateTime: { gte: new Date() },
      },
      include: { location: true },
      orderBy: { startDateTime: "asc" },
      take: 4,
    }),
  ]);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-brand to-emerald-500 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
          fitfindr
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Find places and people who want to move — near you.
        </h1>
        <p className="mt-3 text-base text-white/90 sm:text-lg">
          Browse gyms, trails, studios, and upcoming events. Add your own spots
          when you discover something new.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <form
            action="/locations"
            className="flex flex-1 items-center gap-2 rounded-2xl bg-white/10 p-3"
          >
            <Search className="h-5 w-5 text-white" />
            <input
              name="q"
              placeholder="Search by city, name, or vibe"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand"
            >
              Search
            </button>
          </form>
          <Link
            href="/events"
            className="rounded-2xl border border-white/40 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Browse all events
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-wide text-white/80">
          {Object.values(LocationCategory).map((category) => (
            <Link
              key={category}
              href={{ pathname: "/locations", query: { category } }}
              className="rounded-full border border-white/30 px-3 py-1"
            >
              {category.replaceAll("_", " ")}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">
              In your area
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Featured locations
            </h2>
          </div>
          <Link href="/locations" className="text-sm font-semibold text-brand">
            See all
          </Link>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredLocations.length > 0 ? (
            featuredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))
          ) : (
            <EmptyState
              icon={<MapPin className="h-5 w-5 text-brand" />}
              title="No locations yet"
              description="Be the first to add a spot you love."
            />
          )}
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">
              Upcoming
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Events to join
            </h2>
          </div>
          <Link href="/events" className="text-sm font-semibold text-brand">
            See all
          </Link>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <EmptyState
              icon={<CalendarDays className="h-5 w-5 text-brand" />}
              title="No upcoming events"
              description="Host a run, ride, or class so others can join."
            />
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-3xl border border-slate-100 bg-white p-6 text-slate-600">
      {icon}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}
