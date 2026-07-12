"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, MessageCircle, Menu, X, Award, Users, Star, 
  MapPin, Clock, ExternalLink, Mail, PhoneCall, Send,
  RotateCcw, CalendarRange, Sparkles, Store
} from "lucide-react";
import Image from "next/image";
import { ShoeCard, Product } from "../components/ShoeCard";
import { RentalCalculator } from "../components/RentalCalculator";
import { ContactForm } from "../components/ContactForm";

// Business details locally declared (mirroring js/config.js)
const BUSINESS_CONFIG = {
  name: "My Shoes Hub",
  owner: "Kritesh Yadav",
  established: 2005,
  dailyCustomers: 45,
  location: "Bardoli, Gujarat, India",
  fullAddress: "Opp. Sardar Vallabhbhai Patel Statue, Station Road, Bardoli, Gujarat 394601",
  phoneDisplay: "+91 12345 67892",
  phoneNumber: "1234567892",
  whatsappNumber: "911234567892",
  openingHours: "Monday - Sunday: 10:00 AM - 9:00 PM"
};

const PRODUCTS_DATA: Product[] = [
  {
    id: "chelsea-boots",
    name: "Classic Suede Chelsea Boots",
    category: "Chelsea Boots",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600",
    description: "Premium handcrafted suede leather Chelsea boots with elastic side panels and durable crepe soles. Perfect for smart-casual wear.",
    priceNew: 3499,
    priceRefurbished: 1499,
    isBestSeller: true,
    features: ["Genuine Suede Leather", "Comfort Cushion Insoles", "Hand-stitched Detailing", "Slip-resistant Rubber Sole"]
  },
  {
    id: "street-sneakers",
    name: "Urban Retro White Sneakers",
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
    description: "Minimalist street-style sneakers constructed with premium action leather and breathable mesh lining. Excellent everyday comfort.",
    priceNew: 2499,
    priceRefurbished: 999,
    isBestSeller: false,
    features: ["Breathable Core", "Vulcanized Rubber Sole", "Arch-support Cushioning", "Easy-clean Surface"]
  },
  {
    id: "sport-runners",
    name: "Velocity Cushion Sport Shoes",
    category: "Sport Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    description: "Engineered for fitness and performance. Features responsive foam midsoles and lightweight mesh for maximum breathability.",
    priceNew: 2999,
    priceRefurbished: 1299,
    isBestSeller: true,
    features: ["Ultra-lightweight", "Shock-absorption Sole", "Sweat-wicking Mesh", "High-grip Tread"]
  },
  {
    id: "moto-riding",
    name: "Apex Reinforced Riding Shoes",
    category: "Riding Shoes",
    image: "https://images.unsplash.com/photo-1509939603490-6c7d4285c6b6?auto=format&fit=crop&q=80&w=600",
    description: "Specifically designed for motorcyclists. Heavy-duty construction with reinforced ankle pads, gear-shifter guards, and night reflectors.",
    priceNew: 4999,
    priceRefurbished: 2199,
    isBestSeller: false,
    features: ["Ankle & Toe Armor", "Water-resistant Finish", "Reflective safety tabs", "Shift-pad protection overlay"]
  },
  {
    id: "formal-oxfords",
    name: "Premium Mahogany Leather Oxfords",
    category: "Formal Shoes",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600",
    description: "Exquisite whole-cut leather oxford formal shoes. Ideal for business meetings, weddings, and formal ceremonies. Available for rent.",
    priceNew: 3999,
    priceRefurbished: 1699,
    rentalPricePerDay: 199,
    isBestSeller: true,
    features: ["Full-grain Italian Leather", "Ortholite Orthopedic Insoles", "Gentleman's Corner Heel Cut", "High-shine Premium Polish"]
  }
];

const RENTAL_CONFIG = {
  baseRatePerDay: 199,
  securityDeposit: 500,
  minDays: 1,
  maxDays: 14,
  discountTier3Days: 0.10,
  discountTier7Days: 0.20
};

