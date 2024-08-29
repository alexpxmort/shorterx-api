import { baseRepository } from '@providers/prisma/repositories/baseRepository';
import mockClient from '@test/mocks/mockClient';

jest.mock('@providers/pino/logger');
const modelName = 'User';
const repository = baseRepository(mockClient, modelName);

describe('baseRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getById should return data for a valid ID', async () => {
    const mockData = { id: 1, name: 'Test User' };
    mockClient[modelName].findUnique.mockResolvedValue(mockData);

    const result = await repository.getById(1);
    expect(result).toEqual(mockData);
    expect(mockClient[modelName].findUnique).toHaveBeenCalledWith({
      where: { id: 1 }
    });
  });

  test('getOne should return data for a valid query', async () => {
    const mockData = { id: 1, name: 'Test User' };
    const where = { id: 1 };
    mockClient[modelName].findFirst.mockResolvedValue(mockData);

    const result = await repository.getOne(where);
    expect(result).toEqual(mockData);
    expect(mockClient[modelName].findFirst).toHaveBeenCalledWith({ where });
  });

  test('getAll should return a list of data', async () => {
    const mockData = [{ id: 1, name: 'Test User' }];
    mockClient[modelName].findMany.mockResolvedValue(mockData);

    const result = await repository.getAll();
    expect(result).toEqual(mockData);
    expect(mockClient[modelName].findMany).toHaveBeenCalledWith({});
  });

  test('getPaged should return paginated data', async () => {
    const mockData = [{ id: 1, name: 'Test User' }];
    const total = 100;
    const pageSize = 10;
    const page = 1;
    mockClient[modelName].findMany.mockResolvedValue(mockData);
    mockClient[modelName].count.mockResolvedValue(total);

    const result = await repository.getPaged(page, pageSize);
    expect(result.data).toEqual(mockData);
    expect(result.total).toBe(total);
    expect(mockClient[modelName].findMany).toHaveBeenCalled();
    expect(mockClient[modelName].count).toHaveBeenCalled();
  });

  test('save should create new data', async () => {
    const mockData = { id: 1, name: 'Test User' };
    mockClient[modelName].create.mockResolvedValue(mockData);

    const result = await repository.save(mockData);
    expect(result).toEqual(mockData);
    expect(mockClient[modelName].create).toHaveBeenCalledWith({
      data: mockData
    });
  });

  test('saveMany should create multiple records', async () => {
    const mockDataList = [{ id: 1, name: 'Test User' }];
    mockClient[modelName].createMany.mockResolvedValue({ count: 1 });

    const result = await repository.saveMany(mockDataList);
    expect(result.count).toBe(1);
    expect(mockClient[modelName].createMany).toHaveBeenCalled();
  });

  test('saveAll should create all records (atomic)', async () => {
    const mockDataList = [{ id: 1, name: 'Test User' }];
    mockClient[modelName].create.mockResolvedValue(mockDataList[0]);
    mockClient.$transaction.mockImplementation(async (callback: any) =>
      callback(mockClient)
    );

    const result = await repository.saveAll(mockDataList, {}, true);
    expect(result.success).toEqual(mockDataList);
    expect(result.error).toEqual([]);
    expect(mockClient.$transaction).toHaveBeenCalled();
  });

  test('edit should update existing data', async () => {
    const mockData = { id: 1, name: 'Updated User' };
    const where = { id: 1 };
    mockClient[modelName].update.mockResolvedValue(mockData);

    const result = await repository.edit(mockData, where);
    expect(result).toEqual(mockData);
    expect(mockClient[modelName].update).toHaveBeenCalledWith({
      data: mockData,
      where
    });
  });

  test('editMany should update multiple records', async () => {
    const mockDataList = [{ id: 1, name: 'Updated User' }];
    const where = { id: 1 };
    mockClient[modelName].updateMany.mockResolvedValue({ count: 1 });

    const result = await repository.editMany(mockDataList, where);
    expect(result.count).toBe(1);
    expect(mockClient[modelName].updateMany).toHaveBeenCalledWith({
      data: mockDataList,
      where
    });
  });

  test('editAll should update all records (atomic)', async () => {
    const mockDataList = [{ id: 1, name: 'Updated User' }];
    const where = { id: 1 };
    mockClient[modelName].update.mockResolvedValue(mockDataList[0]);
    mockClient.$transaction.mockImplementation(async (callback: any) =>
      callback(mockClient)
    );

    const result = await repository.editAll(mockDataList, where, {}, true);
    expect(result.success).toEqual(mockDataList);
    expect(result.error).toEqual([]);
    expect(mockClient.$transaction).toHaveBeenCalled();
  });

  test('editOrSave should update or create data', async () => {
    const mockData = { id: 1, name: 'Test User' };
    const where = { id: 1 };
    mockClient[modelName].upsert.mockResolvedValue(mockData);

    const result = await repository.editOrSave(mockData, mockData, where);
    expect(result).toEqual(mockData);
    expect(mockClient[modelName].upsert).toHaveBeenCalledWith({
      create: mockData,
      update: mockData,
      where
    });
  });

  test('getOrSave should get or create data', async () => {
    const mockData = { id: 1, name: 'Test User' };
    const where = { id: 1 };
    mockClient[modelName].upsert.mockResolvedValue(mockData);

    const result = await repository.getOrSave(mockData, where);
    expect(result).toEqual(mockData);
    expect(mockClient[modelName].upsert).toHaveBeenCalledWith({
      create: mockData,
      update: {},
      where
    });
  });

  test('remove should delete data', async () => {
    const mockData = { id: 1, name: 'Test User' };
    const where = { id: 1 };
    mockClient[modelName].delete.mockResolvedValue(mockData);

    const result = await repository.remove(where);
    expect(result).toEqual(mockData);
    expect(mockClient[modelName].delete).toHaveBeenCalledWith({ where });
  });

  test('removeMany should delete multiple records', async () => {
    const where = { id: 1 };
    mockClient[modelName].deleteMany.mockResolvedValue({ count: 1 });

    const result = await repository.removeMany(where);
    expect(result.count).toBe(1);
    expect(mockClient[modelName].deleteMany).toHaveBeenCalledWith({ where });
  });
});
