"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../components/ui/Button";
import { Trash2, Upload, LogOut, X, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";

// --- Helper for Image Cropping ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error: any) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/jpeg");
  });
}
// ---------------------------------

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Tabs State
  const [activeTab, setActiveTab] = useState<"hero" | "portfolio">("portfolio");
  const [portfolioCategory, setPortfolioCategory] = useState("Bridal");

  // Cropping State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [filename, setFilename] = useState("");

  const aspect = activeTab === "hero" ? 500 / 500 : 3 / 4; // Hero uses object-cover in 500px height, but let's stick to a manageable ratio or matching the visual container.
  // Actually, Hero container is H-500px, w-full. On desktop it's roughly square-ish or wide.
  // The frame user sees is: bg-[#E8E0D5] rounded-t-[150px] rounded-b-2xl.
  // Portfolio is aspect-[3/4].
  const cropAspect = activeTab === "hero" ? 1 : 3 / 4;

  // Fetch images on load
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    } else if (status === "authenticated") {
      fetchImages();
    }
  }, [status]);

  const fetchImages = async () => {
    const res = await fetch("/api/images");
    const data = await res.json();
    if (Array.isArray(data)) {
      setImages(data);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    setUploading(true);
    try {
      const croppedImageBlob = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );
      const file = new File([croppedImageBlob], filename, {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", file);

      // Determine tags based on active tab
      let tags = [];
      if (activeTab === "hero") {
        tags = ["Hero"];
      } else {
        tags = ["Portfolio", portfolioCategory];
      }

      formData.append("category", JSON.stringify(tags));

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        fetchImages(); // Refresh list
        setShowCropper(false);
        setImageToCrop(null);
        // Reset file input if possible (via state)
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch("/api/images", {
        method: "DELETE",
        body: JSON.stringify({ publicId }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchImages();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!session) return null;

  // Filter images based on active tab
  const filteredImages = images.filter((img) => {
    const tags = Array.isArray(img.tags) ? img.tags : [];
    if (activeTab === "hero") {
      return tags.includes("Hero");
    } else {
      // Portfolio: Exclude Hero, include specific category if filtered
      return !tags.includes("Hero") && tags.includes(portfolioCategory);
    }
  });

  return (
    <div className="min-h-screen bg-[#F9F7F2] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-[#5D4037]">
              Admin Dashboard
            </h1>
            <p className="text-[#5D5D5D]">Manage your website content</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-[#5D5D5D]">Welcome, Admin</span>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`pb-4 px-4 font-medium transition-colors relative ${
              activeTab === "portfolio"
                ? "text-[#5D4037]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Portfolio Gallery
            {activeTab === "portfolio" && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5D4037]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("hero")}
            className={`pb-4 px-4 font-medium transition-colors relative ${
              activeTab === "hero"
                ? "text-[#5D4037]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Hero Section
            {activeTab === "hero" && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5D4037]"
              />
            )}
          </button>
        </div>

        {/* Portfolio Sub-Tabs */}
        {activeTab === "portfolio" && (
          <div className="flex gap-2 mb-8">
            {["Bridal", "Guest", "Festival"].map((cat) => (
              <button
                key={cat}
                onClick={() => setPortfolioCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  portfolioCategory === cat
                    ? "bg-[#C5A065] text-white shadow-sm"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-[#EAEAEA]">
          <h2 className="text-xl font-bold text-[#5D4037] mb-4 flex items-center gap-2">
            <Upload size={20} />
            Upload to{" "}
            {activeTab === "hero"
              ? "Hero Section"
              : `${portfolioCategory} Collection`}
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full relative">
              <label className="block text-sm font-medium text-[#5D4037] mb-1">
                Select Image
              </label>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              />
            </div>
          </div>
          {activeTab === "hero" && (
            <p className="text-sm text-amber-600 mt-2">
              Note: The most recently uploaded image here will be displayed as
              the main Hero banner.
            </p>
          )}
        </div>

        {/* Cropping Modal */}
        <AnimatePresence>
          {showCropper && imageToCrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
              >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#F9F7F2]">
                  <h3 className="font-heading font-bold text-[#5D4037] flex items-center gap-2">
                    <Scissors size={18} />
                    Set Image Frame
                  </h3>
                  <button
                    onClick={() => setShowCropper(false)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="relative flex-1 min-h-[400px] bg-neutral-900">
                  <Cropper
                    image={imageToCrop}
                    crop={crop}
                    zoom={zoom}
                    aspect={cropAspect}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    // Custom styles to match the main site "Frame"
                    classes={{
                      containerClassName: "crop-container",
                      mediaClassName: "crop-media",
                      cropAreaClassName:
                        activeTab === "hero" ? "hero-frame" : "portfolio-frame",
                    }}
                  />

                  {/* Visual Overlay to show Rounding for Hero */}
                  {activeTab === "hero" && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div
                        className="border-2 border-dashed border-[#C5A065]/60 flex flex-col items-center justify-center"
                        style={{
                          width: "min(400px, 80%)",
                          aspectRatio: "1",
                          borderRadius: "150px 150px 16px 16px",
                          boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)",
                          background: "rgba(197, 160, 101, 0.05)",
                        }}
                      >
                        <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold absolute top-12">
                          Hero Section Frame
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "portfolio" && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div
                        className="border-2 border-dashed border-[#C5A065]/60 flex flex-col items-center justify-center"
                        style={{
                          width: "min(300px, 60%)",
                          aspectRatio: "3/4",
                          borderRadius: "12px",
                          boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)",
                          background: "rgba(197, 160, 101, 0.05)",
                        }}
                      >
                        <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold absolute top-4">
                          Portfolio Frame
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-[#F9F7F2] border-t border-gray-100">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-[#5D4037] mb-2">
                        Zoom
                      </label>
                      <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C5A065]"
                      />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => setShowCropper(false)}
                        className="flex-1 md:flex-none"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex-1 md:flex-none"
                      >
                        {uploading ? "Uploading..." : "Save & Upload"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    {activeTab === "hero"
                      ? "The frame matches the Hero section's unique rounded shape."
                      : "The frame matches the Portfolio's 3:4 vertical aspect ratio."}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative group rounded-lg overflow-hidden shadow-sm bg-white border border-gray-100"
            >
              <div className="aspect-square relative">
                <Image
                  src={img.url}
                  alt="Portfolio"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 flex justify-between items-center bg-white">
                <span className="text-xs text-gray-400 truncate w-32">
                  {new Date(img.created_at || Date.now()).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {filteredImages.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
              No images found in{" "}
              {activeTab === "hero" ? "Hero Section" : portfolioCategory}.{" "}
              <br /> Upload one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
