"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { geocodeExistingLocations } from "@/actions/geocode-locations";

export function GeocodeButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleGeocode = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const res = await geocodeExistingLocations();
      setResults(res);
      router.refresh();
    } catch (error) {
      console.error("Error geocoding locations:", error);
      alert("Error geocoding locations. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <button
        onClick={handleGeocode}
        disabled={isLoading}
        className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {isLoading ? "Geocoding..." : "Geocode Missing Locations"}
      </button>

      {results && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-900">Results:</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {results.map((result, i) => (
              <li
                key={i}
                className={
                  result.success ? "text-green-700" : "text-rose-700"
                }
              >
                {result.success ? "✓" : "✗"} {result.name}
                {result.success &&
                  ` (${result.coordinates.latitude.toFixed(4)}, ${result.coordinates.longitude.toFixed(4)})`}
                {!result.success && ` - ${result.error}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

