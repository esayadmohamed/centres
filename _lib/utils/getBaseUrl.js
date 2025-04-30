export function getBaseUrl() {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
    //   : 'https://centres.ma';
      : 'centres-ap7l.vercel.app';
  }
  