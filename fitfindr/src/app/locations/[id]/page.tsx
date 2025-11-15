import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Globe, MapPin, Phone } from "lucide-react";

import { EventCard } from "@/components/events/event-card";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

type Props = {
  params: {
    id: string;
  };
};

export default async function LocationDetailPage({ params }: Props) {
  const session = await getCurrentUser();

  const location = await prisma.location.findUnique({
    where: { id: params.id },
    include: {
      events: {
        include: { location: true },
        orderBy: { startDateTime: "asc" },
      },
    },
  });

  if (!location) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {location.category.replaceAll("_", " ")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {location.name}
        </h1>
        <p className="mt-3 whitespace-pre-line text-slate-600">
          {location.description}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoItem
            icon={<MapPin className="h-5 w-5 text-brand" />}
            label="Address"
            value={
              <>
                {location.addressLine1}
                {location.addressLine2 && <>, {location.addressLine2}</>}
                <br />
                {location.city}, {location.state} {location.postalCode}
                <br />
                {location.country}
              </>
            }
          />
          <InfoItem
            icon={<Phone className="h-5 w-5 text-brand" />}
            label="Contact"
            value={
              location.phone ? (
                <a href={`tel:${location.phone}`} className="text-brand">
                  {location.phone}
                </a>
              ) : (
                "Not provided"
              )
            }
          />
          <InfoItem
            icon={<Globe className="h-5 w-5 text-brand" />}
            label="Website"
            value={
              location.websiteUrl ? (
                <a
                  href={location.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand"
                >
                  {location.websiteUrl}
                </a>
              ) : (
                "Not provided"
              )
            }
          />
          <InfoItem
            icon={<CalendarDays className="h-5 w-5 text-brand" />}
            label="Events"
            value={`${location.events.length} scheduled`}
          />
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">
              Events
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Upcoming at {location.name}
            </h2>
          </div>
          {session?.user && (
            <Link
              href={`/events/new?locationId=${location.id}`}
              className="text-sm font-semibold text-brand"
            >
              Add an event
            </Link>
          )}
        </header>

        {location.events.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {location.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
            No events are scheduled here yet. {session ? "Add one!" : ""}
          </div>
        )}
      </section>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4">
      {icon}
      <div>
        <p className="text-xs font-semibold uppercase text-slate-500">
          {label}
        </p>
        <div className="text-sm text-slate-700">{value}</div>
      </div>
    </div>
  );
}
