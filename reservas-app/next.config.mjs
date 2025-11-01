/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuración de imágenes para permitir Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mmlbslwljvmscbgsqkkq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;