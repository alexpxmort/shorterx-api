import xss, { IFilterXSSOptions } from 'xss';
import { NextFunction, Request, Response } from 'express';

interface SanitizeOptions {
  allowedKeys?: string[];
  sanitizerOptions?: IFilterXSSOptions;
}

const hasOwn = (object: any, key: string): boolean => {
  const keys = Reflect.ownKeys(object).filter(
    (item) => typeof item !== 'symbol'
  );
  return keys.includes(key);
};

const initializeOptions = (options: SanitizeOptions): SanitizeOptions => {
  const sanitizerOptions: IFilterXSSOptions = {};
  if (hasOwn(options, 'sanitizerOptions') && options.sanitizerOptions) {
    Object.assign(sanitizerOptions, options.sanitizerOptions);
  }

  return {
    allowedKeys:
      (hasOwn(options, 'allowedKeys') &&
        Array.isArray(options.allowedKeys) &&
        options.allowedKeys) ||
      [],
    sanitizerOptions
  };
};

const sanitize = (options: SanitizeOptions, data: any): any => {
  if (typeof data === 'string') {
    return xss(data, options.sanitizerOptions);
  }
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (typeof item === 'string') {
        return xss(item, options.sanitizerOptions);
      }
      if (Array.isArray(item) || typeof item === 'object') {
        return sanitize(options, item);
      }
      return item;
    });
  }
  if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach((key) => {
      if (options.allowedKeys?.includes(key)) {
        return;
      }
      const item = data[key];
      if (typeof item === 'string') {
        data[key] = xss(item, options.sanitizerOptions);
      } else if (Array.isArray(item) || typeof item === 'object') {
        data[key] = sanitize(options, item);
      }
    });
  }
  return data;
};

const prepareSanitize = (data: any, options: SanitizeOptions = {}): any => {
  options = initializeOptions(options);
  return sanitize(options, data);
};

export const sanitizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.body = prepareSanitize(req.body);
  req.params = prepareSanitize(req.params);
  req.query = prepareSanitize(req.query);
  next();
};
