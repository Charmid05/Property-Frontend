"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/ApiContext";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { isLoggedIn } = useAuthContext();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    // Simulate subscription process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubscribing(false);
    setEmail("");
    // You can add toast notification here
  };

  const quickLinks = [
    { name: "About Aux", href: "/about" },
    { name: "Our Story", href: "/about/story" },
    { name: "Team", href: "/about/team" },
    { name: "Careers", href: "/careers" },
    { name: "News", href: "/news" },
  ];

  const features = [
    { name: "Residential Properties", href: "/features/residential" },
    { name: "Commercial Properties", href: "/features/commercial" },
    { name: "Property Analytics", href: "/features/analytics" },
    { name: "Tenant Management", href: "/features/tenants" },
    { name: "Maintenance Tracking", href: "/features/maintenance" },
  ];

  const pricing = [
    { name: "Service Plans", href: "/pricing/plans" },
    { name: "Free Consultation", href: "/pricing/consultation" },
    { name: "Premium Services", href: "/pricing/premium" },
    { name: "Custom Solutions", href: "/pricing/custom" },
    { name: "Enterprise", href: "/pricing/enterprise" },
  ];

  const contactInfo = [
    {
      type: "email",
      label: "Email",
      value: "hello@auxmanagement.com",
      href: "mailto:hello@auxmanagement.com",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      type: "phone",
      label: "Phone",
      value: "+254 123 456 789",
      href: "tel:+254123456789",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 10.5c-.66.35-.66 1.28 0 1.629l3.71 2.138c.66.35 1.49.35 2.15 0l4.064-2.347a1 1 0 011.21.502l1.498 4.493a1 1 0 01-.684.948H16a2 2 0 01-2-2V6.5"
          />
        </svg>
      ),
    },
    {
      type: "address",
      label: "Address",
      value: "123 Business Park, Nairobi, Kenya",
      href: "https://maps.google.com/?q=123+Business+Park+Nairobi+Kenya",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  if (!isLoggedIn) {
    return (
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h3 className="text-white text-lg font-semibold mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="lg:col-span-1">
              <h3 className="text-white text-lg font-semibold mb-6">
                Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature.name}>
                    <Link
                      href={feature.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                    >
                      {feature.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="lg:col-span-1">
              <h3 className="text-white text-lg font-semibold mb-6">Pricing</h3>
              <ul className="space-y-3">
                {pricing.map((plan) => (
                  <li key={plan.name}>
                    <Link
                      href={plan.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                    >
                      {plan.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="lg:col-span-1">
              <h3 className="text-white text-lg font-semibold mb-6">
                Contact Us
              </h3>
              <ul className="space-y-4">
                {contactInfo.map((contact) => (
                  <li key={contact.type}>
                    <Link
                      href={contact.href}
                      target={contact.type === "address" ? "_blank" : undefined}
                      rel={
                        contact.type === "address"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-start space-x-3 text-gray-400 hover:text-orange-500 transition-colors duration-200 group"
                    >
                      <div className="flex-shrink-0 mt-0.5 group-hover:text-orange-500">
                        {contact.icon}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          {contact.label}
                        </div>
                        <div className="text-sm leading-relaxed">
                          {contact.value}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-1">
              <h3 className="text-white text-lg font-semibold mb-6">
                Newsletter
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Stay updated with property news and offers.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubscribing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Logo and Copyright */}
              <div className="flex items-center space-x-4">
                <div className="text-white font-bold text-xl">
                  Aux Management
                </div>
              </div>

              {/* Copyright */}
              <div className="text-gray-500 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Aux Management. All rights
                reserved.
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>

                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </Link>

                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
};

export default Footer;
