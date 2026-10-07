/** PII masking for low-privilege (viewer) admin roles. */
export function maskPhone(v?: string | null) {
  if (!v) return "";
  return v.length <= 4 ? "••••" : `${v.slice(0, 3)}•••••${v.slice(-3)}`;
}

export function maskEmail(v?: string | null) {
  if (!v) return "";
  const [user, domain] = v.split("@");
  if (!domain) return "•••";
  return `${user!.slice(0, 2)}•••@${domain}`;
}
