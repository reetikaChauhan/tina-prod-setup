import { createDatabase, createLocalDatabase } from '@tinacms/datalayer';
import { GitHubProvider } from 'tinacms-gitprovider-github';
import { Redis } from '@upstash/redis';
import { RedisLevel } from 'upstash-redis-level';

// Check if running locally or in production
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

// Determine the Git branch
const branch = process.env.GITHUB_BRANCH;
const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN ;
const owner = process.env.GITHUB_OWNER ;
const repo = process.env.GITHUB_REPO ;
// Throw an error if no branch is set
if (!branch) {
  throw new Error(
    'No branch found. Ensure GITHUB_BRANCH is set in your environment variables.'
  );
}

// Export the database configuration
export default isLocal
  ? // Use local in-memory database for development
    createLocalDatabase()
  : // Use GitHub and Redis in production
    createDatabase({
      // GitHub provider configuration
      gitProvider: new GitHubProvider({
        repo,
        owner, // GitHub username/organization
        token,
        branch, // Git branch
      }),
      // Redis database adapter configuration
      databaseAdapter: new RedisLevel({
        redis: new Redis({
          url: process.env.KV_REST_API_URL , // Redis URL
          token: process.env.KV_REST_API_TOKEN, // Redis token
        }),
        debug: process.env.DEBUG === 'true', // Enable debugging if needed
        namespace: branch, // Use branch name as Redis namespace
      }),
    });
