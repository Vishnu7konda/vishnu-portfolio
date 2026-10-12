import { useEffect, useState } from 'react';

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
});

export function useLocalTime() {
  const [time, setTime] = useState(() => timeFormat.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(timeFormat.format(new Date())), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    onChange();
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export const pad = (n) => String(n).padStart(2, '0');

export const EASE = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];
