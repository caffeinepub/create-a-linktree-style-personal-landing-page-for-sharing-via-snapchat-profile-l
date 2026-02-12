export function validateUrl(url: string): string | null {
  if (!url || url.trim() === '') {
    return 'URL is required';
  }

  const trimmedUrl = url.trim();

  // Check for javascript: protocol and other unsafe schemes
  const unsafeSchemes = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmedUrl.toLowerCase();
  
  for (const scheme of unsafeSchemes) {
    if (lowerUrl.startsWith(scheme)) {
      return 'Unsafe URL scheme detected';
    }
  }

  // Validate URL format
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Only allow http and https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return 'Only HTTP and HTTPS URLs are allowed';
    }
    
    return null;
  } catch {
    return 'Invalid URL format';
  }
}

export function isValidOutboundUrl(url: string): boolean {
  if (!url || url.trim() === '') {
    return false;
  }

  const trimmedUrl = url.trim();

  // Check for unsafe schemes
  const unsafeSchemes = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmedUrl.toLowerCase();
  
  for (const scheme of unsafeSchemes) {
    if (lowerUrl.startsWith(scheme)) {
      return false;
    }
  }

  // Validate URL format and protocol
  try {
    const urlObj = new URL(trimmedUrl);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizePhoneNumber(phone: string): string {
  // Remove all non-digit characters except + at the start
  return phone.replace(/[^\d+]/g, '').replace(/\+(?=.)/g, '');
}

export function validateEmail(email: string): string | null {
  if (!email || email.trim() === '') {
    return null; // Email is optional
  }

  const trimmedEmail = email.trim();
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return 'Please enter a valid email address';
  }
  
  return null;
}

export function createSafeMailtoLink(email: string): string {
  const trimmedEmail = email.trim();
  
  // Encode the email to prevent injection
  const encodedEmail = encodeURIComponent(trimmedEmail);
  
  return `mailto:${encodedEmail}`;
}
