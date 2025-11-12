// src/app/cart/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Trash2, ShoppingCart, ArrowRight, Calendar, Users, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useCart, ShuttleCartItem, TourCartItem } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, totalAmount, removeItem, clearCart } = useCart();

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  if (itemCount === 0) {
    return (
      <>
        <BookingNavbar />
        
        <section className="relative h-48 md:h-64 w-full overflow-hidden">
          <Image
            src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
            alt="Costa Rica Beach"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              Shopping Cart
            </h1>
          </div>
        </section>

        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <Card>
              <CardContent className="py-16 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">
                  Add shuttles or tours to get started!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => router.push('/transfers')} size="lg">
                    Browse Shuttles
                  </Button>
                  <Button onClick={() => router.push('/private-tours')} variant="outline" size="lg">
                    Browse Tours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const shuttles = items.filter((item) => item.type === 'shuttle') as ShuttleCartItem[];
  const tours = items.filter((item) => item.type === 'tour') as TourCartItem[];

  return (
    <>
      <BookingNavbar />
      
      <section className="relative h-48 md:h-64 w-full overflow-hidden">
        <Image
          src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
          alt="Costa Rica Beach"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg mb-2">
              Shopping Cart
            </h1>
            <p className="text-lg drop-shadow-md">
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LEFT - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Shuttles Section */}
              {shuttles.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🚐 Private Shuttles ({shuttles.length})
                  </h2>
                  
                  <div className="space-y-4">
                    {shuttles.map((shuttle) => (
                      <Card key={shuttle.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {shuttle.fromLocation} → {shuttle.toLocation}
                                </h3>
                                {shuttle.tripNumber && shuttle.totalTrips && (
                                  <p className="text-sm text-gray-500">
                                    Trip {shuttle.tripNumber} of {shuttle.totalTrips}
                                  </p>
                                )}
                              </div>

                              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>{shuttle.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Users className="h-4 w-4" />
                                  <span>{shuttle.adults} Adults, {shuttle.children} Children</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <span className="text-xl font-bold text-blue-600">
                                  {formatCurrency(shuttle.finalPrice)}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(shuttle.id)}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Remove from cart"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Tours Section */}
              {tours.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🎯 Private Tours ({tours.length})
                  </h2>
                  
                  <div className="space-y-4">
                    {tours.map((tour) => (
                      <Card key={tour.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {tour.tourName}
                                </h3>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>{tour.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Users className="h-4 w-4" />
                                  <span>{tour.adults} Adults, {tour.children} Children</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>{tour.hotel}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <span className="text-xl font-bold text-blue-600">
                                  {formatCurrency(tour.price)}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(tour.id)}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Remove from cart"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT - Summary (STICKY) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    <div className="space-y-3">
                      {shuttles.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shuttles ({shuttles.length})</span>
                          <span className="font-semibold">
                            {formatCurrency(shuttles.reduce((sum, s) => sum + s.finalPrice, 0))}
                          </span>
                        </div>
                      )}
                      {tours.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tours ({tours.length})</span>
                          <span className="font-semibold">
                            {formatCurrency(tours.reduce((sum, t) => sum + t.price, 0))}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-bold text-blue-600">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          toast.info('WeTravel payment integration - Coming soon!');
                        }}
                        className="w-full min-h-[48px] bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        💳 Proceed to Payment
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>

                      <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="w-full min-h-[48px]"
                      >
                        Continue Shopping
                      </Button>

                      <Button
                        onClick={handleClearCart}
                        variant="outline"
                        className="w-full min-h-[48px] border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Cart
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}