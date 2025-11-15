import Link from "next/link";

import { EventForm } from "@/components/events/event-form";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

type Props = {
  searchParams: {
    locationId?: string;
  };
};

export default async function NewEventPage({ searchParams }: Props) {
  const session = await getCurrentUser();
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  if (!session?.user) {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Log in to create an event
        </h1>
        <p className="text-sm text-slate-500">
          Events are tied to your account so you can edit them later.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/auth/login"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Add a location first
        </h1>
        <p className="text-sm text-slate-500">
          Events must be linked to a location. Add your gym, park, or meetup
          spot and then come back.
        </p>
        <Link
          href="/locations/new"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white"
        >
          Add a location
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase text-slate-500">
          Invite people
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Create a new event
        </h1>
        <p className="text-sm text-slate-500">
          Runs, rides, drop-in yoga classes — whatever helps others move.
        </p>
      </header>

      <EventForm
        locations={locations}
        defaultLocationId={searchParams.locationId}
      />
    </div>
  );
}
