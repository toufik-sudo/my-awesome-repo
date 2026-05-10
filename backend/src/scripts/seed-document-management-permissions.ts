/**
 * Seed script for the document management workflow permissions.
 *
 * Backend permissions (rbac_backend_permissions):
 *   - DocumentValidationController.uploadDocument.POST   → admin, manager (+ hyper)
 *   - DocumentValidationController.getByProperty.GET     → admin, manager (+ hyper)
 *   - DocumentValidationController.getPendingDocuments.GET → hyper only (already exists, refreshed)
 *   - DocumentValidationController.approveDocument.PUT   → hyper only (refresh)
 *   - DocumentValidationController.rejectDocument.PUT    → hyper only (refresh)
 *
 * Frontend UI permissions (rbac_frontend_permissions):
 *   - ui.PropertyDocumentsManager.Page.View
 *   - ui.PropertyDocumentsManager.Header.Button.Upload
 *   - ui.PropertyDocumentsManager.Card.Button.Replace
 *   - ui.PropertyDocumentsManager.Card.Button.Approve         (hyper)
 *   - ui.PropertyDocumentsManager.Card.Button.Reject          (hyper)
 *   - ui.PropertyDocumentsManager.Card.Badge.Archived         (hyper)
 *   - ui.PropertyDocumentsManager.Filter.Status.Archived      (hyper)
 *   - ui.AdminManagerDashboard.Documents.Tab.View             (admin/manager)
 *
 * Frontend → Backend permission_bindings:
 *   - documentsApi.upload.POST          → backend.DocumentValidationController.uploadDocument.POST
 *   - documentsApi.getByProperty.GET    → backend.DocumentValidationController.getByProperty.GET
 *
 * Run:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-document-management-permissions.ts
 */

import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { generateUiPermissionKey } from '../rbac/utils/generate-ui-permission-key';

dotenvConfig({ path: '.env' });

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
});

const HYPER = ['hyper_admin', 'hyper_manager'];
const ADMIN_PLUS = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];
const HYPER_ONLY = ['hyper_admin', 'hyper_manager'];

interface BackendPerm {
  key: string;          // backend.<Controller>.<endpoint>.<METHOD>
  controller: string;
  endpoint: string;
  method: string;
  endpoint_url: string;
  user_roles: string[];
  module: string;
  description: string;
}

interface UiPerm {
  key: string;
  component: string;
  sub_view?: string;
  element_type?: string;
  action_name?: string;
  user_roles: string[];
  module: string;
  description: string;
}

const BACKEND_PERMS: BackendPerm[] = [
  {
    key: 'backend.DocumentValidationController.uploadDocument.POST',
    controller: 'DocumentValidationController',
    endpoint: 'uploadDocument',
    method: 'POST',
    endpoint_url: '/documents/upload',
    user_roles: ADMIN_PLUS,
    module: 'document_validation',
    description: 'Upload a property document (new or replacement). Hyper validates after.',
  },
  {
    key: 'backend.DocumentValidationController.getByProperty.GET',
    controller: 'DocumentValidationController',
    endpoint: 'getByProperty',
    method: 'GET',
    endpoint_url: '/documents/property/:propertyId',
    user_roles: ADMIN_PLUS,
    module: 'document_validation',
    description: 'List documents per property (archived only visible to hyper roles).',
  },
  {
    key: 'backend.DocumentValidationController.getPendingDocuments.GET',
    controller: 'DocumentValidationController',
    endpoint: 'getPendingDocuments',
    method: 'GET',
    endpoint_url: '/documents/pending',
    user_roles: HYPER_ONLY,
    module: 'document_validation',
    description: 'Pending documents (hyper-only review queue).',
  },
  {
    key: 'backend.DocumentValidationController.approveDocument.PUT',
    controller: 'DocumentValidationController',
    endpoint: 'approveDocument',
    method: 'PUT',
    endpoint_url: '/documents/:id/approve',
    user_roles: HYPER_ONLY,
    module: 'document_validation',
    description: 'Approve (hyper). Replacement auto-archives the original.',
  },
  {
    key: 'backend.DocumentValidationController.rejectDocument.PUT',
    controller: 'DocumentValidationController',
    endpoint: 'rejectDocument',
    method: 'PUT',
    endpoint_url: '/documents/:id/reject',
    user_roles: HYPER_ONLY,
    module: 'document_validation',
    description: 'Reject (hyper).',
  },
];

