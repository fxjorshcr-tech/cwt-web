// src/components/booking/ConfirmBackDialog.tsx
// ✅ Modal de confirmación SIMPLE - solo mensaje directo
'use client';

import { ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmBackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmBackDialog({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmBackDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogDescription className="text-center text-lg text-gray-900 py-6">
          Are you sure you want to leave your booking progress?
        </DialogDescription>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 border-2 border-gray-300 hover:bg-gray-50"
          >
            Stay Here
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}