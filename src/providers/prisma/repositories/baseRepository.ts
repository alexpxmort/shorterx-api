import { logger } from '@providers/pino/logger';
import { randomUUID } from 'crypto';
import { Str } from '@helpers/str';

type QueryOptions = Record<string, any>;
type BaseDataType = { [key: string]: any };
type WhereType =
  | {
      where:
        | { [x: string]: any }
        | {
            OR: (
              | { [x: string]: { [x: string]: { contains: string } } }
              | { [x: string]: { contains: string } }
            )[];
          };
    }
  | { [x: string]: any };
type Data<TType> = Partial<TType> | TType;
type AsyncData<TType> = Promise<TType>;
type DataList<TType> = Data<TType>[];
type AsyncDataList<TType> = Promise<TType[]>;
type ExecuteAll<TType> = (data: Data<TType>) => AsyncData<TType>;
type ExecuteAllAtomic<TType> = (
  functionORM: (options: any) => AsyncData<TType>,
  data: Data<TType>
) => AsyncData<TType>;

export type BaseRepository<TType extends BaseDataType> =
  typeof baseRepository<TType>;

export type Paginate<TType> = {
  data: DataList<TType>;
  total: number;
};

export type TotalSave = {
  count: number;
};

export type SaveAll<TType> = {
  success: DataList<TType>;
  error: DataList<TType>;
};

export type ConfigurationBaseRepository = {
  description?: string;
  tableFilterFields?: string[];
  idField?: string;
  createdAtField?: string;
  updatedAtField?: string;
  onGenerateId?: (id?: string | number) => any;
  fieldsNotEditable?: string[];
};

export type QueryParams = {
  distinct?: string[];
  fields?: string[];
  filter?: string;
  filterFields?: string[];
  orderBy?: BaseDataType;
  relations?: string[];
  skip?: number;
  take?: number;
  where?: WhereType;
};

