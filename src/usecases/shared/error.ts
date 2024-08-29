import { ErrorConstants } from '@helpers/errors/constants';

type ObjError = {
  statusCode: number;
  logMessage?: any;
  message: any;
  errorDetails?: any;
  title?: string;
  errors?: any[];
};

class ApiError extends Error {
  statusCode: number;
  logMessage: any;
  message: any;
  errorDetails: any;
  errors?: any[];
  title: string;

  constructor(error: ObjError) {
    super();
    this.title = error.title || 'Algo deu errado';
    this.statusCode = error.statusCode;
    this.message = error.message;
    this.errors = error.errors;
    this.errorDetails = error.errorDetails;
    this.logMessage = error.logMessage;
  }

  static factory(
    type: keyof typeof ErrorConstants,
    message?: string,
    title?: string,
    errorDetails?: any
  ) {
    const { MESSAGE, LOG_MESSAGE, TITLE, STATUS_CODE } = ErrorConstants[type];
    return new ApiError({
      statusCode: STATUS_CODE,
      logMessage: LOG_MESSAGE,
      title: title || TITLE,
      message: message || MESSAGE,
      errorDetails
    });
  }

  static badRequest(message?: string, title?: string, errorDetails?: any) {
    return this.factory('BAD_REQUEST', message, title, errorDetails);
  }

  static notFound(message?: string, title?: string, errorDetails?: any) {
    return this.factory('NOT_FOUND', message, title, errorDetails);
  }

  static unAuthorized(message?: string, title?: string, errorDetails?: any) {
    return this.factory('UNAUTHORIZED', message, title, errorDetails);
  }

  static internalServer(message?: string, title?: string, errorDetails?: any) {
    return this.factory('INTERNAL_SERVER', message, title, errorDetails);
  }

  static badGateway(message?: string, title?: string, errorDetails?: any) {
    return this.factory('BAD_GATEWAY', message, title, errorDetails);
  }

  static unprocessableEntity(
    message?: string,
    title?: string,
    errorDetails?: any
  ) {
    return this.factory('UNPROCESSABLE_ENTITY', message, title, errorDetails);
  }

  static conflict(message?: string, title?: string, errorDetails?: any) {
    return this.factory('CONFLICT', message, title, errorDetails);
  }
}

export { ApiError };
