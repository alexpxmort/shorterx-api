import pino from 'pino';
import pinoHttp from 'pino-http';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  MULTIPLE_CHOICES
} from 'http-status';

const customLogLevel = (res: any, err: any) => {
  const isWarning =
    res.statusCode >= BAD_REQUEST && res.statusCode < INTERNAL_SERVER_ERROR;

  const isError = res.statusCode >= INTERNAL_SERVER_ERROR || err;

  const isInfo =
    res.statusCode >= MULTIPLE_CHOICES && res.statusCode < BAD_REQUEST;

  if (isWarning) {
    return 'warn';
  }

  if (isError) {
    return 'error';
  }

  if (isInfo) {
    return 'info';
  }

  return 'info';
};

const customErrorMessage = (error: any, res: any) =>
  `request errored with status code: ${res.statusCode} error: ${error}`;

const pinoPrettyConfig = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
};

export const logger = pino(pinoPrettyConfig);

export const loggerExpress = pinoHttp({
  logger,
  customLogLevel,
  customErrorMessage,
  wrapSerializers: true,
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.wrapRequestSerializer((r) => {
      delete r.headers['x_secret'];
      delete r.headers['user-agent'];
      delete r.headers['accept'];
      delete r.headers['cache-control'];
      delete r.headers['accept-encoding'];
      delete r.headers['connection'];
      delete r.headers['sec-ch-ua'];
      delete r.headers['sec-ch-ua-mobile'];
      delete r.headers['sec-ch-ua-platform'];
      delete r.headers['sec-fetch-site'];
      delete r.headers['sec-fetch-mode'];
      delete r.headers['sec-fetch-dest'];
      delete r.headers['referer'];
      delete r.headers['accept-language'];
      delete r.headers['cookie'];
      return r;
    }),
    res: pino.stdSerializers.res
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error'
  }
});
