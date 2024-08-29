import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  NOT_IMPLEMENTED,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  BAD_REQUEST
} from 'http-status';

type DefaultErrorInput = {
  name: string;
  code: number;
  message: string;
};

export interface ResponseError extends Error {
  status?: number;
}
export class DefaultError extends Error {
  code: number;

  constructor({ name, code, message }: DefaultErrorInput) {
    super(message);
    this.name = name;
    this.code = code;
  }
}

export class AuthError extends DefaultError {
  constructor(message = 'Não autorizado') {
    super({ name: 'AuthError', code: UNAUTHORIZED, message });
  }
}

export class NotFoundTenantError extends DefaultError {
  constructor(message = 'TenantId não encontrado') {
    super({ name: 'NotFoundTenantError', code: BAD_REQUEST, message });
  }
}

export class NotFoundError extends DefaultError {
  constructor(message = 'Conteúdo não encontrado') {
    super({ name: 'NotFoundError', code: NOT_FOUND, message });
  }
}

export class UnprocessableEntityError extends DefaultError {
  constructor(message = 'Algo deu errado') {
    super({
      name: 'UnprocessableEntityError',
      code: UNPROCESSABLE_ENTITY,
      message: `Ocorreu um erro com a aplicação, CÓD422: ${message}`
    });
  }
}
export class NotImplementedError extends DefaultError {
  constructor(message = 'funcionalidade ainda não foi implementada') {
    super({
      name: 'NotImplementedError',
      code: NOT_IMPLEMENTED,
      message: `Ocorreu um erro com a aplicação, CÓD501: ${message}`
    });
  }
}

export class InternalServerError extends DefaultError {
  constructor(message = 'Erro interno') {
    super({
      name: 'InternalServerError',
      code: INTERNAL_SERVER_ERROR,
      message
    });
  }
}
