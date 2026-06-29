import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await signup(data);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white">Create ConnectQR Workspace</h2>
        <p className="text-xs text-slate-500">Register owner details and vehicle profile together</p>
      </div>

      {serverError && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-xs text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        {/* Section 1: User details */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 border-b border-slate-800/80 pb-1.5 block">
            1. Owner Account Details
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.fullName}
              {...register('fullName', { required: 'Full name is required' })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@domain.com"
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
              label="Phone Number"
              placeholder="+1234567890"
              error={errors.phoneNumber}
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: 'Phone number must be valid E.164 (e.g. +1234567890)'
                }
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••"
              error={errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
            />
          </div>
        </div>

        {/* Section 2: Vehicle details */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 border-b border-slate-800/80 pb-1.5 block">
            2. Vehicle Profile Details
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Input
              label="License Plate Number"
              placeholder="ABC-1234"
              error={errors.vehicleNumber}
              {...register('vehicleNumber', { required: 'Plate number is required' })}
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Vehicle Type
              </label>
              <select
                className="glass-input h-[42px] py-0"
                {...register('vehicleType')}
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="truck">Truck</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Brand"
              placeholder="Tesla / Honda"
              error={errors.brand}
              {...register('brand', { required: 'Vehicle brand is required' })}
            />
            <Input
              label="Model"
              placeholder="Model 3 / Civic"
              error={errors.model}
              {...register('model', { required: 'Vehicle model is required' })}
            />
            <Input
              label="Color"
              placeholder="Midnight Black"
              error={errors.color}
              {...register('color', { required: 'Vehicle color is required' })}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full mt-2"
        >
          Complete Registration & Generate QR
        </Button>
      </form>

      <div className="text-xs text-center border-t border-slate-800/40 pt-4 text-slate-500">
        Already have a vehicle registered?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
          Owner Login
        </Link>
      </div>
    </div>
  );
};
export default Register;
