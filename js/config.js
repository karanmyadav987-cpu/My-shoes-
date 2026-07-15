const CONFIG = {
  business: {
    name: "My Shoes Hub",
    owner: "Kritesh Yadav",
    established: 2005,
    dailyCustomers: 45,
    location: "Bardoli, Gujarat, India",
    phoneDisplay: "+91 12345 67892",
    phoneNumber: "1234567892",
    whatsappNumber: "911234567892",
    email: "hello@myshoeshub.in",
    openingHours: "Monday - Sunday: 10:00 AM - 9:00 PM"
  },
  supabase: {
    url: "", // USER_TODO: Insert Supabase project URL here
    anonKey: "" // USER_TODO: Insert Supabase Anon Key here
  },
  security: {
    encryptionKey: "" // USER_TODO: Insert a secure 32-character key for client-side AES encryption
  },
  books: [
    {
      id: "chelsea-boots-new",
      title: "Classic Suede Chelsea Boots",
      author: "Premium suede leather",
      category: "CHELSEA_BOOTS",
      description: "Slip-on smart-casual Chelsea boots with cushioned insoles and a durable grippy outsole for everyday wear.",
      coverImageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600",
      condition: "NEW",
      price: 3499,
      rentalPricePerDay: 199,
      isRentable: true,
      isForSale: true,
      stockQuantity: 8
    },
    {
      id: "chelsea-boots-refurbished",
      title: "Classic Suede Chelsea Boots",
      author: "Refurbished finish",
      category: "CHELSEA_BOOTS",
      description: "Professionally restored suede Chelsea boots that look clean, polished, and comfortable for daily use.",
      coverImageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600",
      condition: "REFURBISHED",
      price: 1499,
      rentalPricePerDay: 99,
      isRentable: true,
      isForSale: true,
      stockQuantity: 4
    },
    {
      id: "urban-sneakers-new",
      title: "Urban Retro White Sneakers",
      author: "Breathable mesh + comfort foam",
      category: "SNEAKERS",
      description: "Minimalist street-style sneakers with bright white finishing and long-wear cushioning for everyday use.",
      coverImageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
      condition: "NEW",
      price: 2499,
      rentalPricePerDay: 150,
      isRentable: true,
      isForSale: true,
      stockQuantity: 6
    },
    {
      id: "sport-runners-new",
      title: "Velocity Cushion Sport Shoes",
      author: "Responsive foam midsole",
      category: "SPORT_SHOES",
      description: "Sport runners designed for comfort, traction, and repeated movement on the go.",
      coverImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
      condition: "NEW",
      price: 2999,
      rentalPricePerDay: 175,
      isRentable: true,
      isForSale: true,
      stockQuantity: 7
    },
    {
      id: "riding-shoes-new",
      title: "Apex Reinforced Riding Shoes",
      author: "Heavy-duty ankle protection",
      category: "RIDING_SHOES",
      description: "Built for riders who need braking control, reinforced ankle support, and water-resistant finish.",
      coverImageUrl: "https://images.unsplash.com/photo-1509939603490-6c7d4285c6b6?auto=format&fit=crop&q=80&w=600",
      condition: "NEW",
      price: 4999,
      rentalPricePerDay: 250,
      isRentable: true,
      isForSale: true,
      stockQuantity: 5
    },
    {
      id: "formal-oxfords-new",
      title: "Premium Mahogany Leather Oxfords",
      author: "Whole-cut formal leather",
      category: "FORMAL_SHOES",
      description: "Classic Oxfords intended for weddings, interviews, and special events with a polished finish.",
      coverImageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600",
      condition: "NEW",
      price: 3999,
      rentalPricePerDay: 199,
      isRentable: true,
      isForSale: true,
      stockQuantity: 6
    },
    {
      id: "formal-oxfords-refurbished",
      title: "Premium Mahogany Leather Oxfords",
      author: "Restored leather shine",
      category: "FORMAL_SHOES",
      description: "Refurbished formal Oxfords that keep the premium look without the full new-pair cost.",
      coverImageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600",
      condition: "REFURBISHED",
      price: 1699,
      rentalPricePerDay: 120,
      isRentable: true,
      isForSale: true,
      stockQuantity: 3
    }
  ],
  offers: [
    {
      id: "festive-campaign",
      title: "Festival Footwear Offer",
      description: "Special pricing on sneakers and formal pairs for wedding season and festive shopping.",
      discountPercent: 12,
      validFrom: "2026-07-01",
      validTo: "2026-07-31",
      isActive: true,
      bannerImageUrl: ""
    }
  ],
  rental: {
    baseRatePerDay: 199,
    securityDeposit: 500,
    minDays: 1,
    maxDays: 14,
    discountTier3Days: 0.10,
    discountTier7Days: 0.20
  },
  wikiEntries: [
    {
      id: "wiki-1",
      title: "Choosing the Right Shoe Size",
      author: "My Shoes Hub team",
      synopsis: "A simple fit guide to check size, length, and sock thickness before purchase or rental.",
      seriesOrder: "Everyday fit guide",
      glossary: { terms: ["Heel grip", "Arch support", "Toe-box"] },
      category: "SNEAKERS"
    },
    {
      id: "wiki-2",
      title: "Chelsea Boot Care Basics",
      author: "Kritesh Yadav",
      synopsis: "Keep suede looking sharp with dry cleaning, proper storage, and a light brush after wear.",
      seriesOrder: "Styling and upkeep",
      glossary: { terms: ["Suede", "Sole grip", "Leather polish"] },
      category: "CHELSEA_BOOTS"
    },
    {
      id: "wiki-3",
      title: "Formal Shoe Rental Checklist",
      author: "Store team",
      synopsis: "What to confirm before renting Oxfords for weddings, interviews, or family events.",
      seriesOrder: "1-day to 14-day rentals",
      glossary: { terms: ["Deposit", "Fit check", "Condition report"] },
      category: "FORMAL_SHOES"
    }
  ],
  testimonials: [
    {
      name: "Rajesh Patel",
      role: "Daily Customer",
      location: "Bardoli",
      quote: "My Shoes Hub has been my family’s go-to shop for years. Kritesh bhai always knows exactly which fit will feel right.",
      rating: 5
    },
    {
      name: "Sneha Mehta",
      role: "Wedding Guest",
      location: "Vyara",
      quote: "I rented a pair of premium Oxfords for my brother’s wedding for 3 days and the shoes looked brand new.",
      rating: 5
    },
    {
      name: "Amit Solanki",
      role: "Enthusiastic Rider",
      location: "Surat",
      quote: "I bought refurbished riding shoes last month and they were restored so neatly that no one noticed they were used.",
      rating: 4
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
