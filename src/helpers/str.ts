import shortId from 'shortid';

export const Str = {
  applyRawSql: (
    value: string | undefined | number,
    rawSql: string,
    isString = true
  ): string => {
    const valueOnType = isString ? `'${value}'` : value;
    return value && value != 'undefined' ? ` ${rawSql} ${valueOnType} ` : '';
  },
  trim: (str: string | undefined = ''): string => {
    return str.trim();
  },
  isEmpty: (value: any | any[]): boolean => {
    return (
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  },
  capitalize(str: string) {
    if (typeof str !== 'string' || str.length === 0) {
      return '';
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  sanitizeStr: (str: string) => {
    const charsToRemove = ["'", '"'];
    const regex = new RegExp(`[${charsToRemove.join('')}]`, 'g');
    return str.replace(regex, '');
  },
  generateShortId: (charCount: number) => {
    const id = shortId.generate();
    return id.slice(0, charCount)?.toUpperCase();
  }
};

export const sanitizeForeignKeyNullable = (
  string: string | null
): string | null => {
  return string !== '' ? string : null;
};
