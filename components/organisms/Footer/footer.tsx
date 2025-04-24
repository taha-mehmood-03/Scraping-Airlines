"use client";

import { Link } from "@heroui/react";
import { 
  PlaneTakeoff, 
  Train, 
  Sunset, 
  Compass, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  CreditCard,
  ShieldCheck,
  Users
} from "lucide-react";

import { SkyJetLogo } from "@/components/atoms/Logo/logo";
export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-indigo-100 dark:border-indigo-950 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <SkyJetLogo />
              <div className="flex flex-col">
                <p className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-300">SkyJet</p>
                <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-medium">Premium Travel Solutions</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              SkyJet provides premium travel solutions for all your journey needs, 
              from flights and ground transportation to complete holiday packages.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Our Services */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#flights" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  <PlaneTakeoff size={16} />
                  <span>Flight Bookings</span>
                </Link>
              </li>
              <li>
                <Link href="#buses" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  <Train size={16} />
                  <span>Buses & Trains</span>
                </Link>
              </li>
              <li>
                <Link href="#holidays" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  <Sunset size={16} />
                  <span>Holiday Packages</span>
                </Link>
              </li>
              <li>
                <Link href="#umrah" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  <Compass size={16} />
                  <span>Umrah & Hajj</span>
                </Link>
              </li>
              <li>
                <Link href="#corporate" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  <Users size={16} />
                  <span>Corporate Travel</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Customer Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#faq" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#cancellation" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="#refunds" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  Refund Process
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin size={16} className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>123 Business Avenue, Suite 500, Dubai, UAE</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>+971 4 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>contact@skyjet.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">We Accept:</h4>
              <div className="flex items-center gap-3">
                <CreditCard size={24} className="text-indigo-600 dark:text-indigo-400" />
                <ShieldCheck size={24} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} SkyJet Travel Solutions. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="#privacy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                Privacy
              </Link>
              <Link href="#terms" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                Terms
              </Link>
              <Link href="#sitemap" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};