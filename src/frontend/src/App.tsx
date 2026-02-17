import { Share2, Phone, Mail, Instagram } from 'lucide-react';
import { useProfileLocalStorage } from './features/profile/useProfileLocalStorage';
import { useCopyToClipboard } from './features/share/useCopyToClipboard';
import { Toaster } from './components/Toast';
import { toast } from './components/Toast';
import { sanitizePhoneNumber, validateEmail, createSafeMailtoLink, isValidOutboundUrl } from './features/profile/validation';
import { ProfileActionButton } from './components/ProfileActionButton';

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
  const SNAPCHAT_URL = 'https://www.snapchat.com/add/irfan_jujara1?share_id=C0cEQ9XkCtE&locale=en-US';

  // Helper to check if a link is the Snapchat link
  const isSnapchatLink = (url: string) => url === SNAPCHAT_URL;

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/generated/landing-bg-goldblack-v2.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/97 via-background/94 to-background/97" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-4 sm:px-6 py-5 flex justify-end">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/90 hover:bg-accent text-accent-foreground font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm shadow-md hover:shadow-lg border border-accent/20"
            aria-label="Share profile"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6">
          <div className="w-full max-w-md">
            {/* Profile Card */}
            <div className="bg-card/85 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-primary/25">
              {/* Avatar */}
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <img
                    src="/assets/generated/avatar-profile-v2.dim_512x512.png"
                    alt="Profile avatar"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover object-center ring-4 ring-primary/30 shadow-xl"
                    width="112"
                    height="112"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">
                  {profile.displayName}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {profile.bio}
                </p>
              </div>

              {/* Links Section */}
              <div className="space-y-2.5">
                {/* Phone Button */}
                {profile.phone && (
                  <ProfileActionButton
                    href={`tel:${sanitizePhoneNumber(profile.phone)}`}
                    icon={<Phone className="w-5 h-5" />}
                  >
                    Call me
                  </ProfileActionButton>
                )}

                {/* Email Button */}
                {profile.email && validateEmail(profile.email) === null && (
                  <ProfileActionButton
                    href={createSafeMailtoLink(profile.email)}
                    icon={<Mail className="w-5 h-5" />}
                  >
                    Send email
                  </ProfileActionButton>
                )}

                {/* Instagram Button */}
                <ProfileActionButton
                  href={INSTAGRAM_URL}
                  icon={<Instagram className="w-5 h-5" />}
                  external
                >
                  Instagram
                </ProfileActionButton>

                {/* Other Links */}
                {filteredLinks.map((link, index) => (
                  <ProfileActionButton
                    key={index}
                    href={link.url}
                    onClick={(e) => handleLinkClick(e, link.url)}
                    icon={
                      isSnapchatLink(link.url) ? (
                        <img 
                          src="/assets/generated/snapchat-logo.dim_64x64.png" 
                          alt="Snapchat" 
                          className="w-5 h-5 object-contain"
                        />
                      ) : undefined
                    }
                    external
                  >
                    {link.label}
                  </ProfileActionButton>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full px-4 sm:px-6 py-5 text-center text-xs sm:text-sm text-muted-foreground">
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
