"use client";

import { Check } from "lucide-react";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";

const packages = [
  {
    name: "Guest Mehndi",
    price: "Starting from ₹500",
    description: "Beautiful designs for guests and relatives.",
    features: [
      "Simple Strip/Arabic Designs",
      "Choose from Catalog",
      "Per Hand Pricing",
      "Group Discounts Available",
    ],
    highlight: false,
  },
  {
    name: "Bridal Basic",
    price: "₹5,000",
    description: "Elegant bridal designs for hands and feet.",
    features: [
      "Elbow Length Hands",
      "Ankle Length Feet",
      "Traditional/Indian Style",
      "Intricate Detailing",
    ],
    highlight: true,
  },
  {
    name: "Bridal Premium",
    price: "₹11,000",
    description: "Royal bridal packages with figures and portraits.",
    features: [
      "Full Arms & Legs",
      "Raja-Rani Figures",
      "Portrait Design Included",
      "Custom Love Story Elements",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-[#F9F7F2]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#C5A065] tracking-widest uppercase text-sm font-semibold">
            Packages
          </span>
          <h2 className="text-4xl font-heading font-bold text-[#5D4037] mt-2">
            Pricing
          </h2>
          <div className="w-24 h-1 bg-[#C5A065] mx-auto mt-4 rounded-full" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border ${
                pkg.highlight ? "border-[#C5A065] z-10" : "border-[#EAEAEA]"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C5A065] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-heading font-bold text-[#5D4037] mb-2">
                {pkg.name}
              </h3>
              <p className="text-[#5D5D5D] text-sm mb-6">{pkg.description}</p>
              <div className="text-3xl font-bold text-[#2D2D2D] mb-8">
                {pkg.price}
              </div>

              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-[#5D5D5D]"
                  >
                    <Check size={18} className="text-[#C5A065] mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.highlight ? "primary" : "outline"}
                className="w-full"
              >
                Book Now
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
