"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Loader2 } from "lucide-react";

// Form validation schema using Zod
const contactFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain alphabets and spaces." }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." }),
  interest: z
    .string({ required_error: "Please select a product category of interest." })
    .min(1, { message: "Please select an interest category." }),
  message: z
    .string()
    .min(10, { message: "Please enter at least 10 characters detailing size or requests." })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      interest: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess(result.message || `Thank you ${data.name}! Enquiry submitted successfully.`);
        reset();
      } else {
        onError(result.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      onError("Connection error. Please try calling us directly or chat on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Your Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            {...register("name")}
            className={`w-full p-3.5 bg-[#120E0D]/60 border rounded-lg text-sm focus:outline-none text-white placeholder-gray-500 transition-all ${
              errors.name ? "border-red-500 focus:border-red-500" : "border-white/15 focus:border-amber-500"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="10-digit mobile number"
            {...register("phone")}
            className={`w-full p-3.5 bg-[#120E0D]/60 border rounded-lg text-sm focus:outline-none text-white placeholder-gray-500 transition-all ${
              errors.phone ? "border-red-500 focus:border-red-500" : "border-white/15 focus:border-amber-500"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>
          )}
        </div>

      </div>

      {/* Interest Dropdown */}
      <div>
        <label htmlFor="interest" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          What are you interested in?
        </label>
        <select
          id="interest"
          {...register("interest")}
          className={`w-full p-3.5 bg-[#120E0D]/60 border rounded-lg text-sm focus:outline-none text-white font-medium transition-all ${
            errors.interest ? "border-red-500 focus:border-red-500" : "border-white/15 focus:border-amber-500"
          }`}
        >
          <option value="" disabled>Select an option...</option>
          <option value="Chelsea Boots">Chelsea Boots (Buy / Refurbish)</option>
          <option value="Sneakers">Sneakers (Buy / Refurbish)</option>
          <option value="Sport Shoes">Sport Shoes</option>
          <option value="Riding Shoes">Riding Shoes</option>
          <option value="Formal Shoes - Buy">Formal Shoes (Buy New)</option>
          <option value="Formal Shoes - Rental">Formal Shoes (Daily Rental)</option>
          <option value="Refurbishment service">Refurbish my own shoes</option>
          <option value="Other enquiry">General Enquiry</option>
        </select>
        {errors.interest && (
          <p className="text-red-500 text-xs mt-1.5">{errors.interest.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Your Message *
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Specify shoe size, rental dates, or other questions..."
          {...register("message")}
          className={`w-full p-3.5 bg-[#120E0D]/60 border rounded-lg text-sm focus:outline-none text-white placeholder-gray-500 transition-all ${
            errors.message ? "border-red-500 focus:border-red-500" : "border-white/15 focus:border-amber-500"
          }`}
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1.5">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-500 transition-all flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Enquiry
          </>
        )}
      </button>
    </form>
  );
};
