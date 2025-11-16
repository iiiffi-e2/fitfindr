import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarRange, MapPin, Repeat } from "lucide-react";
import { VoteType } from "@prisma/client";

import { LocationMapWrapper } from "@/components/maps/location-map-wrapper";
import { VotingButtons } from "@/components/voting/voting-buttons";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import prisma from "@/lib/prisma";
import { formatDateRange } from "@/lib/utils";
import { getCurrentUser } from "@/lib/session";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: Props) {
  const session = await getCurrentUser();
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
      location: true,
      votes: true,
      reviews: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    notFound();
  }

  // Calculate vote counts
  const upvotes = event.votes.filter((v) => v.voteType === VoteType.UP).length;
  const downvotes = event.votes.filter((v) => v.voteType === VoteType.DOWN).length;
  
  // Get user's vote if logged in
  const userVote = session?.user?.id
    ? event.votes.find((v) => v.userId === session.user.id)?.voteType || null
    : null;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {event.eventType}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {event.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Created by{" "}
          <Link
            href={`/profile/${event.createdBy.id}`}
            className="font-medium text-brand hover:underline"
          >
            {event.createdBy.name || "Anonymous"}
          </Link>
        </p>
        <p className="mt-3 text-slate-600">{event.description}</p>

        <div className="mt-4">
          <VotingButtons
            itemId={event.id}
            itemType="event"
            upvotes={upvotes}
            downvotes={downvotes}
            userVote={userVote}
            isLoggedIn={!!session?.user}
          />
        </div>

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

      {event.location.latitude && event.location.longitude && (
        <section>
          <LocationMapWrapper
            latitude={event.location.latitude}
            longitude={event.location.longitude}
            locationName={event.location.name}
            address={`${event.location.addressLine1}, ${event.location.city}, ${event.location.state}`}
          />
        </section>
      )}

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

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500">
            Reviews
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            What people are saying
          </h2>
        </div>

        <ReviewList reviews={event.reviews} />

        {session?.user && (
          <ReviewForm itemId={event.id} itemType="event" />
        )}
      </section>
    </div>
  );
}
