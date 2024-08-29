import { logger } from '@providers/pino/logger';
import { isCelebrateError } from 'celebrate';
import express from 'express';
import httpStatus, {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  REQUEST_ENTITY_TOO_LARGE
} from 'http-status';
import { IRequest } from '../interfaces/Request';

const getMessages = (statusCode: number, exception: any) => {
  const defaultError = {
    title: exception.title || 'Algo deu errado',
    message: exception.message || 'Ocorreu um erro, tente novamente mais tarde',
    logMessage:
      exception.logMessage ||
      exception.message ||
      'Ocorreu um erro, tente novamente mais tarde'
  };
  const knownErrors = {
    [REQUEST_ENTITY_TOO_LARGE]: {
      title: exception.title || 'Algo deu errado',
      message: 'O tamanho da solicitação excede o limite máximo',
      logMessage:
        exception.logMessage ||
        exception.message ||
        'Ocorreu um erro, tente novamente mais tarde'
    }
  };
  return (knownErrors as any)[statusCode] !== undefined
    ? (knownErrors as any)[statusCode]
    : defaultError;
};

export const errors = (
  err: any,
  request: IRequest,
  response: express.Response,
  next: express.NextFunction
): any => {
  if (!isCelebrateError(err)) {
    const { statusCode } = err;
    const status =
      (httpStatus as any)[statusCode] !== undefined
        ? (httpStatus as any)[statusCode]
        : INTERNAL_SERVER_ERROR;
    let message: any = getMessages(status, err);
    message = { ...message, ...(err?.errors && { errors: err?.errors }) };
    logger.error({
      status,
      message,
      path: request.url,
      correlationId: request.headers?.tracking?.trkid,
      requestId: request.headers?.tracking?.reqid
    });
    response.status(statusCode).json(message);
    return next();
  }
  const message = Array.from(err.details.values())
    .map((values) => values.details[0].message)
    .join(', ');
  logger.error({
    status: BAD_REQUEST,
    message,
    path: request.url,
    correlationId: request.headers?.tracking?.trkid,
    requestId: request.headers?.tracking?.reqid
  });
  response
    .status(BAD_REQUEST)
    .json({ message: `Parâmetros Inválidos: ${message}`, logMessage: message });
  return next();
};
