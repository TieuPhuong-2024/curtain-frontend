import Script from 'next/script';

export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Tuấn Rèm',
    description:
      'Cửa hàng rèm cửa cao cấp với đa dạng mẫu mã, chất liệu và màu sắc.',
    image: 'http://localhost:3000/images/logo.png',
    url: 'http://localhost:3000',
    telephone: '+84xxxxxxxxxx', // Replace with actual phone number
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Đường ABC', // Replace with actual address
      addressLocality: 'Hà Nội', // Replace with actual city
      addressRegion: 'HN',
      postalCode: '100000',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '21.0278', // Replace with actual coordinates
      longitude: '105.8342',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    priceRange: '₫₫',
    paymentAccepted: 'Cash, Credit Card',
    currenciesAccepted: 'VND',
    // Add any additional required information here
  };

  return (
    <Script id="json-ld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
}
