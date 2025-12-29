import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2D2D2D] text-white py-12 border-t border-[#3D3D3D]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-2xl font-heading font-bold text-[#C5A065] mb-4 inline-block"
            >
              Vrunda Mehndi
            </Link>
            <p className="text-gray-400 text-sm max-w-sm">
              Blending ancient traditions with modern artistry to create
              timeless memories for your special occasions.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-[#C5A065] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#portfolio"
                  className="hover:text-[#C5A065] transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-[#C5A065] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#C5A065] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-4">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/vrunda_mehandi__"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3D3D3D] flex items-center justify-center text-white hover:bg-[#C5A065] transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#3D3D3D] flex items-center justify-center text-white hover:bg-[#C5A065] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#3D3D3D] flex items-center justify-center text-white hover:bg-[#C5A065] transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#3D3D3D] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Vrunda Mehndi Art. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
