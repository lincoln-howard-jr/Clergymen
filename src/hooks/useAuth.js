import {useState, useEffect} from 'react';
import {getCurrentUser, login as _login, refreshSession, retrieveAccessToken, signOut} from '../lib/auth';

// auth hook
export default function useAuth (onSessionActive) {

  // state management
  const [user, setUser] = useState (null);
  const [err, setErr] = useState (null);

  // login method
  const login = async (Username, Password) => new Promise (async (resolve, reject) => {
    try {
      await _login (Username, Password);
      await getSession ();
      setUser (true);
      resolve ();
    } catch (e) {
      reject (e);
    }
  });

  // method to get credentials
  const getSession = async () => new Promise (async (resolve, reject) => {
    try {
      await getCurrentUser ();
      await retrieveAccessToken ();
      resolve ();
    } catch (e) {
      reject (e);
    }
  });

  // end session
  const logout = async () => new Promise (async (resolve, reject) => {
    try {
      await signOut ();
      window.location.reload ();
      resolve ();
    } catch (e) {
      reject (e);
    }
  })

  // run to test the waters
  const init = async () => {
    try {
      await getCurrentUser ();
      await getSession ();
      await refreshSession ();
      setUser (true);
    } catch (e) {
      setErr (e);
      setUser (false);
    }
  }

  // call callback when first logged in
  useEffect (() => {
    if (user && onSessionActive) onSessionActive ();
  }, [user]);

  // immediately run this
  useEffect (() => {
    init ();
  }, [])

  //
  return {user, err, login, logout};

}