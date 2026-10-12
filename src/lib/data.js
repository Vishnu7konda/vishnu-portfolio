let request;

export function fetchPortfolio() {
  request ??= fetch('/api/data').then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
  return request;
}
