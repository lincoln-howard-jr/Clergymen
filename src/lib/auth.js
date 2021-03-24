import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import poolDetails from './poolDetails';

let authDetails = null;
let Pool = new AmazonCognitoIdentity.CognitoUserPool (poolDetails);
let cognitoUser = null;
let accessToken = null;
let refreshToken = null;

export const headers = {
  get get () {
    return new Headers ({
      'x-amz-access-token': accessToken
    });
  },
  get post () {
    return new Headers ({
      'x-amz-access-token': accessToken,
      'Content-Type': 'application/json'
    });
  }
}
export const login = (Username, Password) => new Promise ((resolve, reject) => {
  try {
    authDetails = new AmazonCognitoIdentity.AuthenticationDetails ({Username, Password});
    cognitoUser = new AmazonCognitoIdentity.CognitoUser ({Username, Pool});
    cognitoUser.authenticateUser (authDetails, {
      onSuccess: () => resolve (),
      onFailure: () => reject ()
    })
  } catch (e) {
    reject (e);
  }
});

export const getCurrentUser = () => new Promise ((resolve, reject) => {
  try {
    cognitoUser = Pool.getCurrentUser ();
    resolve ();
  } catch (e) {
    reject (e);
  }
});

export const retrieveAccessToken = () => new Promise ((resolve, reject) => {
  try {
    if (!cognitoUser) throw 'Cognito user must be defined to get access token';
    cognitoUser.getSession ((e, session) => {
      if (e) return reject (e);
      accessToken = session.getAccessToken ().getJwtToken ();
      refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken ({RefreshToken: session.getRefreshToken ().getToken ()});
      resolve ();
    });
  } catch (e) {
    reject (e);
  }
});

export const refreshSession = () => new Promise ((resolve, reject) => {
  try {
    if (!cognitoUser) throw 'Cannot refresh empty cognito user';
    if (!refreshToken) throw 'Cannot refresh empty refresh token';
    cognitoUser.refreshSession (refreshToken, (err, session) => {
      if (err) return reject (err);
      accessToken = session.getAccessToken ().getJwtToken ();
      refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken ({RefreshToken: session.getRefreshToken ().getToken ()});
      resolve ();
    });
  } catch (e) {
    reject (e);
  }
});

export const signOut = async () => new Promise (async (resolve, reject) => {
  try {
    await cognitoUser.signOut();
    resolve ();
  } catch (e) {
    reject (e);
  }
});

// export const register = async (Username, Password) => new Promise (async (resolve, reject) => {
//   const customAttributeId = new AmazonCognitoIdentity.CognitoUserAttribute ({Name: 'custom:id', Value: id ()})
//   const attributeList = [attributePhoneNumber, customAttributeId];
//   Pool.signUp (Username, Password, attributeList, null, (err, result) => {
//     if (err) return reject (err);
//     cognitoUser = result.user;
//     resolve ();
//   })
// });
