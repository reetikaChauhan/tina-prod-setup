import database from '../../tina/database';
import { queries } from '../../tina/__generated__/types';
import { resolve } from '@tinacms/datalayer';

export async function databaseRequest({ query, variables }) {
  const config = {
    useRelativeMedia: true,
  };

  const result = await resolve({
    config,
    database,
    query,
    variables,
    verbose: true,
  });

  return result;
}

export function getDatabaseConnection({ queries }) {
  const request = async ({ query, variables }) => {
    const data = await databaseRequest({ query, variables });
    return { data: data.data, query, variables, errors: data.errors };
  };

  const q = queries({
    request,
  });

  return { queries: q, request };
}

export const dbConnection = getDatabaseConnection({ queries });
