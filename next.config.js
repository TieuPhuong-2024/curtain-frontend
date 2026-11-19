module.exports = {
    output: 'standalone',
    async rewrites() {
        const backend = process.env.API_URL_INTERNAL || 'http://localhost:5000';
        return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
    },
    allowedDevOrigins: [
        'flimsier-gudrun-hymenial.ngrok-free.dev',
        '*.ngrok-free.dev',
        '192.168.100.122',
    ],
    turbopack: {
        root: __dirname,
    },
    images: {
        dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
                pathname: '**',
            },
        ]
    },
};
