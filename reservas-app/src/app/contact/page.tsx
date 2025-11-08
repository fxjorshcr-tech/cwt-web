// src/app/contact/page.tsx
// ✅ FIXED - Sin metadata export en client component
'use client';

import { useState } from 'react';
import Image from 'next/image';
import BookingNavbar from '@/components/booking/BookingNavbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulación de envío (reemplazar con API real)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <BookingNavbar />

      <main className="min-h-screen bg-white">
        
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp"
              alt="Contact Can't Wait Travel"
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
              quality={50}
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <MessageSquare className="h-5 w-5 text-white" />
              <span className="text-white font-semibold text-sm uppercase tracking-wide">
                We're Here to Help
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Get in Touch
            </h1>
            
            <p className="text-lg sm:text-xl text-white/95 max-w-2xl drop-shadow-lg">
              Questions about your transfer? Need help planning your trip? We're available 24/7
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="relative -mt-16 z-20 px-6 pb-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* WhatsApp */}
              <a
                href="https://wa.me/50685962438"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
                    <p className="text-sm text-gray-600 mb-2">Fastest response time</p>
                    <p className="text-green-600 font-semibold">+506 8596-2438</p>
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@cantwaittravelcr.com"
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                    <p className="text-sm text-gray-600 mb-2">Response within 2 hours</p>
                    <p className="text-blue-600 font-semibold text-sm break-all">info@cantwaittravelcr.com</p>
                  </div>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+50685962438"
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                    <p className="text-sm text-gray-600 mb-2">Call us directly</p>
                    <p className="text-orange-600 font-semibold">+506 8596-2438</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Main Content: Form + Info */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Message sent successfully!</p>
                      <p className="text-xs text-green-700 mt-1">We'll get back to you within 2 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">New Booking Inquiry</option>
                      <option value="modification">Modify Existing Booking</option>
                      <option value="question">General Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Additional Info */}
              <div className="space-y-8">
                
                {/* Office Hours */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Office Hours</h3>
                      <p className="text-gray-600 text-sm">Available for calls and emails</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700 font-medium">Monday - Friday</span>
                      <span className="text-gray-900 font-semibold">7:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700 font-medium">Saturday</span>
                      <span className="text-gray-900 font-semibold">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700 font-medium">Sunday</span>
                      <span className="text-gray-900 font-semibold">9:00 AM - 5:00 PM</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-green-900">WhatsApp available 24/7</strong> for urgent inquiries
                      </span>
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-600 text-sm">Based in La Fortuna, Costa Rica</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    While our main office is in La Fortuna, we operate throughout Costa Rica with 
                    pickups from both San José (SJO) and Liberia (LIR) airports.
                  </p>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 font-medium">
                      📍 Serving all major destinations: La Fortuna, Manuel Antonio, Monteverde, 
                      Tamarindo, Papagayo, and more
                    </p>
                  </div>
                </div>

                {/* FAQ Link */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
                  <h3 className="text-xl font-bold mb-3">Have a Quick Question?</h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Check our FAQ section for instant answers to common questions about bookings, 
                    cancellations, payments, and more.
                  </p>
                  <a
                    href="/faq"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    View FAQ
                    <Send className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact Notice */}
        <section className="py-12 bg-orange-50 border-t border-orange-200">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <AlertCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Need Immediate Assistance?</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              If you have an urgent matter related to an active booking (flight delays, changes, emergencies), 
              please contact us directly via WhatsApp for the fastest response.
            </p>
            <a
              href="https://wa.me/50685962438?text=Urgent:%20"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 hover:shadow-lg transition-all"
            >
              <Phone className="h-5 w-5" />
              Contact via WhatsApp
            </a>
          </div>
        </section>

      </main>

      <WhatsAppButton />
    </>
  );
}