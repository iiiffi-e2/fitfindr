import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";

import { formatDateRange } from "@/lib/utils";

type EventCardProps = {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startDateTime: Date;
  endDateTime: Date | null;
  location: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
};

type Props = {
  event: EventCardProps;
};

export function EventCard({ event }: Props) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span className="text-brand">{event.eventType}</span>
        <span>Event</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
      <p className="text-sm text-slate-600 line-clamp-2">
        {event.description}
      </p>
      <div className="mt-auto space-y-1 text-sm text-slate-700">
        <p className="flex items-center gap-2 font-medium">
          <CalendarDays className="h-4 w-4 text-brand" />
          {formatDateRange(event.startDateTime, event.endDateTime)}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand" />
          {event.location.name} · {event.location.city}
        </p>
      </div>
    </Link>
  );
}
