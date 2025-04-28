module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    '*.ngrok-free.app'
  ],
  experimental: {
    largePageDataBytes: 196 * 1024,
  }
};