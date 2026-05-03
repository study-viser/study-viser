import { createApiClient } from '@neondatabase/api-client';

async function setupTestDb() {
  const client = createApiClient({
    apiKey: process.env.NEON_API_KEY,
  });

  // Create a test branch
  const branch = await client.createProjectBranch(process.env.NEON_PROJECT_ID, {
    branch: {
      name: `test-${Date.now()}`,
      parent_id: process.env.NEON_BRANCH_ID,
    },
  });

  console.log(`DATABASE_URL=${branch.connection_uris[0].connection_uri}`);
}

setupTestDb();