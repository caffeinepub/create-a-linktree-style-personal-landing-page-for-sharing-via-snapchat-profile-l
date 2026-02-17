import React from 'react';

interface ProfileActionButtonProps {
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  external?: boolean;
}

export function ProfileActionButton({ 
  href, 
  onClick, 
  icon, 
  children, 
  external = false 
}: ProfileActionButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl bg-card/60 hover:bg-card/80 border border-primary/30 hover:border-primary/50 text-foreground font-medium text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg backdrop-blur-sm"
    >
      {/* Icon container - always present to maintain alignment */}
      <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">
        {icon}
      </span>
      <span className="flex-1 text-center">{children}</span>
      {/* Spacer to balance icon on left */}
      <span className="w-5 h-5 flex-shrink-0" />
    </a>
  );
}
