import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarRange, MapPin, Repeat } from "lucide-react";

import prisma from "@/lib/prisma";
import { formatDateRange } from "@/lib/utils";

type Props = {
  params: { id: string };
};

export default async function EventDetailPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { location: true },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {event.eventType}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {event.title}
        </h1>
        <p className="mt-3 text-slate-600">{event.description}</p>

        <dl className="mt-6 space-y-3 text-sm text-slate-700">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4">
            <CalendarRange className="mt-0.5 h-5 w-5 text-brand" />
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                When
              </dt>
              <dd>{formatDateRange(event.startDateTime, event.endDateTime)}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4">
            <MapPin className="mt-0.5 h-5 w-5 text-brand" />
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Where
              </dt>
              <dd>
                <Link
                  href={`/locations/${event.locationId}`}
                  className="font-semibold text-brand"
                >
                  {event.location.name}
                </Link>
                <div className="text-slate-500">
                  {event.location.addressLine1}, {event.location.city},{" "}
                  {event.location.state}
                </div>
              </dd>
            </div>
          </div>
          {event.recurringRule && (
            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4">
              <Repeat className="mt-0.5 h-5 w-5 text-brand" />
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">
                  Recurring
                </dt>
                <dd>{event.recurringRule}</dd>
              </div>
            </div>
          )}
        </dl>
      </section>

      <Link
        href={`/locations/${event.locationId}`}
        className="block rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <p className="text-xs font-semibold uppercase text-slate-500">
          Hosted at
        </p>
        <h2 className="text-xl font-semibold text-slate-900">
          {event.location.name}
        </h2>
        <p className="text-sm text-slate-600">
          {event.location.city}, {event.location.state}
        </p>
      </Link>
    </div>
  );
}
