/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    QUIZ_SECRET: process.env.QUIZ_APP_SECRET,
  },
};

module.exports = nextConfig;
