export function getBaseUrl() {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://www.centres.ma';
  }
  