"use client";

import Image from "next/image";
import { Button } from "./ui/Button";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Loader } from "./ui/Loader";

export default function Hero() {
  const ref = useRef(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const yCircle1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yCircle2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        // Fetch images tagged with 'Hero'
        const res = await fetch("/api/images?category=Hero");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setHeroImage(data[0].url);
        }
      } catch (error) {
        console.error("Failed to fetch hero image", error);
      } finally {
        // Add a small delay for the animation to be appreciated
        setTimeout(() => setIsLoading(false), 1500);
      }
    };
    fetchHeroImage();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      <AnimatePresence>{isLoading && <Loader key="loader" />}</AnimatePresence>

      {/* Decorative Background Motifs - Loader Mandala */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Mandala 1 - Top Left */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 text-[#C5A065] opacity-[0.15]"
        >
          <svg
            width="600"
            height="600"
            viewBox="0 0 100 100"
            fill="currentColor"
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
        </motion.div>

        {/* Mandala 2 - Bottom Right (Larger & Reverse Rotation) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-48 -right-48 text-[#C5A065] opacity-[0.12]"
        >
          <svg
            width="800"
            height="800"
            viewBox="0 0 100 100"
            fill="currentColor"
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
        </motion.div>
      </div>

      {/* Background Decorative Circles */}
      <motion.div
        style={{ y: yCircle1 }}
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C5A065]/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
      />
      <motion.div
        style={{ y: yCircle2 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#5D4037]/5 blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"
      />

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          style={{ y: yText }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 text-center md:text-left z-10"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#C5A065] tracking-widest uppercase text-sm font-semibold"
          >
            Traditional & Contemporary Art
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-[#5D4037] leading-tight">
            Adorning Hands, <br />
            <span className="italic font-light">Creating Memories</span>
          </h1>
          <p className="text-[#5D5D5D] text-lg md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed">
            Exquisite Mehndi designs for weddings, festivals, and special
            celebrations. Blending traditional intricacy with modern elegance.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
          >
            <Button>Book an Appointment</Button>
            <Button variant="outline">View Portfolio</Button>
          </motion.div>
        </motion.div>

        {/* Hero Image / Composition */}
        <motion.div
          style={{ y: yImage, scale: scaleImage }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-[500px] w-full hidden md:block"
        >
          {/* Hero Image Frame */}
          <div className="absolute inset-0 bg-[#E8E0D5] rounded-t-[150px] rounded-b-2xl overflow-hidden shadow-2xl border-4 border-white">
            {heroImage ? (
              <Image
                src={heroImage}
                alt="Hero Mehndi Design"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                <span className="text-lg italic">Hero Image Placeholder</span>
              </div>
            )}
          </div>

          {/* Decorative Floating Element */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl max-w-xs z-20 hidden lg:block"
          >
            <p className="font-heading text-xl text-[#5D4037] mb-2">
              "Beautiful artistry!"
            </p>
            <div className="flex text-[#C5A065]">★★★★★</div>
            <p className="text-sm text-[#5D5D5D] mt-2">- Priya Sharma, Bride</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
