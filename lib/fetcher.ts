// lib/fetcher.ts
export const fetcher = (url: string | URL | Request) => fetch(url).then((res) => res.json());
