import "server-only";
import bcrypt from "bcryptjs";

const COST = 12;
// Used when the account does not exist so response timing doesn't reveal valid emails.
const DUMMY_HASH = "$2b$12$UKLP7Ax8dOD2aC1VLOOtxuHJ8btfy683HzP6ZQ43taAMrJ/7Z56sG";

export const PASSWORD_MIN = 8;

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, COST);
}

export async function verifyPassword(plain: string, hash: string | undefined | null) {
  const ok = await bcrypt.compare(plain, hash || DUMMY_HASH);
  return Boolean(hash) && ok;
}
