// src/lib/sanitize-html.ts
// Simple HTML sanitizer to prevent XSS attacks
// Allows only safe HTML tags and removes potentially dangerous content

const ALLOWED_TAGS = [
  'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'span',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'hr'
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  span: ['class'],
  div: ['class'],
  p: ['class'],
  table: ['class'],
  th: ['class'],
  td: ['class'],
  tr: ['class'],
};

// Tags that should never have content between them (self-closing conceptually)
const VOID_TAGS = ['br', 'hr'];

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes script tags, event handlers, and dangerous attributes
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove style tags and their content
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove event handlers (onclick, onerror, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');

  // Remove expression() CSS function (IE vulnerability)
  sanitized = sanitized.replace(/expression\s*\(/gi, '');

  // Remove dangerous HTML tags but preserve allowed ones
  sanitized = sanitized.replace(/<\/?(\w+)([^>]*)>/gi, (match, tag, attributes) => {
    const tagLower = tag.toLowerCase();

    // Check if tag is allowed
    if (!ALLOWED_TAGS.includes(tagLower)) {
      return ''; // Remove disallowed tags
    }

    // For void tags, just return the opening tag
    if (VOID_TAGS.includes(tagLower)) {
      return `<${tagLower}>`;
    }

    // Check if this is a closing tag
    if (match.startsWith('</')) {
      return `</${tagLower}>`;
    }

    // Filter attributes for allowed tags
    const allowedAttrs = ALLOWED_ATTRIBUTES[tagLower] || [];
    let cleanAttributes = '';

    if (allowedAttrs.length > 0 && attributes) {
      // Extract and filter attributes
      const attrMatches = attributes.matchAll(/(\w+)\s*=\s*["']([^"']*)["']/g);
      for (const attrMatch of attrMatches) {
        const [, attrName, attrValue] = attrMatch;
        if (allowedAttrs.includes(attrName.toLowerCase())) {
          // Additional check for href to prevent javascript: URLs
          if (attrName.toLowerCase() === 'href') {
            const cleanValue = attrValue.trim().toLowerCase();
            if (cleanValue.startsWith('javascript:') || cleanValue.startsWith('data:')) {
              continue;
            }
          }
          cleanAttributes += ` ${attrName}="${attrValue}"`;
        }
      }
    }

    // For anchor tags, ensure they have safe defaults
    if (tagLower === 'a' && !cleanAttributes.includes('rel=')) {
      cleanAttributes += ' rel="noopener noreferrer"';
    }
    if (tagLower === 'a' && !cleanAttributes.includes('target=')) {
      cleanAttributes += ' target="_blank"';
    }

    return `<${tagLower}${cleanAttributes}>`;
  });

  return sanitized;
}

/**
 * Strips all HTML tags from content, leaving only text
 * Useful when you want plain text only
 */
export function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }
  return html.replace(/<[^>]*>/g, '').trim();
}
