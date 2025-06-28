import { Injectable } from '@nestjs/common';
import {
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import * as dotenv from 'dotenv';

dotenv.config();

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;
if (!userPoolId || !clientId) {
  throw new Error(
    'COGNITO_USER_POOL_ID or COGNITO_CLIENT_ID environment variable is not set',
  );
}

interface CognitoError extends Error {
  code: string;
}

const userPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
});

@Injectable()
export class AuthService {
  async signUp(email: string, password: string) {
    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, [], [], (err: CognitoError, result) => {
        if (err) {
          switch (err.code) {
            case 'UsernameExistsException':
              return reject(new ConflictException('User already exists'));
            case 'InvalidPasswordException':
              return reject(new BadRequestException('Password is too weak'));
            case 'InvalidParameterException':
              return reject(new BadRequestException(err.message));
            default:
              return reject(new InternalServerErrorException('Signup failed'));
          }
        }
        resolve(result);
      });
    });
  }

  async signIn(email: string, password: string) {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: email, Pool: userPool });
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (session) => {
          const token = session.getIdToken().getJwtToken();
          resolve({ accessToken: token });
        },
        onFailure: (err: CognitoError) => {
          switch (err.code) {
            case 'NotAuthorizedException':
              return reject(
                new UnauthorizedException('Incorrect email or password'),
              );
            case 'UserNotFoundException':
              return reject(new UnauthorizedException('User does not exist'));
            case 'UserNotConfirmedException':
              return reject(new UnauthorizedException('User is not confirmed'));
            case 'InvalidParameterException':
              return reject(new BadRequestException(err.message));
            default:
              return reject(new InternalServerErrorException('Signin failed'));
          }
        },
      });
    });
  }
}
