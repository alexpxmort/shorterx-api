import { signToken, verifyToken } from '@usecases/auth/jwt';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Auth Utils', () => {
  const secretKey = 'shorterx-api-key';

  describe('signToken', () => {
    it('should return a token and expiration date', () => {
      const payload = { userId: '123' };
      const token = 'mockedToken';
      const expirationDate = new Date();
      (jwt.sign as jest.Mock).mockReturnValue(token);
      (jwt.decode as jest.Mock).mockReturnValue({
        exp: expirationDate.getTime() / 1000
      });

      const result = signToken(payload);

      expect(result.token).toBe(token);
      expect(result.expiresIn).toEqual(expirationDate);
      expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, {
        expiresIn: '1h'
      });
    });

    it('should throw an error if signing fails', () => {
      const payload = { userId: '123' };
      const errorMessage = 'Signing error';
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      expect(() => signToken(payload)).toThrow(
        `Error signing token: ${errorMessage}`
      );
    });
  });

  describe('verifyToken', () => {
    it('should return the decoded token if verification succeeds', () => {
      const token = 'mockedToken';
      const decodedToken = { userId: '123' };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      const result = verifyToken(token);

      expect(result).toEqual(decodedToken);
      expect(jwt.verify).toHaveBeenCalledWith(token, secretKey);
    });

    it('should throw an error if verification fails', () => {
      const token = 'mockedToken';
      const errorMessage = 'Verification error';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      expect(() => verifyToken(token)).toThrow(
        `Error verifying token: ${errorMessage}`
      );
    });
  });
});
