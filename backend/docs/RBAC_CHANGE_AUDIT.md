# RBAC Change Audit

## 2026-04-22

### Frontend login bootstrap
- Fixed the web RBAC bootstrap so permission loading is triggered immediately after login without requiring a manual page reload.
- Added a stale/missing-cache check in `src/components/RbacBootstrap.tsx` so Redux/localStorage are repopulated when auth is ready but cached RBAC payloads are empty.
- Relaxed bootstrap fetches for backend role permissions and permission bindings to avoid aborting the whole RBAC initialization when one secondary endpoint temporarily fails.

### Backend permission resolution
- Updated `backend/src/user/services/rbac-config.service.ts` so:
  - `hyper_admin` always passes backend permission checks.
  - missing backend permission keys default to allow instead of deny, matching the project's fail-open expectation for keys not yet present in DB.
- This resolves 403 responses such as `backend.RbacConfigController.getBackendCatalog.GET` even when the cache or seed state is temporarily behind the database.

### Seed scripts
- Updated `backend/src/scripts/rbac.seed.ts` to populate `endpoint_url` values during backend permission seeding.
- Added an explicit seed entry for `RbacConfigController.getBackendCatalog.GET`.
- Added URL generation/override helpers so RBAC config endpoints receive deterministic `endpoint_url` values in `rbac_backend_permissions` and downstream permission bindings.

### Validation
- Verified the frontend app still compiles successfully with `npm run build`.

### Live API catalog + DB diff
- New `backend/src/rbac/services/backend-route-mapper.service.ts` introspects every Nest controller via `DiscoveryService` + `MetadataScanner` and produces a live route map (controller, endpoint, method, generated permission_key, full URL, module).
- New `backend/src/rbac/services/frontend-api-catalog.service.ts` loads the static `backend/src/rbac/data/frontend-api-catalog.json` and merges it with a runtime catalog supplied by the web client.
- Refactored `RbacConfigService.getBackendApiCatalog()` to read from the route mapper instead of `backendCache`, annotating each entry with `inDb` so RBAC Settings can flag missing rows.
- Added `getBackendCatalogDiff()` and `getFrontendApiCatalog/Diff()` for missing-vs-orphan analysis between the live code and the rbac_*_permissions tables.
- New endpoints on `RbacConfigController`: `GET /rbac-config/backend/catalog/diff`, `POST /rbac-config/frontend/catalog`, `POST /rbac-config/frontend/catalog/diff`.
- Web: added `scripts/generate-frontend-api-catalog.ts` (scans `rbac('...')` calls), generates `src/lib/frontend-api-catalog.generated.ts` and copies the same JSON into the backend's data folder.
- Web: added a "Diff" tab in `RbacSettingsPage` rendering `RbacCatalogDiffPanel`, which shows missing/orphan permissions for both backend routes and frontend API keys with quick-create handles.