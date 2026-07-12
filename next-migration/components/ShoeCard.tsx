"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, RotateCcw, Check, Mail } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  priceNew: number;
  priceRefurbished: number;
  rentalPricePerDay?: number;
  isBestSeller: boolean;
  features: string[];
}

interface ShoeCardProps {
  product: Product;
  whatsappNumber: string;
  onCustomEnquiry: (category: string, productName: string) => void;
}

export const ShoeCard: React.FC<ShoeCardProps> = ({ product, whatsappNumber, onCustomEnquiry }) => {
  
  const getWhatsAppUrl = (text: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const newWaMsg = `Hello My Shoes Hub, I would like to check availability for a NEW pair of "${product.name}" in size ______ (Specify size).`;
  const refurbWaMsg = `Hello My Shoes Hub, I am interested in a REFURBISHED pair of "${product.name}" in size ______ (Specify size).`;

  return (
    <div className="bg-white border border-[#ECE6DD] rounded-xl overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group">
      
      {/* Product Image */}
      <div className="relative h-60 w-full overflow-hidden bg-gray-100">
        {product.isBestSeller && (
          <span className="absolute top-4 left-4 bg-amber-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm z-10">
            Best Seller
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={product.isBestSeller}
        />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-orange-900 tracking-widest">{product.category}</span>
            <span className="text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
              100% Quality
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{product.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
        </div>

        {/* Features Checklist */}
        <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1 border-t border-[#E7DFD3]">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-xs text-gray-500">
              <Check className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
              <span className="truncate">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Price Blocks */}
        <div className="space-y-3 pt-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Brand New</p>
              <p className="text-lg font-black text-gray-900">₹{product.priceNew.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Refurbished</p>
              <p className="text-lg font-black text-green-700">₹{product.priceRefurbished.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Rental Highlight */}
          {product.rentalPricePerDay && (
            <div className="bg-[#7C2D12]/5 border border-[#7C2D12]/10 rounded-lg p-2 text-center text-xs font-semibold text-[#7C2D12]">
              Rental Available: ₹{product.rentalPricePerDay}/Day
            </div>
          )}

          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <a
              href={getWhatsAppUrl(newWaMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 bg-[#7C2D12] text-white font-bold rounded-lg text-center hover:bg-orange-800 transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              Buy New
            </a>
            <a
              href={getWhatsAppUrl(refurbWaMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 bg-green-100 text-green-800 border border-green-200 font-bold rounded-lg text-center hover:bg-green-200 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-green-700" />
              Buy Refurbished
            </a>
          </div>

          <button
            onClick={() => onCustomEnquiry(product.category, product.name)}
            className="w-full py-2 bg-gray-50 text-gray-600 border border-gray-200 text-center font-semibold rounded-lg text-[11px] hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center"
          >
            <Mail className="w-3 h-3 mr-1" />
            Send Custom Enquiry
          </button>
        </div>

      </div>
    </div>
  );
};
