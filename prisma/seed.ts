import { addDays, setHours, setMinutes } from "date-fns";
import { PrismaClient, LocationCategory, EventType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("password123", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "Avery Runner",
      email: "demo@fitfindr.com",
      passwordHash,
    },
  });

  const locationsData = [
    {
      name: "Eastside Strength Lab",
      description:
        "Neighborhood gym with functional training equipment, open gym space, and coached HIIT classes throughout the day.",
      category: LocationCategory.GYM,
      addressLine1: "1800 E 6th St",
      city: "Austin",
      state: "TX",
      postalCode: "78702",
      country: "USA",
      websiteUrl: "https://eaststrength.example.com",
      phone: "512-555-1111",
      latitude: 30.262,
      longitude: -97.7204,
    },
    {
      name: "Shoal Creek Yoga Collective",
      description:
        "Light-filled studio offering vinyasa, yin, and sculpt classes seven days a week with community pricing.",
      category: LocationCategory.YOGA_STUDIO,
      addressLine1: "1200 W 5th St",
      city: "Austin",
      state: "TX",
      postalCode: "78703",
      country: "USA",
      websiteUrl: "https://shoalyoga.example.com",
      phone: "512-555-2222",
      latitude: 30.2725,
      longitude: -97.7535,
    },
    {
      name: "Town Lake Track",
      description:
        "Public 400m track on the lake trail — perfect for workouts, strides, and community speed sessions.",
      category: LocationCategory.TRACK,
      addressLine1: "900 W Riverside Dr",
      city: "Austin",
      state: "TX",
      postalCode: "78704",
      country: "USA",
      latitude: 30.2605,
      longitude: -97.752,
    },
    {
      name: "Zilker Disc Golf Course",
      description:
        "18-hole shaded disc golf course with rolling hills, water views, and plenty of challenges for all levels.",
      category: LocationCategory.DISC_GOLF,
      addressLine1: "2100 Barton Springs Rd",
      city: "Austin",
      state: "TX",
      postalCode: "78704",
      country: "USA",
      latitude: 30.2669,
      longitude: -97.772,
    },
  ];

  const locations = await Promise.all(
    locationsData.map((location) =>
      prisma.location.create({
        data: {
          ...location,
          createdByUserId: demoUser.id,
        },
      }),
    ),
  );

  const map = new Map(locations.map((loc) => [loc.name, loc]));

  const eventsData = [
    {
      title: "Sunrise Track Session",
      description:
        "Interval workout led by local coaches. All paces welcome — we group you up and cheer loud.",
      eventType: EventType.CLASS,
      locationName: "Town Lake Track",
      offsetDays: 1,
      startHour: 6,
      durationMinutes: 60,
    },
    {
      title: "Sunday Flow + Coffee",
      description:
        "Easy vinyasa class with mellow beats followed by drip coffee and pastries from a local bakery.",
      eventType: EventType.CLASS,
      locationName: "Shoal Creek Yoga Collective",
      offsetDays: 3,
      startHour: 9,
      durationMinutes: 75,
    },
    {
      title: "Eastside Community Lift",
      description:
        "Coached strength class focusing on hinge + push patterns. Perfect for runners looking to get stronger.",
      eventType: EventType.CLASS,
      locationName: "Eastside Strength Lab",
      offsetDays: 2,
      startHour: 18,
      durationMinutes: 50,
    },
    {
      title: "Zilker Twilight Toss",
      description:
        "Weekly disc golf meetup — casual round with scorecards optional. Bring water and a sense of fun.",
      eventType: EventType.PICKUP,
      locationName: "Zilker Disc Golf Course",
      offsetDays: 5,
      startHour: 17,
      durationMinutes: 120,
      recurringRule: "Fridays at 5pm",
    },
  ];

  for (const event of eventsData) {
    const location = map.get(event.locationName);
    if (!location) continue;

    const start = setMinutes(
      setHours(addDays(new Date(), event.offsetDays), event.startHour),
      0,
    );
    const end = new Date(start.getTime());
    end.setMinutes(start.getMinutes() + event.durationMinutes);

    await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        locationId: location.id,
        startDateTime: start,
        endDateTime: end,
        recurringRule: event.recurringRule ?? null,
        createdByUserId: demoUser.id,
      },
    });
  }

  console.log("Seed data loaded 🌱");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
