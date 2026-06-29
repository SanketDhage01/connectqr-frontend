import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white">Owner Access Gate</h2>
        <p className="text-xs text-slate-500">Sign in to check incident alerts and messages</p>
      </div>

      {serverError && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-xs text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="yourname@domain.com"
          error={errors.email}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address format'
            }
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••"
          error={errors.password}
          {...register('password', {
            required: 'Password is required'
          })}
        />

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      <div className="text-xs text-center border-t border-slate-800/40 pt-4 text-slate-500">
        Don't have a secure vehicle profile?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
          Register Vehicle
        </Link>
      </div>
    </div>
  );
};
export default Login;
