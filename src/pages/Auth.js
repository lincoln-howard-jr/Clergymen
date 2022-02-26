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
  
  if (page !== 'admin') return '';
  if (isFirstLogin) return (
    <main>
      <h1>Create New Password</h1>
      <div className="input-group">
        <label>Password</label>
        <input type="password" value={password} placeholder="password" onChange={e => setPassword (e.target.value)} />
      </div>
      <div className="input-group">
        <button onClick={() => completePasswordChallenge (password)}>Set New Password</button>
      </div>
    </main>
  )
  if (!isAuthenticated) return (
    <main>
      <h1>Log In</h1>
      {
        err &&
        <div className="input-group">
          <label>Error: {err.toString ()}</label>
        </div>
      }
      <div className="row cols-2 text-center">
        <div className="input-group">
          <label>Username</label>
          <br />
          <input value={username} placeholder="Username" name="username" onChange={e => setUsername (e.target.value)} />
        </div>
        <div className="input-group">
          <label>Password</label>
          <br />
          <input type="password" value={password} placeholder="password" onChange={e => setPassword (e.target.value)} />
        </div>
      </div>
      <div className="row cols-1 text-center">
        <div>
          <button onClick={runLogin}>Log In</button>
        </div>
      </div>
    </main>
  )
  return (
    <main>
      <div>
        Click to <a onClick={signOut}>logout.</a>
      </div>
    </main>
  )
}

export default Auth