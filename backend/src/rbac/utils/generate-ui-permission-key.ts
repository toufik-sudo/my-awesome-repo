/**
 * Mirror of the frontend generateUiPermissionKey — used by the sync script
 * and backend registry so both sides produce identical keys.
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
