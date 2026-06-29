import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import chatService from '../services/chatService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import GlassCard from '../components/common/GlassCard';
import ChatWindow from '../components/chat/ChatWindow';
import { ShieldCheck, MessageSquare, Car, Image, AlertTriangle, Send } from 'lucide-react';

export const ScanVehicle = () => {
  const { qrCodeId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Transition state: set conversation ID after visitor submits the form
  const [conversationId, setConversationId] = useState(null);
  const [visitorName, setVisitorName] = useState('Anonymous Visitor');
  
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      visitorName: '',
      reason: 'Vehicle Blocking',
      messageText: ''
    }
  });

  const imageAttachmentWatch = watch('imageAttachment');

  // Load public details of vehicle
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await chatService.getScanDetails(qrCodeId);
        if (response?.status === 'success') {
          setVehicle(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to scan QR details. QR code may be inactive or invalid.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [qrCodeId]);

  // Image upload preview handler
  useEffect(() => {
    if (imageAttachmentWatch && imageAttachmentWatch.length > 0) {
      const file = imageAttachmentWatch[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageAttachmentWatch]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('visitorName', data.visitorName || 'Anonymous Visitor');
      formData.append('reason', data.reason);
      formData.append('messageText', data.messageText);
      
      if (data.imageAttachment && data.imageAttachment.length > 0) {
        formData.append('imageAttachment', data.imageAttachment[0]);
      }

      const response = await chatService.submitContactForm(qrCodeId, formData);
      if (response?.status === 'success') {
        setVisitorName(data.visitorName || 'Anonymous Visitor');
        setConversationId(response.data.conversationId);
      }
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-16 text-slate-500 gap-3">
        <svg className="animate-spin h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-medium">Resolving QR routing link...</span>
      </div>
    );
  }

  // Handle vehicle inactive or not found
  if (error || !vehicle) {
    return (
      <div className="max-w-md mx-auto w-full py-10 animate-slide-up">
        <GlassCard className="flex flex-col items-center justify-center text-center p-8 border-red-950/40">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white">Scan Failed</h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            {error || 'This QR Code belongs to an inactive vehicle profile or is disabled.'}
          </p>
          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed bg-slate-950/20 border border-slate-900 rounded-lg p-2.5">
            ConnectQR protects owner data. Personal phone numbers or vehicle plate details are never shared.
          </p>
        </GlassCard>
      </div>
    );
  }

  // Render Live Chat view if submission has succeeded
  if (conversationId) {
    return (
      <div className="max-w-xl mx-auto w-full py-6 animate-slide-up flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl">
          <ShieldCheck className="h-5 w-5 flex-shrink-0" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">Connection Established</span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Secure bridge active. You can chat directly with the vehicle owner below.
            </p>
          </div>
        </div>

        <ChatWindow
          conversationId={conversationId}
          senderType="visitor"
          visitorName={visitorName}
        />
      </div>
    );
  }

  // Render contact form
  return (
    <div className="max-w-md mx-auto w-full py-6 animate-slide-up">
      <GlassCard className="flex flex-col gap-6">
        {/* Safe Vehicle Title */}
        <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4">
          <span className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-400">
            <Car className="h-6 w-6 animate-pulse" />
          </span>
          <div>
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">ConnectQR Gateway</span>
            <h3 className="text-lg font-bold text-white leading-tight">
              Contact Owner of {vehicle.color} {vehicle.brand}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Model: {vehicle.model} • Privacy Guard Active</p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Your Name (Optional)"
            placeholder="e.g. John (Visitor)"
            error={errors.visitorName}
            {...register('visitorName')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Reason for Contact
            </label>
            <select
              className="glass-input h-[42px] py-0"
              {...register('reason')}
            >
              <option value="Vehicle Blocking">Vehicle Blocking</option>
              <option value="Lights ON">Lights ON</option>
              <option value="Alarm Ringing">Alarm Ringing</option>
              <option value="Window Open">Window Open</option>
              <option value="Found Item">Found Item</option>
              <option value="Emergency">Emergency</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Message Text
            </label>
            <textarea
              placeholder="Explain the issue details (e.g., Please move your car, you block my driveway)..."
              rows={3}
              className={`glass-input resize-none py-3 text-xs leading-relaxed`}
              {...register('messageText', {
                required: 'Please type details of the incident',
                minLength: { value: 5, message: 'Message must be at least 5 characters' }
              })}
            />
            {errors.messageText && (
              <span className="text-xs text-red-400 font-medium">
                {errors.messageText.message}
              </span>
            )}
          </div>

          {/* Optional Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Image className="h-3.5 w-3.5" />
              Attach Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              {...register('imageAttachment')}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer border border-dashed border-slate-800 hover:border-brand-500/50 bg-slate-950/20 hover:bg-slate-950/40 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 transition-all text-slate-500 hover:text-slate-300"
            >
              {imagePreview ? (
                <div className="relative w-full max-w-[200px] aspect-video rounded-lg overflow-hidden border border-slate-800">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] font-bold text-white px-2 py-0.5 rounded">Change</span>
                </div>
              ) : (
                <>
                  <Image className="h-6 w-6 stroke-[1.5]" />
                  <span className="text-[11px] font-medium">Click to upload vehicle photo</span>
                </>
              )}
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            className="w-full mt-2"
          >
            Submit Incident Alert
          </Button>
        </form>

        <div className="text-[10px] text-center text-slate-500 leading-relaxed pt-2 border-t border-slate-800/40">
          This system is anonymous. We never reveal your name, location, browser, IP or phone details to the owner.
        </div>
      </GlassCard>
    </div>
  );
};
export default ScanVehicle;
