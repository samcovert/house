import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const isFormValid = () => {
    return credential.length >= 4 && password.length >= 6
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setErrors(["The provided credentials were invalid"])
      return
    }
    setErrors([]);

    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal()
      })
      .catch(async (res) => {
        if (!res.ok) {
          setErrors(["The provided credentials were invalid"]);
        }
        // const data = await res.json();
        // if (data && data.status === 401) {
        //   setErrors(["The provided credentials were invalid"]);
        // } else if (data && data.errors) {
        //   setErrors(data.errors)
        // }
      });
  };

  const handleDemoLogin = (e) => {
    e.preventDefault()
    setCredential('Demo-lition')
    setPassword('password')
    dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
    <div className='login-text'>
      <h1>Log In</h1>
      </div>
      <div className='error-message'>
          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, idx) => (
                <p key={idx} className="error-text">{error}</p>
              ))}
            </div>
          )}
        </div>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input className='password-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className='buttons'>
        <button className='login-button' type="submit" disabled={!isFormValid()}>Log In</button>
        <button className='demo-user-button' onClick={handleDemoLogin}>Log In as Demo User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
