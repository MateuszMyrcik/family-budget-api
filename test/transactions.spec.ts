jest.setTimeout(10 * 1000);

import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import supertest from 'supertest';
import { generateToken, clearCollection } from './utils';

import {
  ClassificationRecord,
  CreateCyclicTransactionRequest,
  CreateTransactionRequest,
  Household,
} from 'src/shared';

describe('Transactions module', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let request: supertest.SuperTest<supertest.Test>;
  let ownerToken: string;
  let ownerId: string;
  let ownerEmail: string;

  let memberId: string;
  let memberEmail: string;
  let classifications: ClassificationRecord[];
  let household: Household;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    ownerId = faker.string.uuid();
    ownerEmail = faker.internet.email();
    memberEmail = faker.internet.email();
    memberId = faker.string.uuid();

    ownerToken = generateToken({
      sub: ownerId,
      issuer: 'owner',
      audience: 'audience',
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forRoot(uri)],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    request = supertest(app.getHttpServer());

    await request
      .post('/users')
      .send({
        _id: ownerId,
        nickname: faker.person.firstName(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: ownerEmail,
      })
      .set('x-api-key', process.env.API_KEY);

    household = await request
      .post('/households')
      .set('authorization', `Bearer ${ownerToken}`)
      .then((res) => res.body);

    await request
      .post('/users')
      .send({
        _id: memberId,
        nickname: faker.person.firstName(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: memberEmail,
      })
      .set('x-api-key', process.env.API_KEY);

    classifications = await request
      .get('/classifications')
      .set('authorization', `Bearer ${ownerToken}`)
      .then((res) => res.body);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('/transactions (POST)', () => {
    beforeEach(async () => {
      await clearCollection('transactions');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .post('/households')
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return bad request when no body', async () => {
      return request
        .post('/transactions')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });

    it('should return bad request when invalid classification', async () => {
      const payload: Partial<CreateTransactionRequest> = {
        classificationRecordId: faker.database.mongodbObjectId(),
      };
      return request
        .post('/transactions')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should create a new transaction and return it', async () => {
      const payload: CreateTransactionRequest = {
        amount: {
          currency: 'PLN',
          value: 100,
        },
        classificationRecordId: classifications[0]._id,
        creatorId: ownerId,
        householdId: household._id,
        name: faker.finance.transactionDescription(),
        transactionDate: faker.date.recent(),
      };

      return request
        .post('/transactions')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(201)
        .then((res) => {
          expect(res.body._id).toBeDefined();
          expect(res.body.name).toBe(payload.name);
          expect(res.body.amount).toMatchObject(payload.amount);
          expect(res.body.classificationRecord).toBe(
            payload.classificationRecordId,
          );
          expect(res.body.creator).toBe(payload.creatorId);
          expect(res.body.household).toBe(payload.householdId);
          expect(res.body.transactionDate).toBe(
            payload.transactionDate.toISOString(),
          );
        });
    });
  });

  describe('/transactions (GET)', () => {
    it('should return unauthorized when invalid authorization', async () => {
      return request
        .get('/transactions')
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return all transactions', async () => {
      return request
        .get('/transactions')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.transactions).toBeInstanceOf(Array);
        });
    });
  });

  describe('/transactions/:id (GET)', () => {
    it('should return unauthorized when invalid authorization', async () => {
      return request
        .get(`/transactions/${faker.database.mongodbObjectId()}`)
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return not found when invalid id', async () => {
      return request
        .get(`/transactions/${faker.database.mongodbObjectId()}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(404);
    });

    it('should return transaction', async () => {
      const transaction = await request
        .post('/transactions')
        .set('authorization', `Bearer ${ownerToken}`)
        .send({
          amount: {
            currency: 'PLN',
            value: 100,
          },
          classificationRecordId: classifications[0]._id,
          creatorId: ownerId,
          householdId: household._id,
          name: faker.finance.transactionDescription(),
          transactionDate: faker.date.recent(),
        })
        .then((res) => res.body);

      return request
        .get(`/transactions/${transaction._id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body._id).toBe(transaction._id);
        });
    });
  });

  describe('/transactions/:id (PATCH)', () => {
    it('should return unauthorized when invalid authorization', async () => {
      return request
        .patch(`/transactions/${faker.database.mongodbObjectId()}`)
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return not found when invalid id', async () => {
      return request
        .patch(`/transactions/${faker.database.mongodbObjectId()}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(404);
    });

    it('should update transaction', async () => {
      const transaction = await request
        .post('/transactions')
        .set('authorization', `Bearer ${ownerToken}`)
        .send({
          amount: {
            currency: 'PLN',
            value: 100,
          },
          classificationRecordId: classifications[0]._id,
          creatorId: ownerId,
          householdId: household._id,
          name: faker.finance.transactionDescription(),
          transactionDate: faker.date.recent(),
        })
        .then((res) => res.body);

      const payload = {
        name: faker.finance.transactionDescription(),
      };

      return request
        .patch(`/transactions/${transaction._id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(200);
    });
  });

  describe('/transactions/:id (DELETE)', () => {
    it('should return unauthorized when invalid authorization', async () => {
      return request
        .delete(`/transactions/${faker.database.mongodbObjectId()}`)
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return not found when invalid id', async () => {
      return request
        .delete(`/transactions/${faker.database.mongodbObjectId()}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(404);
    });

    it('should delete transaction', async () => {
      const transaction = await request
        .post('/transactions')
        .set('authorization', `Bearer ${ownerToken}`)
        .send({
          amount: {
            currency: 'PLN',
            value: 100,
          },
          classificationRecordId: classifications[0]._id,
          creatorId: ownerId,
          householdId: household._id,
          name: faker.finance.transactionDescription(),
          transactionDate: faker.date.recent(),
        })
        .then((res) => res.body);

      return request
        .delete(`/transactions/${transaction._id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200);
    });
  });

  describe('/transactions/cyclic (POST)', () => {
    beforeEach(async () => {
      await clearCollection('transactions');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .post('/transactions/cyclic')
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return bad request when no body', async () => {
      return request
        .post('/transactions/cyclic')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });

    it('should return bad request when invalid classification', async () => {
      const payload = {
        classificationRecordId: faker.database.mongodbObjectId(),
      };
      return request
        .post('/transactions/cyclic')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should return bad request when invalid frequency', async () => {
      const payload: CreateCyclicTransactionRequest = {
        amount: {
          currency: 'PLN',
          value: 100,
        },
        classificationRecordId: classifications[0]._id,
        creatorId: ownerId,
        householdId: household._id,
        name: faker.finance.transactionDescription(),
        occurrences: 5,
        startDate: faker.date.future(),
        frequency: 'INVALID' as any,
      };

      return request
        .post('/transactions/cyclic')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should return bad request when invalid occurrences', async () => {
      const payload: CreateCyclicTransactionRequest = {
        amount: {
          currency: 'PLN',
          value: 100,
        },
        classificationRecordId: classifications[0]._id,
        creatorId: ownerId,
        householdId: household._id,
        name: faker.finance.transactionDescription(),
        occurrences: 0,
        startDate: faker.date.future(),
        frequency: 'MONTHLY',
      };

      return request
        .post('/transactions/cyclic')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should return bad request when invalid start date', async () => {
      const payload: CreateCyclicTransactionRequest = {
        amount: {
          currency: 'PLN',
          value: 100,
        },
        classificationRecordId: classifications[0]._id,
        creatorId: ownerId,
        householdId: household._id,
        name: faker.finance.transactionDescription(),
        occurrences: 5,
        startDate: faker.date.past(),
        frequency: 'MONTHLY',
      };

      return request
        .post('/transactions/cyclic')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should create a new cyclic transaction and return it', async () => {
      const payload: CreateCyclicTransactionRequest = {
        amount: {
          currency: 'PLN',
          value: 100,
        },
        classificationRecordId: classifications[0]._id,
        creatorId: ownerId,
        householdId: household._id,
        name: faker.finance.transactionDescription(),
        occurrences: 5,
        startDate: faker.date.future(),
        frequency: 'MONTHLY',
      };

      return request
        .post('/transactions/cyclic')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body).toHaveLength(payload.occurrences);
        });
    });
  });
});
