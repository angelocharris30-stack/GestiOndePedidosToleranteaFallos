const base = (children) =>
  function Icono({ size = 18, ...props }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        {children}
      </svg>
    );
  };

export const Icon = {
  Logo: base(<><circle cx="6" cy="12" r="2.3" /><circle cx="18" cy="6" r="2.3" /><circle cx="18" cy="18" r="2.3" /><path d="M8.1 11l7.8-4M8.1 13l7.8 4" /></>),
  Edit: base(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>),
  Trash: base(<><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></>),
  Search: base(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  Close: base(<path d="M18 6 6 18M6 6l12 12" />),
  Check: base(<path d="m5 12.5 4.5 4.5L19 7.5" />),
  Alert: base(<><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></>),
  ArrowLeft: base(<path d="M19 12H5M11 6l-6 6 6 6" />),
  ArrowRight: base(<path d="M5 12h14M13 6l6 6-6 6" />),
  ArrowDown: base(<path d="M12 5v14M6 13l6 6 6-6" />),
  Inbox: base(<><path d="M3 13l3-8h12l3 8" /><path d="M3 13v6h18v-6h-5l-1.5 2h-5L8 13H3Z" /></>),
  Globe: base(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>),
  Server: base(<><rect x="3" y="3" width="18" height="7" rx="2" /><rect x="3" y="14" width="18" height="7" rx="2" /><path d="M7 6.5h.01M7 17.5h.01" /></>),
  Database: base(<><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>),
  Pulse: base(<path d="M3 12h4l2.5-6 4 12 2.5-6h5" />),
};
