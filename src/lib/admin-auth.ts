import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { ADMIN_COOKIE } from "./constants";

function getPasscode(): string | null {
  const value = process.env.ADMIN_PASSCODE?.trim();
  return value ? value : null;
}

function sign(passcode: string): string {
  const secret = process.env.ADMIN_COOKIE_SECRET || passcode;
  return createHmac("sha256", secret).update(`fieri-admin:${passcode}`).digest("hex");
}

export function isAdminConfigured(): boolean {
  return Boolean(getPasscode());
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const passcode = getPasscode();
  if (!passcode) return false;
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const expected = sign(passcode);
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function createAdminToken(inputPasscode: string): string | null {
  const passcode = getPasscode();
  if (!passcode) return null;
  try {
    const a = Buffer.from(inputPasscode);
    const b = Buffer.from(passcode);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return sign(passcode);
}

export { ADMIN_COOKIE };
