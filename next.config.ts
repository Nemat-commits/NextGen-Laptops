import type { NextConfig } from 'next';
const config: NextConfig = {
  // Leave room for multipart overhead and the other form fields around a 2 MB image.
  experimental: { serverActions: { bodySizeLimit: '3mb' } },
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }, { protocol: 'https', hostname: 'i.dell.com' }] }
};
export default config;
