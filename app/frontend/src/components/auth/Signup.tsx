import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './api';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if passwords match
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordValid = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (!passwordValid) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.signup({ username, email, password });
      if (response.success) {
        navigate('/login');
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900">Sign Up</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className={`mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                password && !passwordValid ? 'border-red-500' : ''
              }`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {password && !passwordValid && (
              <p className="text-red-500 text-xs mt-1">Password must be at least 8 characters</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              className={`mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                confirmPassword && !passwordsMatch ? 'border-red-500' : passwordsMatch ? 'border-green-500' : ''
              }`}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && (
              <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded focus:outline-none ${
              loading || !passwordsMatch || !passwordValid
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={loading || !passwordsMatch || !passwordValid}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup; 