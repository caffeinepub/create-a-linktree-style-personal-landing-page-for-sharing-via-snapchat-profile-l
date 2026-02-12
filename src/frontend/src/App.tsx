import { Share2, Phone, Mail, Instagram } from 'lucide-react';
import { useProfileLocalStorage } from './features/profile/useProfileLocalStorage';
import { useCopyToClipboard } from './features/share/useCopyToClipboard';
import { Toaster } from './components/Toast';
import { toast } from './components/Toast';
import { sanitizePhoneNumber, validateEmail, createSafeMailtoLink, isValidOutboundUrl } from './features/profile/validation';

function App() {
  const { profile } = useProfileLocalStorage();
  const { copyToClipboard } = useCopyToClipboard();

  const handleShare = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy. Please copy the URL manually from your browser.');
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (!isValidOutboundUrl(url)) {
      e.preventDefault();
      toast.error('Invalid link URL');
    }
  };

  // Filter out Twitter/X and Instagram links (Instagram has dedicated button)
  const filteredLinks = profile.links.filter(link => {
    const label = link.label.toLowerCase();
    const url = link.url.toLowerCase();
    
    // Filter out Twitter/X
    if (label.includes('twitter') || url.includes('twitter.com') || url.includes('x.com')) {
      return false;
    }
    
    // Filter out Instagram (we have a dedicated button for it)
    if (label.includes('instagram') || url.includes('instagram.com')) {
      return false;
    }
    
    return true;
  });

  const INSTAGRAM_URL = 'https://www.instagram.com/ae560919?igsh=NHFmdnppNzU4OWVy';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/generated/landing-bg-goldblack.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/98 via-background/95 to-background/98" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-4 py-6 flex justify-end gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/90 hover:bg-accent text-accent-foreground font-medium transition-all hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg"
            aria-label="Share profile"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            {/* Profile Card */}
            <div className="bg-card/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 border border-primary/30">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src="/assets/generated/avatar-profile.dim_512x512.png"
                    alt="Profile avatar"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover object-center ring-4 ring-primary/40 shadow-xl"
                    width="128"
                    height="128"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                  {profile.displayName}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
                  {profile.bio}
                </p>
              </div>

              {/* Links Section */}
              <div className="space-y-3">
                {/* Phone Button */}
                {profile.phone && (
                  <a
                    href={`tel:${sanitizePhoneNumber(profile.phone)}`}
                    className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-primary/60 text-foreground font-medium text-center transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
                  >
                    <Phone className="w-5 h-5" />
                    Call me
                  </a>
                )}

                {/* Email Button */}
                {profile.email && validateEmail(profile.email) === null && (
                  <a
                    href={createSafeMailtoLink(profile.email)}
                    className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-primary/60 text-foreground font-medium text-center transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
                  >
                    <Mail className="w-5 h-5" />
                    Send email
                  </a>
                )}

                {/* Instagram Button */}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-primary/60 text-foreground font-medium text-center transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>

                {/* Other Links */}
                {filteredLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link.url)}
                    className="block w-full py-4 px-6 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-primary/60 text-foreground font-medium text-center transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
