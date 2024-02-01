import { sign } from 'jsonwebtoken';
import nock from 'nock';
import { RSA_JWK, pem2jwk } from 'pem-jwk';
import keypair from './keypair';

import dotenv from 'dotenv';

dotenv.config();

type Auth0JWK = RSA_JWK & {
  use?: string;
  kid?: string;
};

export type GenerateTokenOptions = {
  sub: string;
  issuer: string;
  audience: string;
};

const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const AUTH0_ISSUER_URL = process.env.AUTH0_ISSUER_URL;

export const generateToken = (options: GenerateTokenOptions): string => {
  const { sub } = options;
  const auth0JWK: Auth0JWK = pem2jwk(keypair.public);

  const auth0JwksUrl = new URL(`${AUTH0_ISSUER_URL}.well-known/jwks.json`);

  nock(auth0JwksUrl.origin, { allowUnmocked: false })
    .get(auth0JwksUrl.pathname)
    .reply(200, { keys: [auth0JWK] });

  return sign(
    {},
    keypair.private, // Your private key for signing the JWT
    {
      algorithm: 'RS256',
      header: {
        kid: auth0JWK.kid,
        alg: 'RS256',
      },
      expiresIn: '1h',
      audience: AUTH0_AUDIENCE,

      issuer: AUTH0_ISSUER_URL,
      subject: sub,
    },
  );
};
