"use client";

import { motion } from "framer-motion";

export function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F9F7F2]"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Mandala Pattern SVG */}
        <div className="animate-spin-slow w-48 h-48 md:w-64 md:h-64 text-[#5D4037] opacity-80">
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Ring */}
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M50 2 A48 48 0 0 1 98 50 A48 48 0 0 1 50 98 A48 48 0 0 1 2 50 A48 48 0 0 1 50 2 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 2"
            />

            {/* Petals Layer 1 */}
            <g>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <path
                  key={i}
                  d="M50 50 Q60 20 50 10 Q40 20 50 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  transform={`rotate(${deg} 50 50)`}
                />
              ))}
            </g>

            {/* Inner Details */}
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="8"
              fill="currentColor"
              className="opacity-30"
            />

            {/* Decorative Dots */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
              (deg, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="22"
                  r="1.5"
                  fill="currentColor"
                  transform={`rotate(${deg} 50 50)`}
                />
              )
            )}
          </svg>
        </div>

        {/* Brand Name Loading Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute mt-[20vh] text-[#5D4037]"
        >
          <span className="font-heading text-2xl tracking-widest uppercase">
            Crafting...
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
