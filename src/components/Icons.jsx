const svgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const icon = (children, cls) => (props) => (
  <svg {...svgProps} className={cls} {...props}>{children}</svg>
);

export const ArrowRight = icon(<path d="M5 12h14M13 6l6 6-6 6" />, 'arr-r');
export const ArrowUpRight = icon(<path d="M7 17 17 7M8 7h9v9" />, 'arr-ur');
export const ArrowUp = icon(<path d="M12 19V5M6 11l6-6 6 6" />);
export const Menu = icon(<path d="M4 8h16M4 16h16" />);
export const Close = icon(<path d="M6 6l12 12M18 6 6 18" />);
export const Check = icon(<path d="M5 12.5l4.5 4.5L19 7" />);
export const Copy = icon(<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>);
export const Mail = icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);
export const Phone = icon(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />);
export const Pin = icon(<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>);
export const Moon = icon(<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />);
export const Sun = icon(<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>);
