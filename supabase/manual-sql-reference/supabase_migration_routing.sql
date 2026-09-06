-- Route persistence (refresh keeps the user on the current page).
-- Currently implemented client-side only: the active section is persisted
-- in localStorage (khalil-active-section) and read back on page load.
-- No database changes are required for this to work.

-- The optional server-side version of this (syncing across devices/browsers)
-- shares the same user_preferences table used for navigation state.
-- See supabase_migration_navigation.sql — do not duplicate the CREATE TABLE
-- here, it's defined there once only.

-- STATUS: No schema changes needed. Nothing to execute from this file.