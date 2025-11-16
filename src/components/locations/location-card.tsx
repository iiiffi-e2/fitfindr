import { MapPin } from "lucide-react";
import Link from "next/link";

type LocationCardProps = {
  id: string;
  name: string;
  description: string;
  category: string;
  city: string;
  state: string;
};

type Props = {
  location: LocationCardProps;
};

export function LocationCard({ location }: Props) {
  return (
    <Link
      href={`/locations/${location.id}`}
      className="flex flex-col gap-2 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand">
        <span>{location.category.replaceAll("_", " ")}</span>
        <span className="text-slate-400">Location</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{location.name}</h3>
      <p className="text-sm text-slate-600 line-clamp-2">
        {location.description}
      </p>
      <p className="mt-auto flex items-center gap-1 text-sm font-medium text-slate-700">
        <MapPin className="h-4 w-4 text-brand" />
        {location.city}, {location.state}
      </p>
    </Link>
  );
}
