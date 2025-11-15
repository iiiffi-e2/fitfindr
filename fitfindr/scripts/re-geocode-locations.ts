/**
 * Script to re-geocode all locations with proper full addresses
 * Run with: npx tsx scripts/re-geocode-locations.ts
 */

import { reGeocodeAllLocations } from "../src/actions/geocode-locations";

async function main() {
  console.log("Starting re-geocoding of all locations...\n");
  console.log("This will use the full address with fallback strategies:");
  console.log("1. Full address with all fields");
  console.log("2. Address without line 2");
  console.log("3. City, state, and postal code");
  console.log("4. City and state only\n");

  const results = await reGeocodeAllLocations();

  console.log("\n\n=== SUMMARY ===");
  console.log(`Total locations: ${results.length}`);
  console.log(`Successful: ${results.filter((r) => r.success).length}`);
  console.log(`Failed: ${results.filter((r) => !r.success).length}`);

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log("\n=== FAILED LOCATIONS ===");
    failed.forEach((result) => {
      console.log(`- ${result.name}: ${result.error}`);
    });
  }

  console.log("\nDone!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

