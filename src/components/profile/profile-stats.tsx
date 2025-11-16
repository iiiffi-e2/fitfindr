import { MapPin, CalendarDays, MessageSquare, ThumbsUp } from "lucide-react";

type Props = {
  stats: {
    locationsCount: number;
    eventsCount: number;
    reviewsCount: number;
    votesCount: number;
  };
};

export function ProfileStats({ stats }: Props) {
  const statItems = [
    {
      icon: <MapPin className="h-5 w-5 text-brand" />,
      label: "Locations",
      value: stats.locationsCount,
    },
    {
      icon: <CalendarDays className="h-5 w-5 text-brand" />,
      label: "Events",
      value: stats.eventsCount,
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-brand" />,
      label: "Reviews",
      value: stats.reviewsCount,
    },
    {
      icon: <ThumbsUp className="h-5 w-5 text-brand" />,
      label: "Votes",
      value: stats.votesCount,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
            {item.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
            <p className="text-sm text-slate-500">{item.label}</p>
          </div>
        </div>
      ))}
    </section>
  );
}


