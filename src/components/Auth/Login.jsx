import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [error, setError] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const { login, signup, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const user = await login(email, password);
      // After login, redirect based on role
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'hackathon organizer') {
        navigate('/organizer'); // Redirect hackathon organizer to /organizer route
      } else if (user?.role === 'internship') {
        navigate('/internships'); // Redirect internship organizer to /internships route
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    try {
      const user = await signup(email, password, username, role);
      // Redirect based on role after signup
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'hackathon organizer') {
        navigate('/organizer');
      } else if (user?.role === 'internship') {
        navigate('/internships');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setError('');
  };

  return (
    <div className={`${styles.container} ${isSignUpMode ? styles['sign-up-mode'] : ''}`}>
      <div className={styles['forms-container']}>
        <div className={styles['signin-signup']}>
          <form onSubmit={handleLogin} className={styles['sign-in-form']}>
            <h2 className={styles.title}>Sign in</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className={styles['input-field']}>
              <i className="fas fa-user"></i>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className={styles['input-field']}>
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className={styles.btn}>Login</button>
            <p className={styles['social-text']}>Or Sign in with social platforms</p>
            <div className={styles['social-media']}>
              <a href="#" className={styles['social-icon']}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={styles['social-icon']}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={styles['social-icon']}>
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className={styles['social-icon']}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>

          <form onSubmit={handleSignup} className={styles['sign-up-form']}>
            <h2 className={styles.title}>Sign up</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className={styles['input-field']}>
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            <div className={styles['input-field']}>
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className={styles['input-field']}>
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className={styles['input-field']}>
  <i className="fas fa-user-shield"></i>
  <select 
    value={role}
    onChange={(e) => setRole(e.target.value)}
    required
    className={styles['role-select']}
  >
    <option value="" disabled>Select your role</option>
    <option value="user">Regular User</option>
    <option value="admin">Administrator</option>
    <option value="hackathon organizer">Hackathon Organizer</option>
    <option value="internship">Internship Organizer</option>
  </select>
</div>
            <button type="submit" className={styles.btn}>Sign up</button>
            <p className={styles['social-text']}>Or Sign up with social platforms</p>
            <div className={styles['social-media']}>
              <a href="#" className={styles['social-icon']}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={styles['social-icon']}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={styles['social-icon']}>
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className={styles['social-icon']}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className={styles['panels-container']}>
        <div className={`${styles.panel} ${styles['left-panel']}`}>
          <div className={styles.content}>
            <h3>New here?</h3>
            <p>Sign up now to create, verify, and manage blockchain certificates</p>
            <button className={`${styles.btn} ${styles.transparent}`} onClick={toggleMode}>
              Sign up
            </button>
            <img className={styles.hello} src="/Screeshot 2024-09-14 183525.png" alt="" />
          </div>
        </div>
        <div className={`${styles.panel} ${styles['right-panel']}`}>
          <div className={styles.content}>
            <h3>Already a member</h3>
            <p>Welcome back to CertiChain! Ready to manage your blockchain certificates?</p>
            <button className={`${styles.btn} ${styles.transparent}`} onClick={toggleMode}>
              Sign in
            </button>
          </div>
          <img src="" className={styles.image} alt="" />
        </div>
      </div>
    </div>
  );
}