const UI_PERMS: UiPerm[] = [
  {
    key: generateUiPermissionKey('PropertyDocumentsManager', undefined, 'Page', 'View'),
    component: 'PropertyDocumentsManager',
    element_type: 'Page',
    action_name: 'View',
    user_roles: ADMIN_PLUS,
    module: 'document_validation',
    description: 'View property documents manager page.',
  },
  {
    key: generateUiPermissionKey('PropertyDocumentsManager', 'Header', 'Button', 'Upload'),
    component: 'PropertyDocumentsManager',
    sub_view: 'Header',
    element_type: 'Button',
    action_name: 'Upload',
    user_roles: ADMIN_PLUS,
    module: 'document_validation',
    description: 'Upload a new document.',
  },
  {
    key: generateUiPermissionKey('PropertyDocumentsManager', 'Card', 'Button', 'Replace'),
    component: 'PropertyDocumentsManager',
    sub_view: 'Card',
    element_type: 'Button',
    action_name: 'Replace',
    user_roles: ADMIN_PLUS,
    module: 'document_validation',
    description: 'Submit a replacement for an existing document (pending hyper approval).',
  },
  {
    key: generateUiPermissionKey('PropertyDocumentsManager', 'Card', 'Button', 'Approve'),
    component: 'PropertyDocumentsManager',
    sub_view: 'Card',
    element_type: 'Button',
    action_name: 'Approve',
    user_roles: HYPER_ONLY,
    module: 'document_validation',
    description: 'Approve a document (hyper only).',
  },
  {
    key: generateUiPermissionKey('PropertyDocumentsManager', 'Card', 'Button', 'Reject'),
    component: 'PropertyDocumentsManager',
    sub_view: 'Card',
    element_type: 'Button',
    action_name: 'Reject',
    user_roles: HYPER_ONLY,
    module: 'document_validation',
    description: 'Reject a document (hyper only).',
  },
  {
    key: generateUiPermissionKey('PropertyDocumentsManager', 'Card', 'Badge', 'Archived'),
    component: 'PropertyDocumentsManager',
    sub_view: 'Card',
    element_type: 'Badge',
    action_name: 'Archived',
    user_roles: HYPER_ONLY,
    module: 'document_validation',
    description: 'Show "archived" badge on superseded documents (hyper only).',
  },
  {
    key: generateUiPermissionKey('PropertyDocumentsManager', 'Filter', 'Status', 'Archived'),
    component: 'PropertyDocumentsManager',
    sub_view: 'Filter',
    element_type: 'Status',
    action_name: 'Archived',
    user_roles: HYPER_ONLY,
    module: 'document_validation',
    description: 'Filter documents by archived status (hyper only).',
  },
  {
    key: generateUiPermissionKey('AdminManagerDashboard', 'Documents', 'Tab', 'View'),
    component: 'AdminManagerDashboard',
    sub_view: 'Documents',
    element_type: 'Tab',
    action_name: 'View',
    user_roles: ['admin', 'manager'],
    module: 'document_validation',
    description: 'Show "Documents" tab in admin/manager dashboard.',
  },
];

const BINDINGS: { frontendPermissionApi: string; backendPermissionKey: string; module: string }[] = [
  {
    frontendPermissionApi: 'documentsApi.upload.POST',
    backendPermissionKey: 'backend.DocumentValidationController.uploadDocument.POST',
    module: 'document_validation',
  },
  {
    frontendPermissionApi: 'documentsApi.getByProperty.GET',
    backendPermissionKey: 'backend.DocumentValidationController.getByProperty.GET',
    module: 'document_validation',
  },
];

// ─── In-memory duplicate validation ─────────────────────────────────────────

function validateNoDuplicates(): void {
  const errors: string[] = [];
  const seenBackend = new Set<string>();
  for (const p of BACKEND_PERMS) {
    if (seenBackend.has(p.key)) errors.push(`Duplicate backend key: ${p.key}`);
    seenBackend.add(p.key);
  }
  const seenUi = new Set<string>();
  for (const p of UI_PERMS) {
    if (seenUi.has(p.key)) errors.push(`Duplicate UI key: ${p.key}`);
    seenUi.add(p.key);
  }
  if (errors.length) {
    console.error('❌ Duplicate permission_key definitions detected:');
    for (const e of errors) console.error(`   - ${e}`);
    process.exit(1);
  }
}

// ─── Run ────────────────────────────────────────────────────────────────────

async function run() {
  validateNoDuplicates();

  await AppDataSource.initialize();
  console.log('✅ Database connected');

  let bIns = 0, bUpd = 0, uIns = 0, uUpd = 0, bindIns = 0, bindUpd = 0;

  // backend
  for (const p of BACKEND_PERMS) {
    const result: any = await AppDataSource.query(
      `INSERT INTO rbac_backend_permissions
         (id, permission_key, controller, endpoint, method, endpoint_url, user_roles, module, description, scope, allowed)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, 'global', true)
       ON DUPLICATE KEY UPDATE
         user_roles = VALUES(user_roles),
         module = VALUES(module),
         description = VALUES(description),
         endpoint_url = VALUES(endpoint_url)`,
      [p.key, p.controller, p.endpoint, p.method, p.endpoint_url, JSON.stringify(p.user_roles), p.module, p.description],
    );
    if (result.affectedRows === 1) bIns++; else bUpd++;
  }

  // frontend ui
  for (const p of UI_PERMS) {
    const result: any = await AppDataSource.query(
      `INSERT INTO rbac_frontend_permissions
         (id, permission_key, component, sub_view, element_type, action_name, user_roles, module, description, allowed)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, true)
       ON DUPLICATE KEY UPDATE
         user_roles = VALUES(user_roles),
         module = VALUES(module),
         description = VALUES(description)`,
      [p.key, p.component, p.sub_view || null, p.element_type || null, p.action_name || null,
        JSON.stringify(p.user_roles), p.module, p.description],
    );
    if (result.affectedRows === 1) uIns++; else uUpd++;
  }

  // bindings
  for (const b of BINDINGS) {
    const result: any = await AppDataSource.query(
      `INSERT INTO rbac_permission_bindings
         (id, frontendPermissionApi, backendPermissionId, endpoint_url, module, created_at, updated_at)
       VALUES (UUID(), ?, ?, (SELECT endpoint_url FROM rbac_backend_permissions WHERE permission_key = ? LIMIT 1), ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         module = VALUES(module),
         updated_at = NOW()`,
      [b.frontendPermissionApi, b.backendPermissionKey, b.backendPermissionKey, b.module],
    );
    if (result.affectedRows === 1) bindIns++; else bindUpd++;
  }

  console.log(`✅ Backend perms — inserted: ${bIns}, updated: ${bUpd}, total: ${BACKEND_PERMS.length}`);
  console.log(`✅ UI perms      — inserted: ${uIns}, updated: ${uUpd}, total: ${UI_PERMS.length}`);
  console.log(`✅ Bindings      — inserted: ${bindIns}, updated: ${bindUpd}, total: ${BINDINGS.length}`);

  await AppDataSource.destroy();
}

run().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
