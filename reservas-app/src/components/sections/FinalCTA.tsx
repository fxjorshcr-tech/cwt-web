// src/components/home/FinalCTA.tsx
// CONTACT SECTION - Quick contact + Contact form

'use client';

import { useState } from 'react';
import { Phone, Mail, MessageSquare, Clock, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// Common country codes for phone
const COUNTRY_CODES = [
  { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+507', country: 'Panama', flag: '🇵🇦' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
];

export default function FinalCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    subject: 'question',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');

      // Reset form
      setFormData({
        name: '',
        email: '',
        countryCode: '+1',
        phone: '',
        subject: 'question',
        message: ''
      });

      // Reset success message after 8 seconds
      setTimeout(() => setSubmitStatus('idle'), 8000);
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">

        {/* Header */}
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out via WhatsApp for instant answers or send us a message.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Left Column - Quick Contact Options */}
          <div className="space-y-6">
            <div className="text-white mb-6">
              <h3 className="text-2xl font-bold mb-2">Quick Contact</h3>
              <p className="text-blue-100">Choose your preferred way to reach us</p>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/50685962438"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl p-6 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1 text-lg">WhatsApp</p>
                  <p className="text-sm text-gray-600 mb-2">+506-8596-2438</p>
                  <p className="text-sm text-green-600 font-semibold">
                    Fastest response - Usually under 5 minutes
                  </p>
                </div>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+50685962438"
              className="block bg-white rounded-xl p-6 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1 text-lg">Phone</p>
                  <p className="text-sm text-gray-600 mb-2">+506-8596-2438</p>
                  <p className="text-sm text-blue-600 font-semibold">
                    Call us anytime
                  </p>
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:contact@cantwaittravelcr.com"
              className="block bg-white rounded-xl p-6 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1 text-lg">Email</p>
                  <p className="text-sm text-gray-600 mb-2">contact@cantwaittravelcr.com</p>
                  <p className="text-sm text-orange-600 font-semibold">
                    Response within 2 hours
                  </p>
                </div>
              </div>
            </a>

            {/* Service Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 text-white">
                <Clock className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Fast response time - We're here to help!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
            <p className="text-gray-600 mb-6">Fill out the form and we'll get back to you soon</p>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Message sent successfully!</p>
                  <p className="text-xs text-green-700 mt-1">We'll get back to you within 2 hours. Check your email for confirmation.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Failed to send message</p>
                  <p className="text-xs text-red-700 mt-1">Please try again or contact us via WhatsApp.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="home-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="home-name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="home-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="home-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone with Country Code */}
              <div>
                <label htmlFor="home-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <select
                    id="home-countryCode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-28 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="home-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="234 567 8900"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="home-message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  id="home-message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your travel plans or ask any questions..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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

              <p className="text-xs text-gray-500 text-center">
                We typically respond within 2 hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
