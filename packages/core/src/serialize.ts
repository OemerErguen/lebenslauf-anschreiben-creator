import { CURRENT_SCHEMA_VERSION, type PersistedState, runMigrations } from './migrations/index.js';
import { persistedStateSchema } from './schema/persistedState.js';

/**
 * Produce a deterministic JSON string ready for file download.
 * @param state
 * @returns JSON string of the validated state.
 */
export function serialize(state: PersistedState): string {
  const validated = persistedStateSchema.parse({
    ...state,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  });
  return JSON.stringify(validated, null, 2);
}

/**
 * Parse a JSON string from user import, migrate, and validate. Throws on failure.
 * @param json
 * @returns The parsed and validated state.
 */
export function deserialize(json: string): PersistedState {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (error) {
    throw new Error(`Invalid JSON: ${(error as Error).message}`);
  }

  const migrated = runMigrations(raw);
  return persistedStateSchema.parse(migrated);
}
