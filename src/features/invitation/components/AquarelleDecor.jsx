"use client";

export function WatercolorWash({ className = "", tone = "gold" }) {
  return (
    <svg
      className={`aquarelle-wash aquarelle-wash--${tone} ${className}`.trim()}
      viewBox="0 0 640 280"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id={`aquarelle-wash-${tone}`} x="-12%" y="-24%" width="124%" height="148%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.034" numOctaves="3" seed={tone === "silver" ? 13 : 7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="24" xChannelSelector="R" yChannelSelector="B" result="distorted" />
          <feGaussianBlur in="distorted" stdDeviation="0.5" />
        </filter>
        <linearGradient id={`aquarelle-gradient-${tone}`} x1="0" y1="0" x2="1" y2="1">
          {tone === "silver" ? (
            <>
              <stop offset="0" stopColor="#f6f7fa" stopOpacity="0.96" />
              <stop offset="0.48" stopColor="#cfd4dd" stopOpacity="0.92" />
              <stop offset="1" stopColor="#aeb5c1" stopOpacity="0.82" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#f4e6b7" stopOpacity="0.94" />
              <stop offset="0.52" stopColor="#d8b867" stopOpacity="0.9" />
              <stop offset="1" stopColor="#b78c35" stopOpacity="0.8" />
            </>
          )}
        </linearGradient>
      </defs>
      <path
        filter={`url(#aquarelle-wash-${tone})`}
        fill={`url(#aquarelle-gradient-${tone})`}
        d="M26 143C20 89 79 32 159 44c55 8 78-30 141-17 57 12 86 49 141 40 83-13 157 27 169 81 14 65-75 97-149 93-60-3-90 26-151 17-53-8-84-36-135-26-69 14-142-20-149-89Z"
      />
    </svg>
  );
}

export function BotanicalSprig({ className = "", mirrored = false }) {
  return (
    <svg
      className={`aquarelle-sprig${mirrored ? " aquarelle-sprig--mirrored" : ""} ${className}`.trim()}
      viewBox="0 0 360 210"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 190C75 167 120 135 172 75 208 34 252 17 342 18" strokeWidth="2.2" />
        <path d="M91 153C84 114 69 88 42 64" strokeWidth="1.55" />
        <path d="M148 104C131 72 118 52 88 34" strokeWidth="1.55" />
        <path d="M201 54C216 83 241 106 279 118" strokeWidth="1.55" />
        <path d="M256 30C280 51 306 60 338 59" strokeWidth="1.55" />
      </g>
      <g className="aquarelle-sprig__leaves" fill="currentColor">
        <ellipse cx="65" cy="145" rx="15" ry="34" transform="rotate(-54 65 145)" />
        <ellipse cx="107" cy="118" rx="13" ry="30" transform="rotate(-42 107 118)" />
        <ellipse cx="147" cy="77" rx="12" ry="29" transform="rotate(-30 147 77)" />
        <ellipse cx="216" cy="70" rx="12" ry="29" transform="rotate(44 216 70)" />
        <ellipse cx="265" cy="102" rx="12" ry="28" transform="rotate(56 265 102)" />
        <ellipse cx="298" cy="43" rx="11" ry="26" transform="rotate(66 298 43)" />
      </g>
      <g className="aquarelle-sprig__flowers" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M81 43c14-28 45-20 44 7-1 17-17 30-37 34-13-14-16-28-7-41Z" />
        <path d="M273 137c8-27 39-30 47-6 6 18-7 36-25 46-17-10-27-23-22-40Z" />
      </g>
    </svg>
  );
}

export function TornPaperDivider({ className = "", inverted = false }) {
  return (
    <svg
      className={`aquarelle-torn-divider${inverted ? " aquarelle-torn-divider--inverted" : ""} ${className}`.trim()}
      viewBox="0 0 1000 96"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M0 38c35 6 63 18 101 12 34-5 52-23 88-18 31 5 47 24 81 18 43-8 60-31 106-20 33 8 46 31 84 23 35-8 60-29 101-20 31 7 49 25 81 20 39-6 59-29 101-20 39 9 57 33 98 22 43-12 73-28 159-10V96H0Z"
      />
    </svg>
  );
}

export function WeddingRingsMark({ className = "" }) {
  return (
    <svg className={`aquarelle-rings ${className}`.trim()} viewBox="0 0 160 88" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="4">
        <circle cx="61" cy="47" r="28" />
        <circle cx="99" cy="47" r="28" />
      </g>
      <path d="m80 4 7 12-7 8-7-8Z" fill="currentColor" />
      <path d="M72 16h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