const TESTIMONIALS = [
  {
    name: "Rajesh Patel",
    role: "Daily Customer",
    location: "Bardoli, Gujarat",
    quote: "My Shoes Hub has been my family's go-to shoe shop for over 15 years. Kritesh bhai always knows exactly what size and fit we need. Highly trusted!",
    rating: 5
  },
  {
    name: "Sneha Mehta",
    role: "Wedding Guest (Rental)",
    location: "Vyara, Gujarat",
    quote: "I rented a pair of premium Oxfords for my brother's wedding for 3 days. The process was super easy, and the shoes looked brand new. Saved me 3,000 Rupees!",
    rating: 5
  },
  {
    name: "Amit Solanki",
    role: "Enthusiastic Rider",
    location: "Surat, Gujarat",
    quote: "Bought refurbished riding shoes from here last month. They were restored so well that no one could tell they were used. Excellent quality at half the price.",
    rating: 5
  }
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [formPreFill, setFormPreFill] = useState({ category: "", productName: "" });
  
  // Custom alerts state
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  const handleCustomEnquiry = (category: string, productName: string) => {
    setFormPreFill({ category, productName });
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  const getWhatsAppUrl = (text: string) => {
    return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const filteredProducts = activeCategory === "all"
    ? PRODUCTS_DATA
    : PRODUCTS_DATA.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen relative">
      
      {/* Dynamic Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-xl border flex items-start space-x-3 max-w-sm ${
              toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="text-xs font-semibold leading-relaxed">{toast.msg}</div>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setToast(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. NAVBAR */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-md py-3" : "bg-[#FDFBF7]/85 backdrop-blur-md py-5 border-b border-[#E7DFD3]/50"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a href="#" className="text-2xl font-extrabold text-[#7C2D12]">
            My Shoes<span className="text-[#D97706] font-semibold">Hub</span>
          </a>

          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <a href="#home" className="hover:text-[#7C2D12] transition-colors">Home</a>
            <a href="#products" className="hover:text-[#7C2D12] transition-colors">Products</a>
            <a href="#usps" className="hover:text-[#7C2D12] transition-colors">Refurbished</a>
            <a href="#rental" className="hover:text-[#7C2D12] transition-colors">Rental</a>
            <a href="#about" className="hover:text-[#7C2D12] transition-colors">About</a>
            <a href="#contact" className="hover:text-[#7C2D12] transition-colors">Contact</a>
          </nav>

          <div className="hidden sm:flex items-center space-x-4">
            <a
              href={getWhatsAppUrl("Hello My Shoes Hub, I would like to make an enquiry.")}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href={`tel:+91${BUSINESS_CONFIG.phoneNumber}`} className="inline-flex items-center px-4 py-2.5 bg-[#7C2D12] text-white text-sm font-semibold rounded-lg hover:bg-orange-850 transition-all">
              <Phone className="w-4 h-4 mr-2" />
              Call: {BUSINESS_CONFIG.phoneDisplay}
            </a>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-700 hover:text-[#7C2D12]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FDFBF7] border-b border-[#E7DFD3] px-4 py-4 space-y-2">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-150 text-gray-700 font-semibold">Home</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-150 text-gray-700 font-semibold">Products</a>
            <a href="#usps" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-150 text-gray-700 font-semibold">Refurbished</a>
            <a href="#rental" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-150 text-gray-700 font-semibold">Rental</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-150 text-gray-700 font-semibold">About</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-gray-150 text-gray-700 font-semibold">Contact</a>
            
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
              <a
                href={getWhatsAppUrl("Hello, I would like to enquire.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg text-center flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Us
              </a>
              <a href={`tel:+91${BUSINESS_CONFIG.phoneNumber}`} className="w-full py-3 bg-[#7C2D12] text-white font-bold rounded-lg text-center flex items-center justify-center">
                <Phone className="w-4 h-4 mr-2" /> Call Now
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO */}
      <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-[#FDFBF7] to-[#F4EFE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#7C2D12]/10 text-[#7C2D12] border border-[#7C2D12]/20">
              <Award className="w-3.5 h-3.5 mr-1.5" />
              Trusted in Bardoli since 2005 (20+ Years)
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Gujarat's Premium Shoe Hub <span className="text-[#7C2D12] block">Under One Roof</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Explore Bardoli's widest collection of Chelsea boots, sneakers, riding shoes, sport runners, and formal wear. Serving <span className="font-bold text-[#7C2D12]">45+ daily recurring customers</span>.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <a href={`tel:+91${BUSINESS_CONFIG.phoneNumber}`} className="flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#7C2D12] text-white font-bold rounded-lg hover:bg-orange-850 transition-all shadow-lg">
                <PhoneCall className="w-5 h-5 mr-2" /> Call Now
              </a>
              <a
                href={getWhatsAppUrl("Hello My Shoes Hub...")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-green-700 font-bold rounded-lg hover:bg-green-50 transition-all shadow-sm"
              >
                <MessageCircle className="w-5 h-5 mr-2 text-green-600" /> Chat on WhatsApp
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-[#7C2D12]/10 to-[#D97706]/10 rounded-2xl p-4 flex items-center justify-center">
              <Image 
                src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800" 
                alt="Chelsea Boots" 
                width={400} 
                height={400} 
                className="object-contain filter drop-shadow-xl"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-[#E7DFD3] shadow-md flex items-center space-x-3">
                <div className="p-2 bg-[#D97706]/20 text-[#D97706] rounded-full">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Daily Customers</p>
                  <p className="text-base font-bold text-gray-900">45+ Happy Visitors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST STRIP */}
      <section className="bg-[#7C2D12] text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#D97706]">20+</div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-200">Years in Business</p>
            <p className="text-[10px] text-white/70">Established 2005</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#D97706]">45+</div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-200">Daily Customers</p>
            <p className="text-[10px] text-white/70">Loyal Gujarat Base</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#D97706]">5</div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-200">Categories</p>
            <p className="text-[10px] text-white/70">All Sizes & Fits</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#D97706]">♻️ 100%</div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-200">Quality Certified</p>
            <p className="text-[10px] text-white/70">Refurbished & New</p>
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS */}
      <section id="products" className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#7C2D12]">Our Collection</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">Explore Five Premium Categories</p>
            <div className="w-16 h-1 bg-[#D97706] mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {["all", "Chelsea Boots", "Sneakers", "Sport Shoes", "Riding Shoes", "Formal Shoes"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat 
                    ? "bg-[#7C2D12] text-white border-[#7C2D12]" 
                    : "bg-white text-gray-700 border-[#ECE6DD] hover:border-[#7C2D12]"
                }`}
              >
                {cat === "all" ? "Show All" : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ShoeCard
                key={product.id}
                product={product}
                whatsappNumber={BUSINESS_CONFIG.whatsappNumber}
                onCustomEnquiry={handleCustomEnquiry}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 5. USPs */}
      <section id="usps" className="py-20 bg-[#120E0D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D97706]">Why Us</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">What Makes Us Different</p>
          <div className="w-16 h-1 bg-[#D97706] mx-auto rounded-full mt-4"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* USP 1 */}
          <div className="bg-[#1E1614] border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#D97706]/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#D97706]/20 text-[#D97706] flex items-center justify-center mb-6">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Buy-Back &amp; Refurbished</h3>
              <p className="text-sm text-gray-400">Trade in old footwear. We professionally clean and refurbish shoes to make styling affordable.</p>
            </div>
            <span className="text-xs text-[#D97706] font-bold mt-6">♻️ ECO VALUE</span>
          </div>
          {/* USP 2 */}
          <div className="bg-[#1E1614] border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#D97706]/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#D97706]/20 text-[#D97706] flex items-center justify-center mb-6">
                <CalendarRange className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Formal Shoe Rental</h3>
              <p className="text-sm text-gray-400">Rent premium Mahogany leather oxfords for interviews and weddings. Starts at just ₹199 per day.</p>
            </div>
            <span className="text-xs text-[#D97706] font-bold mt-6">👞 BUDGET SAVER</span>
          </div>
          {/* USP 3 */}
          <div className="bg-[#1E1614] border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#D97706]/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#D97706]/20 text-[#D97706] flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Festive Discounts</h3>
              <p className="text-sm text-gray-400">Diwali, Navratri and Eid wedding package discounts for families and bulk enquiries.</p>
            </div>
            <span className="text-xs text-[#D97706] font-bold mt-6">🎉 SEASONAL DEALS</span>
          </div>
          {/* USP 4 */}
          <div className="bg-[#1E1614] border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#D97706]/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#D97706]/20 text-[#D97706] flex items-center justify-center mb-6">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Large Collection</h3>
              <p className="text-sm text-gray-400">Five distinct categories (including riding boots) for all shoe sizes under one single roof.</p>
            </div>
            <span className="text-xs text-[#D97706] font-bold mt-6">🗄️ TOTAL VAULT</span>
          </div>
        </div>
      </section>

      {/* 6. RENTAL CALCULATOR */}
      <section id="rental" className="py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900">Oxfords for the Day. Savings for the Future.</h2>
            <p className="text-gray-600">Why spend thousands on a pair you'll only wear once? Follow our simple size check, book for the required days, and pay only for usage.</p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-7 h-7 rounded-full bg-[#7C2D12] text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-bold">Select and Try Sizes</h4>
                  <p className="text-xs text-gray-500">Visit our Bardoli store to check and lock in your correct shoe sizes.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-7 h-7 rounded-full bg-[#7C2D12] text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-bold">Pay Security Deposit</h4>
                  <p className="text-xs text-gray-500">₹500 refundable security deposit along with daily rates payable at checkout.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-7 h-7 rounded-full bg-[#7C2D12] text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h4 className="font-bold">Instant Deposit Return</h4>
                  <p className="text-xs text-gray-500">Get your ₹500 back in cash or UPI immediately upon returning the shoe pair.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <RentalCalculator
              products={PRODUCTS_DATA}
              whatsappNumber={BUSINESS_CONFIG.whatsappNumber}
              rentalConfig={RENTAL_CONFIG}
            />
          </div>
        </div>
      </section>

      {/* 7. ABOUT */}
      <section id="about" className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-80 h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-[#ECE6DD]">
              <Image 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600" 
                alt="Store legacy" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900">Serving Gujarat Families Since 2005</h2>
            <p className="text-gray-600 leading-relaxed">
              My Shoes Hub was founded by <strong>Kritesh Yadav</strong> in Bardoli. Over 20 years, we have prioritized custom service and quality footwear, building a daily loyal base of 45+ recurring customers. Whether you seek robust riding shoes or a wedding oxfords rental, we treat every client like family.
            </p>
            <div className="pt-2 flex space-x-6 text-sm">
              <div>
                <p className="font-bold">Kritesh Yadav</p>
                <p className="text-xs text-gray-500">Proprietor & Founder</p>
              </div>
              <div>
                <p className="font-bold text-[#7C2D12]">Bardoli, Gujarat</p>
                <p className="text-xs text-gray-500">Main Location</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#7C2D12]">Reviews</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">What Our Customers Say</p>
          <div className="w-16 h-1 bg-[#D97706] mx-auto rounded-full mt-4"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-white border border-[#ECE6DD] rounded-xl p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex space-x-0.5 text-amber-500">
                  {Array(t.rating).fill("").map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-sm text-gray-600 italic">"{t.quote}"</p>
              </div>
              <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-[#7C2D12]/10 text-[#7C2D12] font-bold flex items-center justify-center text-xs">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{t.name}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold">{t.role} &bull; {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. LOCATION MAP */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Visit Our Store</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#7C2D12] shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900">Store Address</h4>
                  <p>{BUSINESS_CONFIG.fullAddress}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#7C2D12] shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900">Hours</h4>
                  <p>{BUSINESS_CONFIG.openingHours}</p>
                </div>
              </div>
            </div>
            <a href="https://maps.google.com/?q=Station+Road,+Bardoli,+Gujarat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold text-[#7C2D12] hover:underline">
              Open in Google Maps <ExternalLink className="w-4 h-4 ml-1.5" />
            </a>
          </div>

          <div className="lg:col-span-7 h-80 rounded-2xl overflow-hidden border border-[#ECE6DD]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.2592534571933!2d73.11181181540306!3d21.10223698595568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be060b933a2bdab%3A0xe543eb72c05001ad!2sStation%20Rd%2C%20Bardoli%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1657194601000!5m2!1sen!2sin" 
              className="w-full h-full border-0" 
              allowFullScreen
              loading="lazy" 
              title="Google Maps location of My Shoes Hub"
            />
          </div>
        </div>
      </section>

      {/* 10. CONTACT FORM */}
      <section id="contact" className="py-20 bg-[#120E0D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-extrabold">Send Us an Enquiry</h2>
            <p className="text-gray-400">Have specific questions on shoe sizes or want to check rental bookings? Drop us an enquiry here or chat directly via phone.</p>
            
            <div className="space-y-4 pt-4">
              <a href={`tel:+91${BUSINESS_CONFIG.phoneNumber}`} className="flex items-center p-4 bg-[#1E1614] border border-white/10 rounded-xl group hover:border-[#D97706]/40 transition-all">
                <PhoneCall className="w-5 h-5 text-[#D97706]" />
                <div className="ml-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Call Directly</p>
                  <p className="text-sm font-bold mt-0.5">{BUSINESS_CONFIG.phoneDisplay}</p>
                </div>
              </a>
              <a href={getWhatsAppUrl("Hello, I am interested in enquiries...")} className="flex items-center p-4 bg-[#1E1614] border border-white/10 rounded-xl group hover:border-[#D97706]/40 transition-all">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div className="ml-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase">WhatsApp Message</p>
                  <p className="text-sm font-bold mt-0.5">Start Instant Chat</p>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#1E1614] border border-white/10 p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-6">Enquiry Form</h3>
            <ContactForm 
              onSuccess={(msg) => triggerToast("success", msg)} 
              onError={(msg) => triggerToast("error", msg)} 
            />
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-[#120E0D] text-gray-400 border-t border-white/5 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/5">
          <div className="space-y-4">
            <span className="text-xl font-extrabold text-white">My Shoes Hub</span>
            <p className="text-xs text-gray-400">Serving Gujarat since 2005 with premium footwear options, daily rentals, and certified refurbishments.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Collection</a></li>
              <li><a href="#rental" className="hover:text-white transition-colors">Rental Calculator</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Story</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Contact Info</h4>
            <p className="text-xs leading-relaxed">{BUSINESS_CONFIG.fullAddress}</p>
            <p className="text-xs mt-2">Phone: {BUSINESS_CONFIG.phoneDisplay}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} My Shoes Hub. All rights reserved.</p>
          <p>Local Bardoli Retailer</p>
        </div>
      </footer>

    </div>
  );
}
