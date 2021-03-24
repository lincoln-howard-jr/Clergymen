import { useState } from 'react';
import {useApp} from '../AppProvider';
import { H2 } from '../components/Headers';

function Auth () {
  
  const {router: {page}, auth: {user, login}} = useApp ();

  const [username, setUsername] = useState ('');
  const [password, setPassword] = useState ('');
  const runLogin = async e => {
    try {
      await login (username, password);
      alert ('success');
    } catch (e) {
      console.log (e);
    }
  }
  
  if (page !== '/admin') return '';
  return user ? '' : (
    <main className="">
      <H2>Log In</H2>
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
}

export default Auth