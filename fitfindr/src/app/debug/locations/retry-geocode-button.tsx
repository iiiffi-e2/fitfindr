"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { geocodeSingleLocation } from "@/actions/geocode-locations";

type Props = {
  locationId: string;
};

export function RetryGeocodeButton({ locationId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRetry = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const res = await geocodeSingleLocation(locationId);
      setResult(res);
      
      if (res.success) {
        // Refresh the page after a short delay to show the success message
        setTimeout(() => {
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
      setResult({ success: false, error: "Unexpected error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleRetry}
        disabled={isLoading}
        className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
      >
        {isLoading ? "Trying..." : "Retry"}
      </button>
      
      {result && (
        <div className="text-xs">
          {result.success ? (
            <p className="text-green-700">
              ✓ Found! ({result.coordinates.latitude.toFixed(4)}, {result.coordinates.longitude.toFixed(4)})
            </p>
          ) : (
            <p className="text-rose-700">✗ {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

