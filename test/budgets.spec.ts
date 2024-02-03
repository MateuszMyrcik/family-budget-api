jest.setTimeout(10 * 1000);

import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import supertest from 'supertest';
import { generateToken, clearCollection } from './utils';

import { CreateBudgetDto, UpdateBudgetRecordDto } from 'src/shared';

describe('Transactions module', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let request: supertest.SuperTest<supertest.Test>;
  let ownerToken: string;
  let ownerId: string;
  let ownerEmail: string;

  let memberId: string;
  let memberEmail: string;

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
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('/budgets (POST)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);
    });

    afterEach(async () => {
      await clearCollection('households');
      await clearCollection('budgetrecords');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .post('/budgets')
        .set('authorization', 'Bearer invalid')
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should create budget and return it', async () => {
      const payload: CreateBudgetDto = {
        month: faker.date.recent().getMonth() + 1,
        year: faker.date.recent().getFullYear(),
      };
      return request
        .post('/budgets')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(201);
    });

    it('should return bad request when missing payload', async () => {
      return request
        .post('/budgets')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect((res) => {
          expect(res.body).toEqual({
            statusCode: 400,
            message: 'Month and year are required',
            error: 'Bad Request',
          });
        });
    });
  });

  describe('/budgets/:month/:year (GET)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);
    });

    afterEach(async () => {
      await clearCollection('households');
      await clearCollection('budgetrecords');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .get('/budgets/1/2022')
        .set('authorization', 'Bearer invalid')
        .expect(401);
    });

    it('should return bad request when invalid month', async () => {
      return request
        .get('/budgets/13/2022')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });

    it('should return bad request when invalid year', async () => {
      return request
        .get('/budgets/12/1989')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });

    it('should return budget records', async () => {
      await request
        .post('/budgets')
        .set('authorization', `Bearer ${ownerToken}`)
        .send({
          month: 1,
          year: 2022,
        });

      return request
        .get('/budgets/1/2022')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });

    it('should return not found when no budget records', async () => {
      return request
        .get('/budgets/1/2022')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });
  });

  describe('/budgets/records (POST)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);
    });

    afterEach(async () => {
      await clearCollection('households');
      await clearCollection('budgetrecords');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .post('/budgets/records')
        .set('authorization', 'Bearer invalid')
        .expect(401);
    });

    it('should return bad request when missing payload', async () => {
      const payload = {};
      return request
        .post('/budgets/records')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should create budget record and return it', async () => {
      const records = await request
        .post('/budgets')
        .set('authorization', `Bearer ${ownerToken}`)
        .send({
          month: 1,
          year: 2022,
        })
        .then((res) => res.body);

      const payload: UpdateBudgetRecordDto = {
        plannedTotal: Number(faker.finance.amount()),
        recordId: records[0]._id,
      };
      return request
        .post('/budgets/records')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(201);
    });
  });

  describe('/budgets (DELETE)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);
    });

    afterEach(async () => {
      await clearCollection('households');
      await clearCollection('budgetrecords');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .delete('/budgets')
        .set('authorization', 'Bearer invalid')
        .expect(401);
    });

    it('should delete household budget', async () => {
      return request
        .delete('/budgets')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200);
    });
  });
});
