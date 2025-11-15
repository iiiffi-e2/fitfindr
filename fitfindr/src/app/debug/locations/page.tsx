import prisma from "@/lib/prisma";
import { GeocodeButton } from "./geocode-button";
import { RetryGeocodeButton } from "./retry-geocode-button";

export default async function DebugLocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const withoutCoords = locations.filter(
    (loc) => loc.latitude === null || loc.longitude === null,
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Debug: Locations
        </h1>
        <p className="text-sm text-slate-500">
          Check which locations have coordinates and geocode missing ones.
        </p>
      </header>

      {withoutCoords.length > 0 && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">
            {withoutCoords.length} location{withoutCoords.length !== 1 ? "s" : ""}{" "}
            missing coordinates
          </p>
          <p className="mt-2 text-sm text-amber-700">
            Click the button below to automatically geocode all locations without
            coordinates.
          </p>
          <GeocodeButton />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">All Locations</h2>
        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Full Address
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Latitude
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Longitude
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {locations.map((location) => {
                  const hasCoords =
                    location.latitude !== null && location.longitude !== null;
                  const addressParts = [
                    location.addressLine1,
                    location.addressLine2,
                    location.city,
                    location.state,
                    location.postalCode,
                    location.country,
                  ].filter(Boolean);
                  const fullAddress = addressParts.join(", ");
                  
                  return (
                    <tr key={location.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {location.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {fullAddress}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">
                        {location.latitude?.toFixed(6) ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">
                        {location.longitude?.toFixed(6) ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {hasCoords ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                            ✓ Has coords
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                            ⚠ Missing
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!hasCoords && (
                          <RetryGeocodeButton locationId={location.id} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

