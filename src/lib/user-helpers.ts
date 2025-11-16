import prisma from "@/lib/prisma";

export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  createdAt: Date;
  locations: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    city: string;
    state: string;
    createdAt: Date;
  }>;
  events: Array<{
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
  }>;
  locationReviews: Array<{
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
  }>;
  eventReviews: Array<{
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
  }>;
  stats: {
    locationsCount: number;
    eventsCount: number;
    reviewsCount: number;
    votesCount: number;
  };
};

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      locations: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          city: true,
          state: true,
          createdAt: true,
        },
      },
      events: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          eventType: true,
          startDateTime: true,
          endDateTime: true,
          createdAt: true,
          location: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
            },
          },
        },
      },
      locationReviews: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          location: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
            },
          },
        },
      },
      eventReviews: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          event: {
            select: {
              id: true,
              title: true,
              location: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                  state: true,
                },
              },
            },
          },
        },
      },
      locationVotes: true,
      eventVotes: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    createdAt: user.createdAt,
    locations: user.locations,
    events: user.events,
    locationReviews: user.locationReviews,
    eventReviews: user.eventReviews,
    stats: {
      locationsCount: user.locations.length,
      eventsCount: user.events.length,
      reviewsCount: user.locationReviews.length + user.eventReviews.length,
      votesCount: user.locationVotes.length + user.eventVotes.length,
    },
  };
}


