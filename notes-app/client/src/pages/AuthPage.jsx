import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      return setError('Please fill in all fields');
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel auth-form">
      <h2>{isLogin ? 'Login' : 'Create account'}</h2>

      {error && <p className="error">{error}</p>}

      {!isLogin && (
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      )}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
      </button>

      <p>
        {isLogin
          ? <>New here? <Link to="/register">Register</Link></>
          : <>Already have an account? <Link to="/login">Login</Link></>}
      </p>
    </form>
  );
}