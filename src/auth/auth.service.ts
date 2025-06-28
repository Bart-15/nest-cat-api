import { Injectable } from '@nestjs/common';
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

const userPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
});

@Injectable()
export class AuthService {
  async signUp(email: string, password: string) {
    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, [], [], (err, result) => {
        if (err) reject(err);
        else resolve(result);
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
        onSuccess: (session) => resolve(session.getIdToken().getJwtToken()),
        onFailure: (err: unknown) => reject(err as Error),
      });
    });
  }
}
