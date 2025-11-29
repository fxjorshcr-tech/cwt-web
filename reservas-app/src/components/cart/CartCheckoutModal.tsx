// src/components/cart/CartCheckoutModal.tsx
// Modal to confirm checkout when user has items in cart
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard, Eye, Package, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItemCount: number;
  cartTotal: number;
  currentBookingTotal: number;
  isLoading?: boolean;
  onPayAll: () => void;        // Pay everything (cart + current)
  onPayOnlyThis: () => void;   // Pay only current booking
  onViewCart: () => void;      // Navigate to cart
}

export function CartCheckoutModal({
  isOpen,
  onClose,
  cartItemCount,
  cartTotal,
  currentBookingTotal,
  isLoading = false,
  onPayAll,
  onPayOnlyThis,
  onViewCart,
}: CartCheckoutModalProps) {
  const combinedTotal = cartTotal + currentBookingTotal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Items in Your Cart
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            You have <span className="font-bold text-gray-900">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</span> in your cart
            totaling <span className="font-bold text-blue-600">{formatCurrency(cartTotal)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {/* Summary Box */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current booking:</span>
              <span className="font-semibold">{formatCurrency(currentBookingTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cart items ({cartItemCount}):</span>
              <span className="font-semibold">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Combined Total:</span>
                <span className="font-bold text-blue-600 text-lg">{formatCurrency(combinedTotal)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* Pay All */}
            <Button
              onClick={onPayAll}
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Pay Everything ({formatCurrency(combinedTotal)})
                </>
              )}
            </Button>

            {/* Pay Only This */}
            <Button
              onClick={onPayOnlyThis}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Only This ({formatCurrency(currentBookingTotal)})
                </>
              )}
            </Button>

            {/* View Cart */}
            <Button
              onClick={onViewCart}
              disabled={isLoading}
              variant="ghost"
              className="w-full h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Cart First
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-center text-gray-500 pt-2">
            Cart items will be saved until you complete checkout
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
