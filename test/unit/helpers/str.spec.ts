import { sanitizeForeignKeyNullable, Str } from '@helpers/str';

jest.mock('shortid', () => ({
  generate: jest.fn(() => 'mockedShortId')
}));

describe('Str', () => {
  describe('applyRawSql', () => {
    it('should return a formatted SQL string when value is provided', () => {
      const value = 'test';
      const rawSql = 'LIKE';
      const isString = true;

      const result = Str.applyRawSql(value, rawSql, isString);

      expect(result).toBe(" LIKE 'test' ");
    });

    it('should return an empty string when value is undefined', () => {
      const value = undefined;
      const rawSql = 'LIKE';

      const result = Str.applyRawSql(value, rawSql);

      expect(result).toBe('');
    });
  });

  describe('trim', () => {
    it('should trim whitespace from both ends of the string', () => {
      const str = '  test  ';

      const result = Str.trim(str);

      expect(result).toBe('test');
    });
  });

  describe('isEmpty', () => {
    it('should return true for undefined', () => {
      const value = undefined;

      const result = Str.isEmpty(value);

      expect(result).toBe(true);
    });

    it('should return false for a non-empty string', () => {
      const value = 'test';

      const result = Str.isEmpty(value);

      expect(result).toBe(false);
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter of the string', () => {
      const str = 'test';

      const result = Str.capitalize(str);

      expect(result).toBe('Test');
    });

    it('should return an empty string if input is not a string', () => {
      const str = '';

      const result = Str.capitalize(str);

      expect(result).toBe('');
    });
  });

  describe('sanitizeStr', () => {
    it('should remove specified characters from the string', () => {
      const str = 'he\'llo"';

      const result = Str.sanitizeStr(str);

      expect(result).toBe('hello');
    });
  });

  describe('generateShortId', () => {
    it('should generate a short ID with the specified character count', () => {
      const charCount = 6;

      const result = Str.generateShortId(charCount);

      expect(result).toBe('MOCKED');
    });
  });
});

describe('sanitizeForeignKeyNullable', () => {
  it('should return null if the string is empty', () => {
    // Arrange
    const str = '';

    // Act
    const result = sanitizeForeignKeyNullable(str);

    // Assert
    expect(result).toBeNull();
  });

  it('should return the original string if it is not empty', () => {
    // Arrange
    const str = 'notEmpty';

    // Act
    const result = sanitizeForeignKeyNullable(str);

    // Assert
    expect(result).toBe('notEmpty');
  });
});
