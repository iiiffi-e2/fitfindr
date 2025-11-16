"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import { LocationCard } from "@/components/locations/location-card";
import { EventCard } from "@/components/events/event-card";

type Location = {
  id: string;
  name: string;
  description: string;
  category: string;
  city: string;
  state: string;
  createdAt: Date;
};

type Event = {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startDateTime: Date;
  endDateTime: Date | null;
  createdAt: Date;
  location: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
};

type LocationReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  location: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
};

type EventReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  event: {
    id: string;
    title: string;
    location: {
      id: string;
      name: string;
      city: string;
      state: string;
    };
  };
};

type Props = {
  locations: Location[];
  events: Event[];
  locationReviews: LocationReview[];
  eventReviews: EventReview[];
};

type Tab = "locations" | "events" | "reviews" | "activity";

export function ProfileTabs({
  locations,
  events,
  locationReviews,
  eventReviews,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("locations");

  const tabs: Array<{ id: Tab; label: string; count: number }> = [
    { id: "locations", label: "Locations", count: locations.length },
    { id: "events", label: "Events", count: events.length },
    {
      id: "reviews",
      label: "Reviews",
      count: locationReviews.length + eventReviews.length,
    },
    {
      id: "activity",
      label: "Activity",
      count:
        locations.length +
        events.length +
        locationReviews.length +
        eventReviews.length,
    },
  ];

  // Combine all activity and sort by date
  const allActivity = [
    ...locations.map((loc) => ({
      type: "location" as const,
      date: loc.createdAt,
      data: loc,
    })),
    ...events.map((evt) => ({
      type: "event" as const,
      date: evt.createdAt,
      data: evt,
    })),
    ...locationReviews.map((rev) => ({
      type: "locationReview" as const,
      date: rev.createdAt,
      data: rev,
    })),
    ...eventReviews.map((rev) => ({
      type: "eventReview" as const,
      date: rev.createdAt,
      data: rev,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-t-2xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "border-b-2 border-brand text-brand"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
        {activeTab === "locations" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {locations.length > 0 ? (
              locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))
            ) : (
              <EmptyState message="No locations created yet" />
            )}
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <EmptyState message="No events created yet" />
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {locationReviews.length > 0 || eventReviews.length > 0 ? (
              <>
                {locationReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                    itemName={review.location.name}
                    itemLocation={`${review.location.city}, ${review.location.state}`}
                    itemLink={`/locations/${review.location.id}`}
                    itemType="Location"
                  />
                ))}
                {eventReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                    itemName={review.event.title}
                    itemLocation={`${review.event.location.city}, ${review.event.location.state}`}
                    itemLink={`/events/${review.event.id}`}
                    itemType="Event"
                  />
                ))}
              </>
            ) : (
              <EmptyState message="No reviews written yet" />
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            {allActivity.length > 0 ? (
              allActivity.map((item, index) => (
                <ActivityItem key={`${item.type}-${index}`} item={item} />
              ))
            ) : (
              <EmptyState message="No activity yet" />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

function ReviewCard({
  rating,
  comment,
  createdAt,
  itemName,
  itemLocation,
  itemLink,
  itemType,
}: {
  rating: number;
  comment: string;
  createdAt: Date;
  itemName: string;
  itemLocation: string;
  itemLink: string;
  itemType: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">
              {format(createdAt, "MMM d, yyyy")}
            </span>
          </div>
          <p className="text-sm text-slate-700">{comment}</p>
          <Link
            href={itemLink}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
          >
            <MapPin className="h-4 w-4" />
            {itemName} · {itemLocation}
            <span className="text-xs text-slate-500">({itemType})</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  item,
}: {
  item: {
    type: "location" | "event" | "locationReview" | "eventReview";
    date: Date;
    data: any;
  };
}) {
  const dateStr = format(item.date, "MMM d, yyyy");

  if (item.type === "location") {
    const loc = item.data as Location;
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
            <MapPin className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">
              Created a location · {dateStr}
            </p>
            <Link
              href={`/locations/${loc.id}`}
              className="mt-1 font-semibold text-slate-900 hover:text-brand"
            >
              {loc.name}
            </Link>
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">
              {loc.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === "event") {
    const evt = item.data as Event;
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
            <MapPin className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">Created an event · {dateStr}</p>
            <Link
              href={`/events/${evt.id}`}
              className="mt-1 font-semibold text-slate-900 hover:text-brand"
            >
              {evt.title}
            </Link>
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">
              {evt.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === "locationReview") {
    const rev = item.data as LocationReview;
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
            <Star className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">
              Reviewed a location · {dateStr}
            </p>
            <Link
              href={`/locations/${rev.location.id}`}
              className="mt-1 font-semibold text-slate-900 hover:text-brand"
            >
              {rev.location.name}
            </Link>
            <div className="mt-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < rev.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">
              {rev.comment}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === "eventReview") {
    const rev = item.data as EventReview;
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
            <Star className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">
              Reviewed an event · {dateStr}
            </p>
            <Link
              href={`/events/${rev.event.id}`}
              className="mt-1 font-semibold text-slate-900 hover:text-brand"
            >
              {rev.event.title}
            </Link>
            <div className="mt-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < rev.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">
              {rev.comment}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


