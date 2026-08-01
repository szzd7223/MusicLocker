"use client";

interface RecordIconProps {
  className?: string;
  size?: number;
}

export function RecordIcon({ className = "", size = 36 }: RecordIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* 2D Plinth Base (Yellow/Cream brand color) */}
      <rect x="2" y="2" width="20" height="20" rx="3.5" fill="#f6d58b" />
      
      {/* Vinyl record platter group - spins! */}
      <g className={className} style={{ transformOrigin: "11px 12px" }}>
        <circle cx="11" cy="12" r="7.5" fill="#20201e" />
        <circle cx="11" cy="12" r="5" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
        <circle cx="11" cy="12" r="3" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
        <circle cx="11" cy="12" r="1.5" fill="#f6d58b" />
        <circle cx="11" cy="12" r="0.5" fill="#20201e" />
      </g>

      {/* Tonearm (Static on top) */}
      <circle cx="18.5" cy="5.5" r="1.2" fill="#20201e" />
      <path
        d="M18.5 5.5 L15 11 L14 11"
        stroke="#ff7959"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="11" r="0.8" fill="#ff7959" />
    </svg>
  );
}
