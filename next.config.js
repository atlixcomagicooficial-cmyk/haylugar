/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚡️ FIX CRÍTICO: Forzamos la transpilación de estas librerías para que
  // la sintaxis moderna (#private fields) no rompa el build en Vercel.
  transpilePackages: ['undici', 'firebase', '@firebase/auth'],
};

module.exports = nextConfig;