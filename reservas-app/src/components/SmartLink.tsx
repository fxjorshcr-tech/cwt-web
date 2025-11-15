// src/components/SmartLink.tsx
// ✅ Link wrapper que hace prefetch automático al hover
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, MouseEvent } from 'react';

interface SmartLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
}

export function SmartLink({ 
  href, 
  children, 
  className = '', 
  prefetch = true 
}: SmartLinkProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    if (prefetch) {
      // Prefetch al hacer hover
      router.prefetch(href);
    }
  };

  return (
    <Link 
      href={href} 
      className={className}
      onMouseEnter={handleMouseEnter}
      prefetch={false} // Desactivamos el prefetch automático de Next.js
    >
      {children}
    </Link>
  );
}
