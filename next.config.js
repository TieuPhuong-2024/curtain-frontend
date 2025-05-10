module.exports = {
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
