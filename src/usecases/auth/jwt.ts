import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = 'shorterx-api-key';

export interface IJwtSignIn {
  token: string;
  expiresIn: Date;
}

export function signToken(
  payload: object,
  expiresIn: string = '1h'
): IJwtSignIn {
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });

    const decoded = jwt.decode(token) as JwtPayload | null;

    const expirationTime = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date();

    return {
      token,
      expiresIn: expirationTime
    };
  } catch (err) {
    throw new Error('Error signing token: ' + (err as Error).message);
  }
}

export function verifyToken(token: string): object | null {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded as object;
  } catch (err) {
    throw new Error('Error verifying token: ' + (err as Error).message);
  }
}
