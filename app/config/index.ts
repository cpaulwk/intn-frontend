// app/config/index.ts
const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    googleCallbackUrl: process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google',
  };
  
  export default config;