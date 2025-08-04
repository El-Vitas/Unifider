const config = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  domain: import.meta.env.VITE_DOMAIN ?? 'http://localhost:3000',
};

export default config;
