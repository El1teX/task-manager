const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const PlusIcon = () => (
  <svg {...common} width="18" height="18">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const EditIcon = () => (
  <svg {...common}>
    <path d="M4 20h4L19 9l-4-4L4 16v4z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);

export const ThemeIcon = ({ theme }) => (
  <svg {...common}>
    {theme === 'light' && (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    )}
    {theme === 'dark' && <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />}
    {theme === 'system' && (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
      </>
    )}
  </svg>
);
