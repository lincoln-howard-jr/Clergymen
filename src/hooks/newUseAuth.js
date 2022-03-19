import { useState, useEffect } from "react";
import poolDetails from "../lib/poolDetails";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';


export default function useAuth (onSessionActive, freeze) {
  // config
  let pool = new AmazonCognitoIdentity.CognitoUserPool (poolDetails);
  const [user, setUser] = useState (pool.getCurrentUser ());
  // private state
  const [accessToken, setAccessToken] = useState ('');
  const [idToken, setIdToken] = useState ('');
  const [refreshToken, setRefreshToken] = useState (null);
  const headers = {
    get: {
      'x-amz-access-token': accessToken,
      'x-amz-id-token': idToken
    },
    post: {
      'Content-Type': 'application/json',
      'x-amz-access-token': accessToken,
      'x-amz-id-token': idToken
    }
  };
  
  // public state mgmt
  const [isAuthenticated, setIsAuthenticated] = useState (false);
  const [isFirstLogin, setIsFirstLogin] = useState (false);
  const [userAttributes, setUserAttributes] = useState (null);

  // private method gets access and refresh tokens - call after authenticating
  const retrieveAccessTokens = async () => {
    if (user) user.getSession ((error, session) => {
      if (error) return Promise.reject (error);
      setAccessToken (session.getAccessToken ().getJwtToken ());
      setIdToken (session.getIdToken ().getJwtToken ());
      setRefreshToken (new AmazonCognitoIdentity.CognitoRefreshToken ({RefreshToken: session.getRefreshToken ().getToken ()}));
      setIsAuthenticated (true);
      return Promise.resolve ();
    });
    else return Promise.reject ('user dne');
  };

  // private method - refresh session should be called on init
  const refreshSession = async () => {
    if (user && refreshToken) user.refreshSession (refreshToken, err => {
      if (err) return Promise.reject (err);
      return retrieveAccessTokens ();
    })
  };

  // public method - log user in with username/password
  const login = async (Username, Password) => new Promise (async (resolve, reject) => {
    let details = new AmazonCognitoIdentity.AuthenticationDetails ({Username, Password});
    if (!user) {
      let _user = new AmazonCognitoIdentity.CognitoUser ({Username, Pool: pool});
      setUser (_user);
      _user.authenticateUser (details, {
        onSuccess: async () => {
        },
        onFailure: error => {
          reject (error);
        },
        newPasswordRequired: attrs => {
          delete attrs.email_verified;
          delete attrs.phone_number_verified;
          setUserAttributes (attrs);
          setIsFirstLogin (true);
        }
      });
    }
  });

  const completePasswordChallenge = password => {
    user?.completeNewPasswordChallenge (password, userAttributes, {
      onSuccess: () => {
        init ();
      }
    })
  };
  
  // public sign out of account
  const signOut = async () => new Promise (async (resolve, reject) => {
    try {
      await user.signOut();
      resolve ();
    } catch (e) {
      reject (e);
    }
  });

  // private method
  async function init () {
    await retrieveAccessTokens ();
    await refreshSession ();
  };

  useEffect (() => {
    init ();
  }, [user]);

  useEffect (() => {
    if (isAuthenticated) onSessionActive ();
  }, [isAuthenticated]);

  return {headers, user, isAuthenticated, isFirstLogin, login, completePasswordChallenge, signOut};
}