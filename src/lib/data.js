import { useEffect, useState } from 'react';
import { DEFAULT_PROJECTS, DEFAULT_SKILLS } from '../data/defaults';

let cache = null;
let request = null;

function load() {
  request ??= fetch('/api/data')
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .catch(() => ({}))
    .then((d) => {
      cache = {
        skills: d.skills?.length ? d.skills : DEFAULT_SKILLS,
        projects: d.projects?.length ? d.projects : DEFAULT_PROJECTS,
      };
      return cache;
    });
  return request;
}

export function usePortfolio() {
  const [data, setData] = useState(cache);
  useEffect(() => {
    if (cache) return;
    let alive = true;
    load().then((d) => alive && setData(d));
    return () => { alive = false; };
  }, []);
  return data;
}
