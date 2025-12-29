"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Fallback data
const initialPlaceholderItems = [
  {
    id: "1",
    title: "Bridal Intricate",
    category: "Bridal",
    color: "bg-[#8D6E63]",
    tags: [],
  },
  {
    id: "2",
    title: "Modern Minimalist",
    category: "Guest",
    color: "bg-[#C5A065]",
    tags: [],
  },
  {
    id: "3",
    title: "Traditional Feet",
    category: "Bridal",
    color: "bg-[#5D4037]",
    tags: [],
  },
  {
    id: "4",
    title: "Floral Elegance",
    category: "Festival",
    color: "bg-[#A1887F]",
    tags: [],
  },
  {
    id: "5",
    title: "Geometric Back Hand",
    category: "Guest",
    color: "bg-[#D7CCC8]",
    tags: [],
  },
  {
    id: "6",
    title: "Full Arm Heavy",
    category: "Bridal",
    color: "bg-[#795548]",
    tags: [],
  },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");
  const [items, setItems] = useState<any[]>(initialPlaceholderItems);
  const [isDynamic, setIsDynamic] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const categories = ["All", "Bridal", "Guest", "Festival"];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/images");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Map API data to component structure
          const dynamicItems = data
            .map((img: any) => {
              // Determine category from tags (excluding 'Portfolio' and 'Hero')
              const tags = Array.isArray(img.tags) ? img.tags : [];
              // Default to 'Bridal' if no specific category tag found, but try to find one
              const categoryTag =
                tags.find((t: string) => categories.includes(t)) || "Unique"; // Fallback

              return {
                id: img.id,
                title: "Mehndi Design",
                category: categoryTag,
                url: img.url,
                color: "bg-gray-200",
                tags: tags,
              };
            })
            .filter(
              (item: any) =>
                !item.tags.some((t: string) => t.toLowerCase() === "hero")
            ); // Filter out Hero images (case-insensitive)

          setItems(dynamicItems);
          setIsDynamic(true);
        }
      } catch (error) {
        console.error("Failed to fetch gallery images", error);
      }
    };
    fetchImages();
  }, []);

  const filteredItems =
    activeTab === "All"
      ? items
      : items.filter((item) => item.category === activeTab);

  const visibleItems = filteredItems.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
  };

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#C5A065] tracking-widest uppercase text-sm font-semibold">
            Our Masterpieces
          </span>
          <h2 className="text-4xl font-heading font-bold text-[#5D4037] mt-2">
            Portfolio
          </h2>
          <div className="w-24 h-1 bg-[#C5A065] mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveTab(category);
                setVisibleCount(6);
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === category
                  ? "bg-[#5D4037] text-white shadow-md"
                  : "bg-[#F9F7F2] text-[#5D5D5D] hover:bg-[#EFEBE9]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.length > 0 ? (
            filteredItems.slice(0, visibleCount).map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`aspect-[3/4] relative overflow-hidden ${item.color}`}
                >
                  {/* Image Placeholder */}
                  {isDynamic && item.url ? (
                    <Image
                      src={item.url}
                      alt={item.title || "Portfolio Image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 text-4xl">
                      ✨
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-medium tracking-wide uppercase border border-white/50 px-6 py-2 rounded-full backdrop-blur-sm">
                      View Detail
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold tracking-wider text-[#C5A065] uppercase">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl text-[#5D4037]">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))
          ) : (
            /* Empty State / Coming Soon */
            <div className="col-span-full py-20 text-center">
              <div className="inline-block p-6 rounded-full bg-[#EAEAEA]/50 text-[#5D4037] mb-4">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-2xl font-heading text-[#5D4037] mb-2">
                Coming Soon...
              </h3>
              <p className="text-[#5D5D5D]">
                We are currently curating the best {activeTab} designs for you.{" "}
                <br />
                Please check back shortly!
              </p>
            </div>
          )}
        </motion.div>

        {/* Show More / Less Buttons */}
        <div className="flex justify-center gap-4">
          {isDynamic && visibleCount < filteredItems.length && (
            <button
              onClick={handleShowMore}
              className="px-8 py-3 bg-[#5D4037] text-white font-medium rounded-full hover:bg-[#4E342E] transition-colors shadow-md"
            >
              Show More
            </button>
          )}
          {isDynamic && visibleCount > 6 && (
            <button
              onClick={handleShowLess}
              className="px-8 py-3 bg-white text-[#5D4037] border border-[#5D4037] font-medium rounded-full hover:bg-[#F9F7F2] transition-colors shadow-md"
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
