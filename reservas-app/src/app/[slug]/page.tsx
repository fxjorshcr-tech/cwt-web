// src/app/[slug]/page.tsx
// Página dinámica para Terms, Cancellation Policy, etc.
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

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
        <section className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-700">
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
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
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image
          src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
          alt="Costa Rica Beach"
          fill
          className="object-cover"
          style={{ objectPosition: '50% 65%' }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <FileText className="h-16 w-16 mx-auto mb-4 text-white drop-shadow-lg" />
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
              {page.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
            
            {/* Last Updated */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Last Updated:</strong> {formattedDate}
              </p>
            </div>

            {/* Content (HTML) */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200 text-center">
            <p className="text-gray-700 mb-4">
              Questions about our policies? We're here to help!
            </p>
            <a
              href="https://wa.me/50685962438"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}