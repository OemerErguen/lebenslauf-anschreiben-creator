import { CURRENT_SCHEMA_VERSION } from '../schema/persistedState.js';

export { CURRENT_SCHEMA_VERSION } from '../schema/persistedState.js';
export type { PersistedState, UserProfile } from '../schema/persistedState.js';

type Migration = (data: unknown) => unknown;

/**
 * Ordered list of migrations. Index N migrates from version N to N+1.
 * v1 is the current version, so this is empty until v2 exists.
 */
const migrations: Migration[] = [];

/**
 * Run all required migrations to bring `rawData` up to {@link CURRENT_SCHEMA_VERSION}.
 * Throws on missing migrations or future versions.
 * @param rawData
 * @returns The migrated state object with schemaVersion set to CURRENT_SCHEMA_VERSION.
 */
export function runMigrations(rawData: unknown): unknown {
  if (typeof rawData !== 'object' || rawData === null) {
    throw new Error('Persisted state must be an object.');
  }
  const state = rawData as { schemaVersion?: number };
  const fromVersion = state.schemaVersion ?? 1;

  if (fromVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Persisted state has schema version ${fromVersion}, but this build only understands up to ${CURRENT_SCHEMA_VERSION}. Please update the app.`,
    );
  }

  let migrated: unknown = rawData;
  for (let version = fromVersion; version < CURRENT_SCHEMA_VERSION; version++) {
    const migrate = migrations[version - 1];
    if (!migrate) {
      throw new Error(`Missing migration from v${version} to v${version + 1}.`);
    }
    migrated = migrate(migrated);
  }

  return {
    ...(migrated as object),
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
}
