#!/usr/bin/env node

/**
 * Test Production Environment Configuration
 * 
 * This script helps verify your production environment is configured correctly
 * before deploying to Vercel.
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load production environment variables
// Try both locations: fitfindr/env.production and ../env.production
const envPath1 = join(__dirname, 'env.production');
const envPath2 = join(__dirname, '..', 'env.production');
config({ path: envPath1 });
config({ path: envPath2 });

console.log('🔍 Testing Production Environment Configuration\n');
console.log('=' .repeat(60));

// Required environment variables
const requiredVars = {
  'DATABASE_URL': 'Database connection string',
  'NEXTAUTH_URL': 'NextAuth URL (should be your Vercel URL)',
  'NEXTAUTH_SECRET': 'NextAuth secret key',
};

let allPassed = true;

// Check each required variable
for (const [varName, description] of Object.entries(requiredVars)) {
  const value = process.env[varName];
  const exists = !!value;
  const status = exists ? '✅' : '❌';
  
  console.log(`\n${status} ${varName}`);
  console.log(`   Description: ${description}`);
  
  if (exists) {
    // Mask sensitive values
    const displayValue = varName.includes('SECRET') || varName.includes('URL') 
      ? `${value.substring(0, 20)}...${value.substring(value.length - 10)}`
      : value;
    console.log(`   Value: ${displayValue}`);
    
    // Specific checks
    if (varName === 'NEXTAUTH_URL') {
      if (!value.startsWith('https://')) {
        console.log(`   ⚠️  Warning: Should start with https:// in production`);
        allPassed = false;
      }
      if (value.includes('localhost')) {
        console.log(`   ⚠️  Warning: Should not contain localhost in production`);
        allPassed = false;
      }
    }
    
    if (varName === 'NEXTAUTH_SECRET') {
      if (value.length < 32) {
        console.log(`   ⚠️  Warning: Secret should be at least 32 characters`);
        allPassed = false;
      }
    }
    
    if (varName === 'DATABASE_URL') {
      if (!value.includes('postgres')) {
        console.log(`   ⚠️  Warning: Should be a PostgreSQL connection string`);
        allPassed = false;
      }
      if (!value.includes('sslmode=require') && !value.includes('prisma+postgres')) {
        console.log(`   ⚠️  Warning: Production database should use SSL`);
      }
    }
  } else {
    console.log(`   ❌ MISSING - This variable must be set in Vercel`);
    allPassed = false;
  }
}

console.log('\n' + '='.repeat(60));
console.log('\n📊 Summary:\n');

if (allPassed) {
  console.log('✅ All environment variables are configured correctly!');
  console.log('\n📝 Next steps:');
  console.log('   1. Ensure these same variables are set in Vercel');
  console.log('   2. Set Root Directory to "fitfindr" in Vercel settings');
  console.log('   3. Deploy your app');
  console.log('   4. Run: npx prisma migrate deploy');
  console.log('   5. Visit your app at the NEXTAUTH_URL');
} else {
  console.log('❌ Some issues were found. Please fix them before deploying.');
  console.log('\n📝 To fix:');
  console.log('   1. Update env.production file with correct values');
  console.log('   2. Set the same values in Vercel Environment Variables');
  console.log('   3. Re-run this script to verify');
}

console.log('\n' + '='.repeat(60));
console.log('\n💡 Tips:');
console.log('   - Generate a new secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
console.log('   - Test database connection: npx prisma db execute --stdin <<< "SELECT 1"');
console.log('   - View Vercel logs: vercel logs');
console.log('   - Pull Vercel env vars: vercel env pull');

process.exit(allPassed ? 0 : 1);

