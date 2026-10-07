import { requireAdminPage } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { AdminShell, type AdminNavItem } from "@/components/admin/admin-shell";

// Every admin page reads the session cookie; render per request.
export const instant = false;

export const metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdminPage("dashboard.view");
  const nav: AdminNavItem[] = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/analytics", label: "WhatsApp analytics", icon: "analytics" },
    { href: "/admin/leads", label: "Leads", icon: "leads" },
    { href: "/admin/requests", label: "Custom requests", icon: "requests" },
    ...(can(admin.role, "catalog.edit")
      ? ([
          { href: "/admin/projects", label: "Projects", icon: "projects" },
          { href: "/admin/categories", label: "Categories", icon: "categories" },
          { href: "/admin/degrees", label: "Degrees", icon: "degrees" },
          { href: "/admin/testimonials", label: "Testimonials", icon: "testimonials" },
          { href: "/admin/faqs", label: "FAQs", icon: "faqs" },
          { href: "/admin/seo", label: "SEO health", icon: "seo" },
        ] as AdminNavItem[])
      : []),
    ...(can(admin.role, "users.manage") ? ([{ href: "/admin/users", label: "Admin users", icon: "users" }] as AdminNavItem[]) : []),
  ];
  return (
    <AdminShell nav={nav} admin={{ name: admin.name || admin.email, email: admin.email, role: admin.role }}>
      {children}
    </AdminShell>
  );
}
