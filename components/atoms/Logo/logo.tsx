export const SkyJetLogo = () => {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect width="40" height="40" rx="8" fill="url(#paint0_linear)" />
        
        {/* Jet silhouette */}
        <path d="M30 18.5L22 15V12C22 11.448 21.552 11 21 11H19C18.448 11 18 11.448 18 12V15L10 18.5C9.448 18.5 9 18.948 9 19.5V21.5C9 22.052 9.448 22.5 10 22.5L18 21V24L16 25C15.448 25 15 25.448 15 26V27C15 27.552 15.448 28 16 28H24C24.552 28 25 27.552 25 27V26C25 25.448 24.552 25 24 25L22 24V21L30 22.5C30.552 22.5 31 22.052 31 21.5V19.5C31 18.948 30.552 18.5 30 18.5Z" fill="white"/>
        
        {/* Speed lines */}
        <path d="M8 16C9.33333 15.6667 12 15.3 12 16.5" stroke="white" strokeLinecap="round"/>
        <path d="M6 19C7.33333 18.6667 10 18.3 10 19.5" stroke="white" strokeLinecap="round"/>
        <path d="M6 22C7.33333 21.6667 10 21.3 10 22.5" stroke="white" strokeLinecap="round"/>
        
        {/* Circular window details */}
        <circle cx="20" cy="19" r="1" fill="url(#paint1_linear)"/>
        <circle cx="23" cy="19" r="0.7" fill="url(#paint1_linear)"/>
        <circle cx="17" cy="19" r="0.7" fill="url(#paint1_linear)"/>
        
        {/* Gradients */}
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E40AF"/>
            <stop offset="1" stopColor="#3B82F6"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="16" y1="19" x2="24" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93C5FD"/>
            <stop offset="1" stopColor="#3B82F6"/>
          </linearGradient>
        </defs>
      </svg>
    );
  };