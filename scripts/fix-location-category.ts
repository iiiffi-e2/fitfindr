import { PrismaClient, LocationCategory } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fix a location's category
 * Usage: npx tsx scripts/fix-location-category.ts <locationId> <newCategory>
 * Example: npx tsx scripts/fix-location-category.ts cmi0tzt1f0001l504cbnmi5bb BASKETBALL_COURT
 */
async function fixLocationCategory() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('\n❌ Usage: npx tsx scripts/fix-location-category.ts <locationId> <newCategory>');
    console.error('\nValid categories:');
    Object.keys(LocationCategory).forEach(cat => console.error(`  - ${cat}`));
    console.error('\nExample: npx tsx scripts/fix-location-category.ts cmi0tzt1f0001l504cbnmi5bb BASKETBALL_COURT\n');
    process.exit(1);
  }

  const locationId = args[0];
  const newCategory = args[1] as LocationCategory;

  // Validate category
  if (!Object.keys(LocationCategory).includes(newCategory)) {
    console.error(`\n❌ Invalid category: ${newCategory}`);
    console.error('\nValid categories:');
    Object.keys(LocationCategory).forEach(cat => console.error(`  - ${cat}`));
    console.error('');
    process.exit(1);
  }
  
  try {
    // First, fetch the location to see what we're updating
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      select: {
        id: true,
        name: true,
        category: true,
        city: true,
        state: true,
      }
    });

    if (!location) {
      console.error(`\n❌ Location with ID ${locationId} not found\n`);
      process.exit(1);
    }

    console.log('\n📍 Found location:');
    console.log(`   Name: ${location.name}`);
    console.log(`   Current Category: ${location.category}`);
    console.log(`   Location: ${location.city}, ${location.state}`);
    console.log(`\n🔄 Updating category from ${location.category} to ${newCategory}...\n`);

    // Update the category
    const updated = await prisma.location.update({
      where: { id: locationId },
      data: { 
        category: newCategory
      }
    });

    console.log('✅ Successfully updated location!');
    console.log(`   Name: ${updated.name}`);
    console.log(`   New Category: ${updated.category}`);
    console.log(`   Updated At: ${updated.updatedAt}`);
    console.log('\n✨ Done!\n');

  } catch (error) {
    console.error('❌ Error updating location:', error);
    throw error;
  }
}

fixLocationCategory()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

