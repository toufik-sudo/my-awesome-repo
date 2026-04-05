/**
 * Generate a standardised frontend UI RBAC permission key.
 *
 * Format: ui.<ComponentName>[.<SubView>][.<ElementType>][.<ActionName>]
 *
 * @example
 *   generateUiPermissionKey('PropertyListPage', 'Header', 'Button', 'Add')
 *   // → 'ui.PropertyListPage.Header.Button.Add'
 *
 *   generateUiPermissionKey('Dashboard', 'Analytics')
 *   // → 'ui.Dashboard.Analytics'
 */
export function generateUiPermissionKey(
  componentName: string,
  subView?: string,
  elementType?: string,
  actionName?: string,
): string {
  if (!componentName) {
    throw new Error('componentName is required for UI permission key');
  }
  const parts = ['ui', componentName];
  if (subView) parts.push(subView);
  if (elementType) parts.push(elementType);
  if (actionName) parts.push(actionName);
  return parts.join('.');
}
