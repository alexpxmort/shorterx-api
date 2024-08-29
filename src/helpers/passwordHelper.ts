import bcrypt from 'bcryptjs';

const saltRounds = 12;

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw new Error('Error hashing password: ' + (err as Error).message);
  }
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (err) {
    throw new Error('Error comparing passwords: ' + (err as Error).message);
  }
}
