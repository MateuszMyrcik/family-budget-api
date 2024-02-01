import { ObjectId } from 'mongodb';

export type UserRequestInfo = {
  id: string;
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  householdId: ObjectId;
};
