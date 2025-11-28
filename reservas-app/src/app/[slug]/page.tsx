// src/app/[slug]/page.tsx
// ✅ FINAL: Con estilos Tailwind puros que SÍ funcionan
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Loader2, AlertCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { sanitizeHtml } from '@/lib/sanitize-html';
import BookingNavbar from '@/components/booking/BookingNavbar';

interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  last_updated: string;
}

export default function LegalPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, [slug]);

  async function loadPage() {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Page not found');
        } else {
          throw fetchError;
        }
        return;
      }

      setPage(data);
    } catch (err) {
      console.error('Error loading page:', err);
      setError('Failed to load page content');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <BookingNavbar />
        <section className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      </>
    );
  }

  if (error || !page) {
    return (
      <>
        <BookingNavbar />
        <section className="relative h-64 bg-gradient-to-r from-red-600 to-red-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
              <p className="text-lg">{error || 'This page does not exist'}</p>
            </div>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Return Home
          </button>
        </div>
      </>
    );
  }

  const formattedDate = new Date(page.last_updated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <BookingNavbar />

      {/* Hero Section */}
      <section className="relative h-72 md:h-96 w-full overflow-hidden">
        <Image
          src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
          alt="Costa Rica Beach"
          fill
          className="object-cover"
          style={{ objectPosition: '50% 65%' }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <FileText className="h-14 w-14 md:h-20 md:w-20 mx-auto mb-6 text-white drop-shadow-2xl" />
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-2xl mb-3">
              {page.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg">
              Last updated: {formattedDate}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            
            {/* Content with custom CSS */}
            <div className="p-8 md:p-12">
              <style dangerouslySetInnerHTML={{ __html: `
                .legal-content h2 {
                  font-size: 1.875rem;
                  font-weight: 700;
                  color: #111827;
                  margin-top: 2rem;
                  margin-bottom: 1.5rem;
                  padding-bottom: 1rem;
                  border-bottom: 2px solid #e5e7eb;
                }
                
                .legal-content h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  color: #2563eb;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                }
                
                .legal-content p {
                  margin-bottom: 1rem;
                  line-height: 1.75;
                  color: #374151;
                }
                
                .legal-content ul {
                  list-style-type: disc;
                  padding-left: 2rem;
                  margin: 1.5rem 0;
                }
                
                .legal-content li {
                  margin-bottom: 0.5rem;
                  line-height: 1.75;
                  color: #374151;
                }
                
                .legal-content strong {
                  font-weight: 700;
                  color: #111827;
                }
                
                .legal-content a {
                  color: #2563eb;
                  text-decoration: none;
                  font-weight: 500;
                }
                
                .legal-content a:hover {
                  text-decoration: underline;
                }
              `}} />
              <div
                className="legal-content"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
              />
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Home
                </button>
                
                <a
                  href="https://wa.me/50685962438"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Questions? Chat with Us
                </a>
              </div>
            </div>
          </div>

          {/* Help CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border-2 border-blue-200 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Need Clarification?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Our team is here to answer any questions about our policies. 
              We respond quickly via WhatsApp or email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/50685962438"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp Us
              </a>
              <a
                href="mailto:contact@cantwaittravelcr.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}