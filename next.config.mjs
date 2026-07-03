/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/realestate',
        destination: 'https://www.hardyhomes-utah.com/',
        permanent: true,
      },
      {
        source: '/real-estate',
        destination: 'https://www.hardyhomes-utah.com/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
