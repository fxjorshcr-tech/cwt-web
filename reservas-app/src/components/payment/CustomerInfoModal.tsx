// src/components/payment/CustomerInfoModal.tsx
'use client';

import { useState } from 'react';
import { X, Loader2, CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerInfo: CustomerInfo) => Promise<void>;
  totalAmount: number;
  isProcessing: boolean;
}

export default function CustomerInfoModal({
  isOpen,
  onClose,
  onSubmit,
  totalAmount,
  isProcessing,
}: CustomerInfoModalProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'CR',
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isProcessing ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">Payment Details</h2>
            </div>
            {!isProcessing && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          <p className="text-blue-100 text-sm mt-1">
            Enter your billing information to proceed
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="John"
                disabled={isProcessing}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Doe"
                disabled={isProcessing}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              disabled={isProcessing}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+506 8888-8888"
              disabled={isProcessing}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              disabled={isProcessing}
              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CR">Costa Rica</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="MX">Mexico</option>
              <option value="GT">Guatemala</option>
              <option value="PA">Panama</option>
              <option value="CO">Colombia</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>

          {/* Amount and Submit */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total to pay:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${totalAmount.toFixed(2)} USD
              </span>
            </div>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay ${totalAmount.toFixed(2)} USD
                </>
              )}
            </Button>
          </div>

          {/* Payment methods */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="h-6 opacity-60"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="h-6 opacity-60"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
              alt="Amex"
              className="h-6 opacity-60"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
