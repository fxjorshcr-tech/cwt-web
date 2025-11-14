// src/components/booking/TermsCheckbox.tsx
'use client';

import { useState } from 'react';
import TermsModal from './TermsModal';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: boolean;
}

export default function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <>
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      
      <div className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
        error 
          ? 'border-red-300 bg-red-50' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <input
          type="checkbox"
          id="terms-checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
        />
        <label htmlFor="terms-checkbox" className="text-sm text-gray-700 cursor-pointer select-none">
          I agree to the{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowTermsModal(true);
            }}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Terms & Conditions
          </button>
        </label>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-2">
          You must accept the terms and conditions to continue
        </p>
      )}
    </>
  );
}