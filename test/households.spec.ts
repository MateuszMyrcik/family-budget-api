jest.setTimeout(10 * 1000);

import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import supertest from 'supertest';
import { generateToken, clearCollection } from './utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('Households module', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let request: supertest.SuperTest<supertest.Test>;
  let ownerToken: string;
  let ownerId: string;
  let ownerEmail: string;
  let memberToken: string;
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

    memberToken = generateToken({
      sub: memberId,
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

  describe('/households (POST)', () => {
    beforeEach(async () => {
      await clearCollection('households');
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

    it('should create household', async () => {
      const eventEmitter = app.get(EventEmitter2);
      const spyEventEmitter = jest.spyOn(eventEmitter, 'emit');
      const response = await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('owner');
      expect(response.body).toHaveProperty('members');
      expect(response.body).toHaveProperty('pendingInvites');
      expect(spyEventEmitter).toHaveBeenLastCalledWith(
        'household.created',
        expect.anything(),
      );
    });

    it('should return bad request when user already has a household', async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(201);

      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'User already has a household',
            }),
          ),
        );
    });

    it('should remove a household', async () => {
      const eventEmitter = app.get(EventEmitter2);
      const spyEventEmitter = jest.spyOn(eventEmitter, 'emit');
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);

      await request
        .delete('/households')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(spyEventEmitter).toHaveBeenLastCalledWith(
        'household.removed',
        expect.anything(),
      );
    });
  });

  describe('/households (GET)', () => {
    beforeEach(async () => {
      await clearCollection('households');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .get('/households')
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return empty household', async () => {
      return request
        .get('/households')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect({});
    });

    it('should return household ', async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(201);

      const response = await request
        .get('/households')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('owner');
      expect(response.body).toHaveProperty('members');
      expect(response.body).toHaveProperty('pendingInvites');
    });
  });

  describe('/households (DELETE)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);
    });

    afterEach(async () => {
      await clearCollection('households');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .delete('/households')
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should remove a household', async () => {
      const eventEmitter = app.get(EventEmitter2);
      const spyEventEmitter = jest.spyOn(eventEmitter, 'emit');
      await request
        .delete('/households')
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200);

      expect(spyEventEmitter).toHaveBeenLastCalledWith(
        'household.removed',
        expect.anything(),
      );
    });

    it('should return an error when trying to remove a non-existing member', async () => {
      return request
        .delete('/households')
        .set('authorization', `Bearer ${memberToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'Household does not exist',
            }),
          ),
        );
    });
  });

  describe('/households/invites (POST)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);
    });

    afterEach(async () => {
      await clearCollection('households');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', 'Bearer invalid')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should successfully send an invite to a household owner', async () => {
      return request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', `Bearer ${memberToken}`)
        .expect(201);
    });

    it('should return an error when sending an invite to a non-existing household', async () => {
      return request
        .post(`/households/invites/${faker.internet.email()}`)
        .set('authorization', `Bearer ${memberToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'Household does not exist',
            }),
          ),
        );
    });

    it('should return an error when sending an invite to a user already in the household', async () => {
      await request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', `Bearer ${memberToken}`);

      return request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'User already in household',
            }),
          ),
        );
    });
  });

  describe('/households/invites/accept (POST)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);
    });

    afterEach(async () => {
      await clearCollection('households');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .post(`/households/invites/accept/${faker.string.uuid()}`)
        .set('authorization', 'Bearer invalid')
        .expect(401);
    });

    it('should successfully accept an invite', async () => {
      const response = await request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', `Bearer ${memberToken}`);

      const inviteId = response.body.pendingInvites[0]._id;

      return request
        .post(`/households/invites/accept/${inviteId}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(201);
    });

    it('should return an error when accepting an invite that does not exist', async () => {
      return request
        .post(`/households/invites/accept/${faker.string.uuid()}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'Invite does not exist',
            }),
          ),
        );
    });

    it('should return an error when a non-owner tries to accept an invite', async () => {
      const response = await request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', `Bearer ${memberToken}`)
        .expect(201);

      const inviteId = response.body.pendingInvites[0]._id;

      return request
        .post(`/households/invites/accept/${inviteId}`)
        .set('authorization', `Bearer ${memberToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'User is not owner of household',
            }),
          ),
        );
    });
  });

  describe('/households/invites/decline (DELETE)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);
    });

    afterEach(async () => {
      await clearCollection('households');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .delete(`/households/invites/decline/${faker.string.uuid()}`)
        .set('authorization', 'Bearer invalid')
        .expect(401);
    });

    it('should successfully decline an invite', async () => {
      const response = await request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', `Bearer ${memberToken}`);

      const inviteId = response.body.pendingInvites[0]._id;

      return request
        .delete(`/households/invites/decline/${inviteId}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200);
    });

    it('should return an error when declining an invite that does not exist', async () => {
      return request
        .delete(`/households/invites/decline/${faker.string.uuid()}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'Invite does not exist',
            }),
          ),
        );
    });

    it('should return an error when a non-owner tries to decline an invite', async () => {
      const response = await request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', `Bearer ${memberToken}`)
        .expect(201);

      const inviteId = response.body.pendingInvites[0]._id;

      return request
        .delete(`/households/invites/decline/${inviteId}`)
        .set('authorization', `Bearer ${memberToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'User is not owner of household',
            }),
          ),
        );
    });
  });

  describe('/households/members (DELETE)', () => {
    beforeEach(async () => {
      await request
        .post('/households')
        .set('authorization', `Bearer ${ownerToken}`);
    });

    afterEach(async () => {
      await clearCollection('households');
    });

    it('should return unauthorized when invalid authorization', async () => {
      return request
        .delete(`/households/members/${faker.string.uuid()}`)
        .set('authorization', 'Bearer invalid')
        .expect(401);
    });

    it('should successfully remove a member', async () => {
      const response = await request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', `Bearer ${memberToken}`);

      const inviteId = response.body.pendingInvites[0]._id;

      await request
        .post(`/households/invites/accept/${inviteId}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(201);

      return request
        .delete(`/households/members/${memberId}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(200);
    });

    it('should return an error when removing a member that does not exist', async () => {
      return request
        .delete(`/households/members/${faker.string.uuid()}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'Member does not exist',
            }),
          ),
        );
    });

    it('should return an error when a non-owner tries to remove a member', async () => {
      const response = await request
        .post(`/households/invites/${ownerEmail}`)
        .set('authorization', `Bearer ${memberToken}`)
        .expect(201);

      const inviteId = response.body.pendingInvites[0]._id;

      await request
        .post(`/households/invites/accept/${inviteId}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect(201);

      return request
        .delete(`/households/members/${ownerId}`)
        .set('authorization', `Bearer ${memberToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'User is not owner of household',
            }),
          ),
        );
    });

    it('should return an error when trying to remove the household owner', async () => {
      return request
        .delete(`/households/members/${ownerId}`)
        .set('authorization', `Bearer ${ownerToken}`)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: 'Household owner cannot be removed',
            }),
          ),
        );
    });
  });
});
