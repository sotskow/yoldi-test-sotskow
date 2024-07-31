/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/users',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
