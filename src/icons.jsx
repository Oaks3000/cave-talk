// Small stroke icons (stand-ins for lucide-react so the app has zero runtime dependencies).
function Flame({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7 0 2-1 3-2 3-2 0-2-3-1-6-4 2-6 6-6 10 0 4 2 7 5 7z" />
    </svg>
  );
}
function Play({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="6,4 20,12 6,20" />
    </svg>
  );
}
function Check({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,13 9,18 20,6" />
    </svg>
  );
}
function SkipForward({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="5,4 13,12 5,20" />
      <rect x="16" y="4" width="3" height="16" />
    </svg>
  );
}
function Hammer({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14.5" y="2.5" width="6" height="7" rx="1" transform="rotate(45 17.5 6)" />
      <path d="M15.5 9.5L5 20" />
      <path d="M3 22l2-5 3 3-5 2z" />
    </svg>
  );
}
function Trophy({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
      <path d="M8 5H5a2 2 0 0 0 0 4h1" />
      <path d="M16 5h3a2 2 0 0 1 0 4h-1" />
      <path d="M10 15v2a2 2 0 0 0 4 0v-2" />
      <path d="M8 21h8" />
      <path d="M10 18h4" />
    </svg>
  );
}
function RotateCcw({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3,3 3,9 9,9" />
    </svg>
  );
}
function X({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}
function HelpCircle({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.9" />
      <line x1="12" y1="17" x2="12" y2="17.1" />
    </svg>
  );
}
function Users({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
      <circle cx="17.5" cy="8.5" r="2.8" />
      <path d="M15.5 14.3c2.8.6 4.8 2.7 5 5.7" />
    </svg>
  );
}
function Trash2({ size = 24, color = "currentColor", className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
