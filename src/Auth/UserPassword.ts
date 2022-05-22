import bcrypt from "bcrypt";

export async function HashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export async function VerifyPassword(tocheck: string, param: string) {
  return await bcrypt.compare(tocheck, param);
}
