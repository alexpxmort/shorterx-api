import { comparePasswords, hashPassword } from '@helpers/passwordHelper';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash the password successfully', async () => {
      const password = 'myPassword';
      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
    });

    it('should throw an error WHEN hashing fails', async () => {
      const password = 'myPassword';
      const errorMessage = 'Hashing error';
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(hashPassword(password)).rejects.toThrow(
        `Error hashing password: ${errorMessage}`
      );
    });
  });

  describe('comparePasswords', () => {
    it('should return true WHEN passwords match', async () => {
      const password = 'myPassword';
      const hashedPassword = 'hashedPassword';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await comparePasswords(password, hashedPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return false WHEN passwords do not match', async () => {
      const password = 'myPassword';
      const hashedPassword = 'hashedPassword';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await comparePasswords(password, hashedPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should throw an error WHEN comparison fails', async () => {
      const password = 'myPassword';
      const hashedPassword = 'hashedPassword';
      const errorMessage = 'Comparison error';
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(comparePasswords(password, hashedPassword)).rejects.toThrow(
        `Error comparing passwords: ${errorMessage}`
      );
    });
  });
});
