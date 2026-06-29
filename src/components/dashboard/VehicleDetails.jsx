import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import vehicleService from '../../services/vehicleService';
import Input from '../common/Input';
import Button from '../common/Button';
import GlassCard from '../common/GlassCard';
import { Car, Check, Edit2, ShieldAlert } from 'lucide-react';

export const VehicleDetails = () => {
  const { vehicle, updateVehicleState, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      vehicleNumber: vehicle?.vehicleNumber || '',
      vehicleType: vehicle?.vehicleType || 'car',
      brand: vehicle?.brand || '',
      model: vehicle?.model || '',
      color: vehicle?.color || '',
      status: vehicle?.status || 'active'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    setSuccessMsg('');
    try {
      const response = await vehicleService.updateMyVehicle(data);
      if (response?.status === 'success') {
        updateVehicleState(response.data);
        setIsEditing(false);
        setSuccessMsg('Vehicle details updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setServerError(err.message || 'Failed to update vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const nextStatus = vehicle?.status === 'active' ? 'inactive' : 'active';
      const response = await vehicleService.updateMyVehicle({ status: nextStatus });
      if (response?.status === 'success') {
        updateVehicleState(response.data);
        setSuccessMsg(`QR scan link status set to ${nextStatus}.`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setServerError(err.message || 'Failed to toggle status');
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) {
    return (
      <GlassCard className="flex flex-col items-center justify-center text-center p-8">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-lg font-bold">No Vehicle Registered</h3>
        <p className="text-slate-400 text-sm mt-1">Please contact support or register your vehicle.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Car className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold text-lg text-white">My Vehicle</h3>
            <p className="text-xs text-slate-500">Manage registered vehicle properties</p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>

      {serverError && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-xs text-red-400">
          {serverError}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-1.5 animate-slide-up">
          <Check className="h-4 w-4" />
          {successMsg}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="License Plate / Number"
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
              error={errors.brand}
              {...register('brand', { required: 'Brand is required' })}
            />
            <Input
              label="Model"
              error={errors.model}
              {...register('model', { required: 'Model is required' })}
            />
            <Input
              label="Color"
              error={errors.color}
              {...register('color', { required: 'Color is required' })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </label>
              <select
                className="glass-input h-[42px] py-0"
                {...register('status')}
              >
                <option value="active">Active (QR scans works)</option>
                <option value="inactive">Inactive (QR scans blocked)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end mt-2 pt-2 border-t border-slate-800/40">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Brand</span>
              <p className="text-sm font-medium text-slate-200 mt-0.5">{vehicle.brand}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Model</span>
              <p className="text-sm font-medium text-slate-200 mt-0.5">{vehicle.model}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Color</span>
              <p className="text-sm font-medium text-slate-200 mt-0.5 capitalize">{vehicle.color}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Plate Number</span>
              <p className="text-sm font-bold text-slate-200 mt-0.5 tracking-wide">{vehicle.vehicleNumber}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Type</span>
              <p className="text-sm font-medium text-slate-200 mt-0.5 capitalize">{vehicle.vehicleType}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Security State</span>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                  vehicle.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${vehicle.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                  {vehicle.status === 'active' ? 'Active' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between gap-4">
            <div className="max-w-xs md:max-w-md">
              <span className="text-xs font-semibold text-slate-300 block">Deactivate Scanning</span>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Disable public scanning of your QR. When inactive, anyone scanning your QR code will see a security offline warning and won't be able to send messages.
              </p>
            </div>
            <Button
              variant={vehicle.status === 'active' ? 'danger' : 'primary'}
              size="sm"
              loading={loading}
              onClick={toggleStatus}
              className="flex-shrink-0"
            >
              {vehicle.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
export default VehicleDetails;
