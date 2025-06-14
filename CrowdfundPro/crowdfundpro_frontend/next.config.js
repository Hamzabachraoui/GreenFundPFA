/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*'
      }
    ];
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost', '127.0.0.1'],
  }
};

module.exports = nextConfig; 