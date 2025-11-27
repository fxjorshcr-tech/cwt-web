// src/components/payment/CustomerInfoModal.tsx
'use client';

import { useState } from 'react';
import { X, Loader2, CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Country codes with phone prefixes
const COUNTRIES = [
  { code: 'CR', name: 'Costa Rica', phonePrefix: '+506' },
  { code: 'US', name: 'United States', phonePrefix: '+1' },
  { code: 'CA', name: 'Canada', phonePrefix: '+1' },
  { code: 'MX', name: 'Mexico', phonePrefix: '+52' },
  { code: 'GT', name: 'Guatemala', phonePrefix: '+502' },
  { code: 'PA', name: 'Panama', phonePrefix: '+507' },
  { code: 'CO', name: 'Colombia', phonePrefix: '+57' },
  { code: 'ES', name: 'Spain', phonePrefix: '+34' },
  { code: 'UK', name: 'United Kingdom', phonePrefix: '+44' },
  { code: 'DE', name: 'Germany', phonePrefix: '+49' },
  { code: 'FR', name: 'France', phonePrefix: '+33' },
  { code: 'BR', name: 'Brazil', phonePrefix: '+55' },
  { code: 'AR', name: 'Argentina', phonePrefix: '+54' },
  { code: 'CL', name: 'Chile', phonePrefix: '+56' },
  { code: 'PE', name: 'Peru', phonePrefix: '+51' },
  { code: 'OTHER', name: 'Other', phonePrefix: '+' },
];

export interface CustomerInfo {
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  // Get current country's phone prefix
  const currentCountry = COUNTRIES.find(c => c.code === formData.country) || COUNTRIES[0];

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
    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (phoneNumber.length < 6) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Combine phone prefix with number
    const fullPhone = `${currentCountry.phonePrefix} ${phoneNumber}`;
    await onSubmit({ ...formData, phone: fullPhone });
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setFormData((prev) => ({ ...prev, country: countryCode }));
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
              <h2 className="text-xl font-semibold text-white">Billing Information</h2>
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
            Enter your details to proceed to payment
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

          {/* Country */}
          <div>
            <Label htmlFor="country">Country *</Label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              disabled={isProcessing}
              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.phonePrefix})
                </option>
              ))}
            </select>
          </div>

          {/* Phone with country code */}
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="flex gap-2">
              <div className="flex items-center justify-center px-3 h-10 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium min-w-[70px]">
                {currentCountry.phonePrefix}
              </div>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="8888 8888"
                disabled={isProcessing}
                className={`flex-1 ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
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
                  Connecting to payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Continue to Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
