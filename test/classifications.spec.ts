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
  CreateClassificationRecordDto,
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
    mongoServer = await MongoMemoryServer.create({});
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
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('/classifications (POST)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);

      classifications = await request
        .get('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .then((res) => res.body);
    });

    afterEach(async () => {
      await clearCollection('households');
      await clearCollection('classificationrecords');
    });

    it('should return should return unauthorized when invalid authorization', async () => {
      return request
        .post('/classifications')
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return bad request when missing payload', async () => {
      return request
        .post('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(400);
    });

    it('should return bad request when invalid groupId', async () => {
      const payload: Partial<CreateClassificationRecordDto> = {
        groupId: faker.string.uuid(),
        label: {
          lang: 'pl',
          value: 'Test Label',
        },
      };
      return request
        .post('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should return bad request when invalid label', async () => {
      const payload: Partial<CreateClassificationRecordDto> = {
        groupId: household._id,
        label: {
          lang: 'pl',
        } as any,
      };
      return request
        .post('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should create and return classification record', async () => {
      const payload: CreateClassificationRecordDto = {
        groupId: classifications[0].group._id,
        label: {
          lang: 'pl',
          value: 'Test Label',
        },
      };
      return request
        .post('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(201);
    });
  });

  describe('/classifications (GET)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);

      classifications = await request
        .get('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .then((res) => res.body);
    });

    afterEach(async () => {
      await clearCollection('households');
      await clearCollection('classificationrecords');
    });

    it('should return should return unauthorized when invalid authorization', async () => {
      return request
        .get('/classifications')
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return classification records', async () => {
      return request
        .get('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });
  });

  describe('/classifications/:classificationId (POST)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);

      classifications = await request
        .get('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .then((res) => res.body);
    });

    afterEach(async () => {
      await clearCollection('households');
      await clearCollection('classificationrecords');
    });

    it('should return should return unauthorized when invalid authorization', async () => {
      return request
        .post(`/classifications/${classifications[0]._id}`)
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return bad request when missing payload', async () => {
      const payload = {};
      return request
        .post(`/classifications/${classifications[0]._id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should return bad request when invalid label', async () => {
      const payload = {
        label: {
          lang: 'pl',
        },
      };
      return request
        .post(`/classifications/${classifications[0]._id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(400);
    });

    it('should update classification record', async () => {
      const payload = {
        label: {
          lang: 'pl',
          value: 'Test Label',
        },
      };
      return request
        .post(`/classifications/${classifications[0]._id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .send(payload)
        .expect(201);
    });
  });

  describe('/classifications/:classificationId (DELETE)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);

      classifications = await request
        .get('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .then((res) => res.body);
    });

    afterEach(async () => {
      await clearCollection('households');
      await clearCollection('classificationrecords');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .delete(`/classifications/${classifications[0]._id}`)
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return bad request when not deletable record', async () => {
      return request
        .delete(`/classifications/${classifications[0]._id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect((res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toBe('Classification is not deletable');
        });
    });

    it('should delete classification record', async () => {
      const record = await request
        .post('/classifications')
        .set('authorization', `Bearer ${ownerToken}`)
        .send({
          groupId: classifications[0].group._id,
          label: {
            lang: 'pl',
            value: 'Test Label',
          },
        })
        .then((res) => res.body);

      return request
        .delete(`/classifications/${record._id}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200);
    });
  });
});
