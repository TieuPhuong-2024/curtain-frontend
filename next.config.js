module.exports = {
    turbopack: {
        root: __dirname,
    },
    images: {
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
