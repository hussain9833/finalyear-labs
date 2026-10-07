import { ADMIN_ROLES, type AdminRole } from "@/lib/constants";

/** Single source of truth for admin permissions (docs/SECURITY_ACCESS.md §3). */
export const PERMISSIONS = {
  "dashboard.view": "viewer",
  "analytics.view": "viewer",
  "leads.view": "viewer",
  "leads.edit": "admin",
  "requests.edit": "admin",
  "catalog.edit": "editor",
  "catalog.publish": "admin",
  "catalog.delete": "owner",
  "content.edit": "editor",
  "content.publish": "admin",
  "seo.view": "editor",
  "users.manage": "owner",
} as const satisfies Record<string, AdminRole>;

export type Permission = keyof typeof PERMISSIONS;

export const roleRank = (role: AdminRole) => ADMIN_ROLES.indexOf(role);

export function hasRole(role: AdminRole, min: AdminRole) {
  return roleRank(role) >= roleRank(min);
}

export function can(role: AdminRole, permission: Permission) {
  return hasRole(role, PERMISSIONS[permission]);
}
