import { useState } from 'react';

export function useCopyToClipboard() {
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setError(null);
        return true;
      }

      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setError(null);
        return true;
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to copy to clipboard');
      setError(error);
      return false;
    }
  };

  return { copyToClipboard, error };
}
