import { useState } from 'react';
import {useApp} from '../AppProvider';
import { H2 } from '../components/Headers';

function Auth () {
  
  const {router: {page}, auth: {isAuthenticated, isFirstLogin, login, completePasswordChallenge, signOut}} = useApp ();

  const [username, setUsername] = useState ('');
  const [password, setPassword] = useState ('');
  const [err, setErr] = useState (null);
  const runLogin = async e => {
    try {
      await login (username, password);
      setUsername ('');
      setPassword ('');
    } catch (e) {
      setErr (e?.message);
    }
  }
  
  if (page !== '/Clergymen/?page=admin') return '';
  if (isFirstLogin) return (
    <div>
      <H2>Create New Password</H2>
      <div className="input-group">
        <label>Password</label>
        <input type="password" value={password} placeholder="password" onChange={e => setPassword (e.target.value)} />
      </div>
      <div className="input-group">
        <button onClick={() => completePasswordChallenge (password)}>Set New Password</button>
      </div>
    </div>
  )
  if (!isAuthenticated) return (
    <main className="">
      <H2>Log In</H2>
      {
        err &&
        <div className="input-group">
          <label>Error: {err.toString ()}</label>
        </div>
      }
      <div className="input-group">
        <label>Username</label>
        <input value={username} placeholder="Username" onChange={e => setUsername (e.target.value)} />
      </div>
      <div className="input-group">
        <label>Password</label>
        <input type="password" value={password} placeholder="password" onChange={e => setPassword (e.target.value)} />
      </div>
      <div className="input-group">
        <button onClick={runLogin}>Log In</button>
      </div>
    </main>
  )
  return (
    <main className="">
      <div>
        Click to <a onClick={signOut}>logout.</a>
      </div>
    </main>
  )
}

export default Auth