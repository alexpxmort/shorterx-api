import {
  BAD_GATEWAY,
  BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} from 'http-status';

export const ErrorConstants = {
  NOT_FOUND: {
    STATUS_CODE: NOT_FOUND,
    TITLE: 'Não Encontrado',
    MESSAGE: 'Conteúdo não encontrado!',
    LOG_MESSAGE: 'Registro não encontrado!'
  },
  UNPROCESSABLE_ENTITY: {
    STATUS_CODE: UNPROCESSABLE_ENTITY,
    TITLE: 'Dados Inconsistentes',
    MESSAGE: 'Dados passados incorretos!',
    LOG_MESSAGE: 'Existem dados inválidos na requisição!'
  },
  BAD_REQUEST: {
    STATUS_CODE: BAD_REQUEST,
    TITLE: 'Erro na Requisição',
    MESSAGE:
      'Não foi possível realizar a operação devido a erro na requisição!',
    LOG_MESSAGE:
      'Não foi possível realizar a operação devido a erro de lógica de negócio na requisição!'
  },
  INTERNAL_SERVER: {
    STATUS_CODE: INTERNAL_SERVER_ERROR,
    TITLE: 'Erro Interno',
    MESSAGE: 'Error interno no servidor!',
    LOG_MESSAGE: 'Ocorreu um erro interno no servidor!'
  },
  BAD_GATEWAY: {
    STATUS_CODE: BAD_GATEWAY,
    TITLE: 'Erro no Gateway',
    MESSAGE: 'Error ao se comunicar com a API!',
    LOG_MESSAGE: 'Ocorreu ao se comunicar com o outro servidor!'
  },
  CONFLICT: {
    STATUS_CODE: CONFLICT,
    TITLE: 'Erro na Requisição',
    MESSAGE: 'Existe um conflito entre a requisição e o servidor!',
    LOG_MESSAGE: 'Existe um conflito entre a requisição e o dado no servidor!'
  },
  UNAUTHORIZED: {
    STATUS_CODE: UNAUTHORIZED,
    TITLE: 'Acesso Negado',
    MESSAGE: 'Você não tem permissão para acessar este recurso.',
    LOG_MESSAGE:
      'Tentativa de acesso não autorizado ao recurso; verifique as permissões e o estado da requisição.'
  }
};
