import { LocationCategory } from "@prisma/client";
import Link from "next/link";

import { LocationForm } from "@/components/locations/location-form";
import { getCurrentUser } from "@/lib/session";

const categories = Object.values(LocationCategory);

export default async function NewLocationPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Log in to add a location
        </h1>
        <p className="text-sm text-slate-500">
          You need an account to add new places. It helps keep the directory
          trustworthy.
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

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase text-slate-500">
          Share a spot
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Add a new location
        </h1>
        <p className="text-sm text-slate-500">
          Tell the community about your favorite gym, track, or outdoor meet-up
          spot.
        </p>
      </header>

      <LocationForm categories={categories} />
    </div>
  );
}