const baseRepository = <TType extends BaseDataType>(
  client: any,
  modelName: string,
  configuration: ConfigurationBaseRepository = {}
) => {
  const table = client[modelName];
  const {
    description,
    tableFilterFields = [],
    idField = 'id',
    createdAtField,
    updatedAtField,
    fieldsNotEditable = [],
    onGenerateId = () => randomUUID()
  } = configuration;

  const _executeQuery = async (
    execute: () => Promise<any>,
    functionName: string
  ) => {
    try {
      return await execute();
    } catch (error: any) {
      logger.error({
        message: error?.message,
        function: `${modelName}::${functionName}${
          description ? `(${description})` : ''
        }`
      });
      throw error;
    }
  };

  const _setWhere = (
    where?: BaseDataType,
    filter = '',
    filterFields: string[] = []
  ): WhereType | undefined => {
    const formatFilter = (filter: string, fields: string[]) => {
      return fields.map((field) => {
        if (field.includes('.')) {
          const [relation, fieldRelation] = field.split('.');
          return {
            [relation]: {
              [fieldRelation]: { contains: filter }
            }
          };
        } else {
          return {
            [field]: { contains: filter }
          };
        }
      });
    };

    const setFilterFields = (filter = '', fields: string[] = []) => {
      fields = fields?.length ? fields : tableFilterFields;
      if (filter && fields?.length) {
        const filterFormatted = formatFilter(filter, fields);
        return filterFormatted.length > 1
          ? { OR: filterFormatted }
          : filterFormatted[0];
      }
      return undefined;
    };

    const filters = setFilterFields(filter, filterFields);
    if (!where && !filters) return undefined;
    return { where: { ...(where || {}), ...(filters || {}) } };
  };

  const _setSelectOrInclude = (fields?: string[], relations?: string[]) => {
    const formatFieldsWithTrue = (
      fields: string[],
      options: QueryOptions = {}
    ) => {
      fields.forEach((field) => {
        if (field.includes('.')) {
          const [relation, ...fieldsRelation] = field.split('.');
          options[relation] = {
            ...options[relation],
            select: formatFieldsWithTrue(
              [fieldsRelation.join('.')],
              options[relation]?.select
            )
          };
        } else {
          options[field] = true;
        }
      });
      return options;
    };

    const options: QueryOptions = {};
    if (fields?.length && !relations?.length) {
      options.select = formatFieldsWithTrue(fields);
    } else if (relations?.length && !fields?.length) {
      options.include = formatFieldsWithTrue(relations);
    } else if (fields?.length && relations?.length) {
      options.select = formatFieldsWithTrue([...fields, ...relations]);
    }
    return options;
  };

  const _setDefaultValues = (data: Data<TType>, isEdit = false) => {
    if (!data[idField] && onGenerateId && !isEdit) {
      data = { ...data, [idField]: onGenerateId() };
    }
    if (createdAtField && !data[createdAtField] && !isEdit) {
      data = { ...data, [createdAtField]: new Date() };
    }
    if (updatedAtField && !data[updatedAtField] && isEdit) {
      data = { ...data, [updatedAtField]: new Date() };
    }
    return data;
  };

  const _validateData = (data: Data<TType> | DataList<TType>) => {
    if (Str.isEmpty(data)) throw new Error('Os dados informados estão vazios!');
  };

  const _validateWhere = (where: WhereType) => {
    if (Str.isEmpty(where))
      throw new Error('Erro ao tentar realizar a operação sem o where!');
  };

  const _sanitizeData = (data: Data<TType>, isEdit?: boolean) => {
    const removeFieldsNotEditable = (data: Data<TType>) => {
      fieldsNotEditable.forEach((field) => delete data[field]);
      return data;
    };

    _validateData(data);
    if (isEdit) {
      data = removeFieldsNotEditable(data);
    }
    return _setDefaultValues(data, isEdit);
  };

  const _sanitizeDataList = (dataList: DataList<TType>, isEdit?: boolean) => {
    _validateData(dataList);
    return dataList.map((data) => _sanitizeData(data, isEdit));
  };

  const _executeAllAtomic = async (
    dataList: DataList<TType>,
    nameFunctionORM: string,
    onExecuteSQL: ExecuteAllAtomic<TType>
  ): Promise<SaveAll<TType>> => {
    const success: DataList<TType> = [];
    return client.$transaction(async (transaction: any) => {
      for (const data of dataList) {
        try {
          const result = await onExecuteSQL(
            transaction[modelName][nameFunctionORM],
            data
          );
          success.push(result);
        } catch {
          return { success: [] as DataList<TType>, error: dataList };
        }
      }
      return { success, error: [] };
    });
  };

  const _executeAll = async (
    onExecuteSQL: ExecuteAll<TType>,
    dataList: DataList<TType>
  ): Promise<SaveAll<TType>> => {
    const success: DataList<TType> = [];
    const error: DataList<TType> = [];
    for (const data of dataList) {
      try {
        const result = await onExecuteSQL(data);
        success.push(result);
      } catch {
        error.push(data);
      }
    }
    return { success, error };
  };

  const _find = async (
    functionORM: (options: any) => AsyncDataList<TType>,
    params: QueryParams = {}
  ): AsyncDataList<TType> => {
    const {
      fields,
      filter,
      filterFields,
      orderBy,
      relations,
      skip,
      take,
      distinct
    } = params;
    let { where } = params;
    const options = _setSelectOrInclude(fields, relations);
    where = _setWhere(where, filter, filterFields);
    if (where) Object.assign(options, where);
    if (orderBy) Object.assign(options, { orderBy });
    if (distinct) Object.assign(options, { distinct });
    if (take && take > 0) Object.assign(options, { take });
    if (skip && skip > 0) Object.assign(options, { skip });
    return functionORM(options);
  };

  const _save = async (
    functionORM: (options: any) => AsyncData<TType>,
    data: Data<TType>,
    params: Pick<QueryParams, 'fields' | 'relations'> = {}
  ): AsyncData<TType> => {
    data = _sanitizeData(data);
    const { fields, relations } = params;
    const options = _setSelectOrInclude(fields, relations);
    return functionORM({ data, ...options });
  };

  const _edit = async (
    functionORM: (options: any) => AsyncData<TType>,
    data: Data<TType>,
    where: WhereType,
    params: Pick<QueryParams, 'fields' | 'relations'> = {}
  ): AsyncData<TType> => {
    _validateWhere(where);
    data = _sanitizeData(data, true);
    where = _setWhere(where) || {};
    const { fields, relations } = params;
    const options = _setSelectOrInclude(fields, relations);
    return functionORM({ data, ...options, ...where });
  };

  const _editOrSave = async (
    where: WhereType,
    saveData: Data<TType>,
    editData: Data<TType> = {},
    params: Pick<QueryParams, 'fields' | 'relations'> = {}
  ): AsyncData<TType> => {
    const { fields, relations } = params;
    const options = _setSelectOrInclude(fields, relations);
    return table.upsert({
      create: saveData,
      update: editData,
      ...options,
      ...where
    });
  };

  const _remove = async (
    functionORM: (options: any) => AsyncData<TType>,
    where: WhereType,
    params: Pick<QueryParams, 'fields' | 'relations'> = {}
  ): AsyncData<TType> => {
    _validateWhere(where);
    where = _setWhere(where) || {};
    const { fields, relations } = params;
    const options = _setSelectOrInclude(fields, relations);
    return functionORM({ ...options, ...where });
  };

  const getById = (
    id: string | number,
    params?: Pick<QueryParams, 'fields' | 'relations'>
  ): AsyncData<TType> => {
    return _executeQuery(() => {
      if (!id) throw new Error('O id informado é inválido!');
      return _find(table.findUnique, {
        where: { [idField]: id },
        ...params
      });
    }, 'getById');
  };

  const getOne = (
    where: WhereType,
    params?: Pick<QueryParams, 'fields' | 'relations'>
  ): AsyncData<TType> | null => {
    return _executeQuery(
      () => _find(table.findFirst, { where, ...params }),
      'getOne'
    );
  };

  const getAll = (params?: QueryParams): AsyncDataList<TType> => {
    return _executeQuery(() => _find(table.findMany, params), 'getAll');
  };

  const getPaged = async function (
    page = 1,
    pageSize = 20,
    params: QueryParams = {}
  ): Promise<Paginate<TType>> {
    return _executeQuery(async () => {
      page = Math.max(1, page);
      pageSize = pageSize > 0 ? pageSize : 20;
      const take = pageSize;
      const skip = (page - 1) * pageSize;
      const { filter, filterFields } = params;
      const where = _setWhere(params.where, filter, filterFields);
      const [data, total] = await Promise.all([
        _find(table.findMany, { ...params, skip, take }),
        table.count(where)
      ]);

      return { data, total };
    }, 'getPaged');
  };

  const save = function (
    data: Data<TType>,
    params?: Pick<QueryParams, 'fields' | 'relations'>
  ): AsyncData<TType> {
    return _executeQuery(() => _save(table.create, data, params), 'save');
  };

  const saveMany = function (
    dataList: DataList<TType>,
    skipDuplicates = false
  ): Promise<TotalSave> {
    return _executeQuery(async () => {
      dataList = _sanitizeDataList(dataList, false);
      return table.createMany({
        data: dataList,
        skipDuplicates
      });
    }, 'saveMany');
  };

  const saveAll = function (
    dataList: DataList<TType>,
    params?: Pick<QueryParams, 'fields' | 'relations'>,
    isAtomic = true
  ): Promise<SaveAll<TType>> {
    return _executeQuery(
      async () => {
        dataList = _sanitizeDataList(dataList, false);
        if (isAtomic) {
          const onExecuteAllAtomic = async (
            functionORM: (options: any) => AsyncData<TType>,
            data: Data<TType>
          ) => _save(functionORM, data, params);
          return _executeAllAtomic(dataList, 'create', onExecuteAllAtomic);
        } else {
          const onExecuteAll = async (data: Data<TType>) =>
            _save(table.create, data, params);
          return _executeAll(onExecuteAll, dataList);
        }
      },
      `saveAll::${isAtomic ? 'isAtomic' : ''}}`
    );
  };

  const edit = function (
    data: Data<TType>,
    where: WhereType,
    params?: Pick<QueryParams, 'fields' | 'relations'>
  ): AsyncData<TType> {
    return _executeQuery(
      () => _edit(table.update, data, where, params),
      'edit'
    );
  };

  const editMany = function (
    dataList: DataList<TType>,
    where: WhereType
  ): Promise<TotalSave> {
    return _executeQuery(async () => {
      _validateWhere(where);
      dataList = _sanitizeDataList(dataList, true);
      where = _setWhere(where) || {};
      return table.updateMany({
        data: dataList,
        ...where
      });
    }, 'editMany');
  };

  const editAll = function (
    dataList: DataList<TType>,
    where: WhereType,
    params?: Pick<QueryParams, 'fields' | 'relations'>,
    isAtomic = true
  ): Promise<SaveAll<TType>> {
    return _executeQuery(
      async () => {
        _validateWhere(where);
        dataList = _sanitizeDataList(dataList, true);
        where = _setWhere(where) || {};
        if (isAtomic) {
          const onExecuteAllAtomic = async (
            functionORM: (options: any) => AsyncData<TType>,
            data: Data<TType>
          ) => _edit(functionORM, data, where, params);
          return _executeAllAtomic(dataList, 'update', onExecuteAllAtomic);
        } else {
          const onExecuteAll = async (data: Data<TType>) =>
            _edit(table.update, data, where, params);
          return _executeAll(onExecuteAll, dataList);
        }
      },
      `editAll::${isAtomic ? 'isAtomic' : ''}}`
    );
  };

  const editOrSave = function (
    saveData: Data<TType>,
    editData: Data<TType>,
    where: WhereType,
    params?: Pick<QueryParams, 'fields' | 'relations'>
  ): AsyncData<TType> {
    return _executeQuery(() => {
      _validateWhere(where);
      saveData = _sanitizeData(saveData);
      editData = _sanitizeData(editData, true);
      where = _setWhere(where) || {};
      return _editOrSave(where, saveData, editData, params);
    }, 'editOrSave');
  };

  const getOrSave = function (
    data: Data<TType>,
    where: WhereType,
    params?: Pick<QueryParams, 'fields' | 'relations'>
  ): AsyncData<TType> {
    return _executeQuery(() => {
      _validateWhere(where);
      data = _sanitizeData(data);
      where = _setWhere(where) || {};
      return _editOrSave(where, data, {}, params);
    }, 'getOrSave');
  };

  const remove = function (
    where: WhereType,
    params?: Pick<QueryParams, 'fields' | 'relations'>
  ): AsyncData<TType> {
    return _executeQuery(
      async () => _remove(table.delete, where, params),
      'remove'
    );
  };

  const removeMany = function (where: WhereType): Promise<TotalSave> {
    return _executeQuery(async () => {
      _validateWhere(where);
      where = _setWhere(where) || {};
      return table.deleteMany({
        ...where
      });
    }, 'removeMany');
  };

  return {
    getById,
    getOne,
    getAll,
    getPaged,
    save,
    saveMany,
    saveAll,
    edit,
    editMany,
    editAll,
    editOrSave,
    getOrSave,
    remove,
    removeMany
  };
};
export { baseRepository, Data, DataList, AsyncDataList, AsyncData };
