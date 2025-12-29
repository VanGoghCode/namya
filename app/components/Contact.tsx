"use client";

import {
  Mail,
  Phone,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/Button";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
        // Reset success message after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Failed to send message.");
    }
  };

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#5D4037]/5 rounded-br-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#C5A065]/10 rounded-tl-full pointer-events-none" />

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Contact Info */}
        <div className="space-y-8 animate-fade-in">
          <div>
            <span className="text-[#C5A065] tracking-widest uppercase text-sm font-semibold">
              Get in Touch
            </span>
            <h2 className="text-4xl font-heading font-bold text-[#5D4037] mt-2">
              Book Your Date
            </h2>
            <div className="w-24 h-1 bg-[#C5A065] mt-4 rounded-full" />
          </div>

          <p className="text-[#5D5D5D] text-lg leading-relaxed">
            We'd love to be a part of your special day. Please feel free to
            reach out for bookings, custom bridal packages, or any other
            inquiries.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:vrunda7103@gmail.com"
              className="flex items-center space-x-4 text-[#2D2D2D] hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#5D4037]">
                <Mail size={20} />
              </div>
              <span className="font-medium">vrunda7103@gmail.com</span>
            </a>

            <a
              href="https://www.instagram.com/vrunda_mehandi__"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 hover:opacity-80 transition-opacity"
            >
              <div className="bg-[#C5A065]/10 p-3 rounded-full text-[#C5A065]">
                <Instagram size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#5D4037] mb-1">Follow Work</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  See latest designs on Instagram
                </p>
                <span className="font-medium">@vrunda_mehandi__</span>
              </div>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#F9F7F2] p-8 rounded-2xl shadow-sm border border-[#EAEAEA] animate-fade-in delay-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-[#5D4037]"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A065]/50 bg-white transition-all"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-[#5D4037]"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A065]/50 bg-white transition-all"
                  placeholder="Your Number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[#5D4037]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A065]/50 bg-white transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-[#5D4037]"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A065]/50 bg-white transition-all"
                placeholder="Tell us about your event..."
              ></textarea>
            </div>

            {status === "success" && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">
                  Message sent successfully!
                </span>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2"
            >
              {status === "sending" ? (
                "Sending..."
              ) : (
                <>
                  Send Message <Send size={16} />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
