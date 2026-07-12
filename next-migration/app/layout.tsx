import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css"; // Assumes tailwind imports are set up here

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap"
});

export const metadata: Metadata = {
  title: "My Shoes Hub | Premium Shoe Store in Bardoli, Gujarat",
  description: "Established in 2005, My Shoes Hub offers premium Chelsea boots, sneakers, riding shoes, and formal shoe rentals. Visit Bardoli's trusted shoe store run by Kritesh Yadav.",
  keywords: ["My Shoes Hub", "Shoe store Bardoli", "Shoe rental Gujarat", "Kritesh Yadav", "Chelsea boots", "Riding shoes"],
  authors: [{ name: "Kritesh Yadav" }],
  openGraph: {
    title: "My Shoes Hub | 20+ Years of Trust in Bardoli, Gujarat",
    description: "Explore our collection of sneakers, boots, sports shoes, and customized formal rentals. Established in 2005.",
    url: "https://www.myshoeshub.com",
    siteName: "My Shoes Hub",
    images: [
      {
        url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "My Shoes Hub Premium Collection"
      }
    ],
    locale: "en_IN",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org LocalBusiness structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ShoeStore",
    "name": "My Shoes Hub",
    "image": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800",
    "@id": "https://www.myshoeshub.com/#store",
    "url": "https://www.myshoeshub.com/",
    "telephone": "+911234567892",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opp. Sardar Vallabhbhai Patel Statue, Station Road",
      "addressLocality": "Bardoli",
      "addressRegion": "Gujarat",
      "postalCode": "394601",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "21.1197",
      "longitude": "73.1147"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "10:00",
      "closes": "21:00"
    },
    "founder": {
      "@type": "Person",
      "name": "Kritesh Yadav"
    },
    "foundingDate": "2005"
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld-json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${sora.variable} antialiased font-body bg-[#FDFBF7] text-[#1E1B1A]`}>
        {children}
      </body>
    </html>
  );
}
