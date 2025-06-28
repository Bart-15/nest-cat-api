/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt';
import * as AWS from 'aws-sdk';
import { Request } from 'express';

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;
const region = process.env.AWS_REGION;

if (!userPoolId || !clientId || !region) {
  throw new Error('Missing required env vars');
}

const jwtFromRequest =
  ExtractJwt.fromAuthHeaderAsBearerToken() as JwtFromRequestFunction;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest,
      secretOrKeyProvider: (
        req: Request,
        rawJwtToken: string,
        done: (err: Error | null, secretOrKey?: string) => void,
      ) => {
        try {
          const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
          AWS.config.update({ region });
          done(null, cognitoIssuer);
        } catch (error) {
          if (error instanceof Error) {
            done(error, undefined);
          } else {
            done(new Error('Unknown error'), undefined);
          }
        }
      },
    });
  }

  validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
