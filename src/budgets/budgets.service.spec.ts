import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/common/helpers/mongoose.helper';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Budget, BudgetSchema } from './schemas/budget.schema';

import { ClassificationRecord as ClassificationRecordType } from 'src/shared';

import { HouseholdsService } from 'src/households/households.service';
import { ClassificationsService } from 'src/classifications/classifications.service';
import { ObjectId } from 'mongodb';
import { TransactionsService } from 'src/transactions/transactions.service';
import {
  BudgetRecord,
  BudgetRecordSchema,
} from './schemas/budget-record.schema';
import {
  ClassificationRecord,
  ClassificationRecordSchema,
} from 'src/classifications/schemas/classification-record.schema';

describe('BudgetsService', () => {
  let service: BudgetsService;
  let module: TestingModule;
  const userId = 'mockUserId';
  const householdId = '507f1f77bcf86cd799439011';
  let budgetRecordModel;

  const classificationId = {
    one: '5bb9e79df82c0151fc0cd5c8',
    two: '5bb9e79df82c0151fc0cd5c9',
  };

  const classificationRecords = [
    {
      _id: new ObjectId(classificationId.one),
      group: {
        _id: '1',
        decorationColor: '#fff',
        label: [{ lang: 'pl', value: 'mockLabel' }],
      },
      householdId: '507f1f77bcf86cd799439011',
      isDeletable: false,
      isEditable: false,
      labels: [{ lang: 'pl', value: 'mockLabel' }],
      type: 'EXPENSE',
    },
    {
      _id: new ObjectId(classificationId.two),
      group: {
        _id: '1',
        decorationColor: '#fff',
        label: [{ lang: 'pl', value: 'mockLabel' }],
      },
      householdId: '507f1f77bcf86cd799439011',
      isDeletable: false,
      isEditable: false,
      labels: [{ lang: 'pl', value: 'mockLabel' }],
      type: 'EXPENSE',
    },
  ];

  const mockClassificationService = {
    getClassificationActualTotal: jest.fn().mockImplementation(() => {
      return Promise.resolve(100);
    }),
    getUserClassifications: jest.fn().mockImplementation(() => {
      return Promise.resolve(classificationRecords);
    }),
  };

  const mockTransactionService = {
    getTransactionsByDateScope: jest.fn().mockImplementation(() => {
      return {
        transactions: [
          {
            id: 'transactionId-1',
            name: faker.lorem.word(),
            transactionDate: new Date(2023, 11, 1),
            createdAt: new Date(),
            amount: {
              value: 100,
              currency: 'PLN',
            },
            creator: userId,
            type: 'EXPENSE',
            classificationRecord: {
              _id: classificationId.one,
              group: {
                _id: '1',
                decorationColor: '#fff',
                label: [{ lang: 'pl', value: 'mockLabel' }],
              },
              householdId: '507f1f77bcf86cd799439011',
              isDeletable: false,
              isEditable: false,
              labels: [{ lang: 'pl', value: 'mockLabel' }],
              type: 'EXPENSE',
            } as ClassificationRecordType,
          },
          {
            id: 'transactionId-2',
            name: faker.lorem.word(),
            transactionDate: new Date(2023, 11, 1),
            createdAt: new Date(),
            amount: {
              value: 100,
              currency: 'PLN',
            },
            creator: userId,
            type: 'EXPENSE',
            classificationRecord: {
              _id: classificationId.two,
              group: {
                _id: '1',
                decorationColor: '#fff',
                label: [{ lang: 'pl', value: 'mockLabel' }],
              },
              householdId: '507f1f77bcf86cd799439011',
              isDeletable: false,
              isEditable: false,
              labels: [{ lang: 'pl', value: 'mockLabel' }],
              type: 'EXPENSE',
            } as ClassificationRecordType,
          },
          {
            id: 'transactionId-3',
            name: faker.lorem.word(),
            transactionDate: new Date(2023, 11, 1),
            createdAt: new Date(),
            amount: {
              value: 100,
              currency: 'PLN',
            },
            creator: userId,
            type: 'EXPENSE',
            classificationRecord: {
              _id: classificationId.one,
              group: {
                _id: '507f1f77bcf86cd799439011',
                decorationColor: '#fff',
                label: [{ lang: 'pl', value: 'mockLabel' }],
              },
              householdId: '1',
              isDeletable: false,
              isEditable: false,
              labels: [{ lang: 'pl', value: 'mockLabel' }],
              type: 'EXPENSE',
            } as ClassificationRecordType,
          },
        ],
      };
    }),
  };

  const mockHouseholdsService = {
    getHouseholdIdByUserId: jest.fn().mockImplementation((userId) => {
      if (userId === 'nonExistingUserId') {
        return undefined;
      }
      return new ObjectId(householdId);
    }),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Budget.name,
            schema: BudgetSchema,
          },
          {
            name: BudgetRecord.name,
            schema: BudgetRecordSchema,
          },
          {
            name: ClassificationRecord.name,
            schema: ClassificationRecordSchema,
          },
        ]),
      ],
      providers: [
        BudgetsService,
        {
          provide: ClassificationsService,
          useValue: mockClassificationService,
        },
        { provide: HouseholdsService, useValue: mockHouseholdsService },
        {
          provide: TransactionsService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
    budgetRecordModel = module.get(getModelToken(BudgetRecord.name));
  });

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should create budget records', async () => {
    const records = await service.createBudget(
      { month: 12, year: 2023 },
      userId,
    );
    const record = records[0];

    expect(record).toBeDefined();
    expect(record._id).toBeDefined();
    expect(record.actualTotal).toBe(200);
    expect(record.plannedTotal).toBe(0);
    expect(record.classification).toBeDefined();
    expect(record.month).toBe(12);
    expect(record.year).toBe(2023);
  });

  it('should not be able to create the same budget', async () => {
    try {
      await service.createBudget({ month: 12, year: 2023 }, userId);
    } catch (error) {
      expect(error.message).toBe('Budget already exists');
    }
  });

  it('should return budget records', async () => {
    budgetRecordModel.find = jest.fn().mockReturnThis();
    budgetRecordModel.populate = jest.fn().mockResolvedValue([
      {
        _id: 'mockId1',
        classification: { _id: 'classificationId1', type: 'EXPENSE' },
      },
      {
        _id: 'mockId2',
        classification: { _id: 'classificationId2', type: 'EXPENSE' },
      },
    ]);

    const records = await service.getPeriodicBudgetRecords(
      { month: 12, year: 2023 },
      userId,
    );
    expect(records.length).toBe(2);
  });

  it('should get not found error  for non existing budget', async () => {
    try {
      await service.getPeriodicBudgetRecords({ month: 12, year: 2024 }, userId);
    } catch (error) {
      expect(error.message).toBe('Budget not found');
    }
  });
});
