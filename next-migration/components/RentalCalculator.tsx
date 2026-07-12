"use client";

import React, { useState, useEffect } from "react";
import { Calculator, MessageSquare } from "lucide-react";
import { Product } from "./ShoeCard";

interface RentalCalculatorProps {
  products: Product[];
  whatsappNumber: string;
  rentalConfig: {
    baseRatePerDay: number;
    securityDeposit: number;
    minDays: number;
    maxDays: number;
    discountTier3Days: number;
    discountTier7Days: number;
  };
}

export const RentalCalculator: React.FC<RentalCalculatorProps> = ({
  products,
  whatsappNumber,
  rentalConfig
}) => {
  const rentalEligible = products.filter((p) => p.rentalPricePerDay);
  
  // States
  const [selectedProductId, setSelectedProductId] = useState<string>(
    rentalEligible[0]?.id || ""
  );
  const [days, setDays] = useState<number>(3);
  const [rates, setRates] = useState({
    dailyRate: 199,
    rawTotal: 597,
    discountAmount: 60,
    discountPercent: 10,
    finalTotal: 1037
  });

  const selectedProduct = rentalEligible.find((p) => p.id === selectedProductId);
  const dailyRate = selectedProduct?.rentalPricePerDay || rentalConfig.baseRatePerDay;

  useEffect(() => {
    const rawTotal = dailyRate * days;
    let discountPercent = 0;

    if (days >= 7) {
      discountPercent = rentalConfig.discountTier7Days;
    } else if (days >= 3) {
      discountPercent = rentalConfig.discountTier3Days;
    }

    const discountAmount = Math.round(rawTotal * discountPercent);
    const finalTotal = (rawTotal - discountAmount) + rentalConfig.securityDeposit;

    setRates({
      dailyRate,
      rawTotal,
      discountAmount,
      discountPercent: discountPercent * 100,
      finalTotal
    });
  }, [selectedProductId, days, dailyRate, rentalConfig]);

  const handleEnquiry = () => {
    if (!selectedProduct) return;
    
    const msg = `Hello My Shoes Hub, I would like to book a rental for the "${selectedProduct.name}" for ${days} days starting from _________ (Specify Date). Total rental charges: ₹${rates.rawTotal - rates.discountAmount} + refundable security deposit: ₹${rentalConfig.securityDeposit}.`;
    
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  if (rentalEligible.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-2xl border border-[#ECE6DD] shadow-lg max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#7C2D12] to-[#D97706]"></div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-[#7C2D12]" />
        Instant Rental Calculator
      </h3>

      <div className="space-y-6">
        {/* Style Select */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            Select Shoe Style
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-[#7C2D12] font-medium"
          >
            {rentalEligible.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₹{p.rentalPricePerDay}/day)
              </option>
            ))}
          </select>
        </div>

        {/* Days Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              Number of Days
            </label>
            <span className="text-sm font-bold text-[#7C2D12]">
              {days} Day{days > 1 ? "s" : ""}
            </span>
          </div>
          <input
            type="range"
            min={rentalConfig.minDays}
            max={rentalConfig.maxDays}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7C2D12]"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-semibold px-1 pt-1.5">
            <span>{rentalConfig.minDays} Day</span>
            <span>7 Days (20% Off)</span>
            <span>{rentalConfig.maxDays} Days</span>
          </div>
        </div>

        {/* Math Breakdown */}
        <div className="p-4 bg-[#FDFBF7] rounded-lg border border-[#E7DFD3]/80 space-y-2.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              Rental Charge (₹{rates.dailyRate} x {days} days)
            </span>
            <span className="font-semibold text-gray-800">
              ₹{rates.rawTotal.toLocaleString("en-IN")}
            </span>
          </div>
          
          {rates.discountAmount > 0 && (
            <div className="flex justify-between text-green-700 font-medium">
              <span>Multi-day Discount ({rates.discountPercent}% Off)</span>
              <span>-₹{rates.discountAmount.toLocaleString("en-IN")}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-600">
            <span>Refundable Security Deposit</span>
            <span>₹{rentalConfig.securityDeposit}</span>
          </div>

          <div className="border-t border-[#E7DFD3] pt-3 mt-1 flex justify-between text-gray-900 font-bold text-base">
            <span>Total Payable Today</span>
            <span className="text-[#7C2D12]">
              ₹{rates.finalTotal.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="text-[10px] text-gray-400 italic text-center pt-2">
            *₹{rentalConfig.securityDeposit} deposit refunded immediately on return.
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleEnquiry}
          className="w-full py-4 bg-[#7C2D12] text-white font-bold rounded-lg hover:bg-orange-800 transition-all flex items-center justify-center shadow-md"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Enquire Rental on WhatsApp
        </button>
      </div>
    </div>
  );
};
