import { useState, useEffect } from "react";

type DropdownType =
  | "features"
  | "more"
  | "language"
  | "mobile-features"
  | "mobile-more";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<null | DropdownType>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide header only when scrolling down past 80px
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      }

      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu & dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isMobileMenuOpen) return;
      const target = e.target as HTMLElement;
      if (!target.closest("nav")) {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const features = [
    {
      name: "Landlords",
      description: "Manage properties and tenants efficiently",
      icon: "home",
    },
    {
      name: "Property Managers",
      description: "Streamline operations",
      icon: "building",
    },
    {
      name: "Tenants",
      description: "Access rental information easily",
      icon: "user",
    },
  ];

  const moreItems = [
    {
      name: "What We Do",
      description: "Property management solutions",
      icon: "info",
    },
    { name: "FAQ", description: "Commonly asked questions", icon: "help" },
    { name: "Blog", description: "Insights and tips", icon: "blog" },
    {
      name: "Support",
      description: "Get help when you need it",
      icon: "support",
    },
  ];

  const languages = ["EN", "SW", "FR"];

  const toggleDropdown = (dropdown: DropdownType) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Prevent layout shift */}
      <div className="h-11" />

      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Top Bar */}
        <div
          className={`bg-gray-50 border-b border-gray-200 transition-transform duration-300 ${
            showHeader ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{ height: "3rem" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex justify-between items-center h-full text-xs sm:text-sm">
              <div className="flex items-center text-black">
                <svg
                  className="w-4 h-4 mr-2"
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
                <span className="font-semibold">+254 123 456 789</span>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <a
                  href="/auth/login"
                  className="text-black hover:text-gray-700 font-medium transition-colors"
                >
                  Login
                </a>
                <a
                  href="/auth/register"
                  className="text-black hover:text-gray-700 font-medium transition-colors"
                >
                  Register
                </a>

                {/* Language Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("language")}
                    className="flex items-center text-black hover:text-gray-700 font-medium transition-colors"
                    aria-expanded={activeDropdown === "language"}
                  >
                    {selectedLanguage}
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${
                        activeDropdown === "language" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {activeDropdown === "language" && (
                    <div className="absolute right-0 mt-2 w-20 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setSelectedLanguage(lang);
                            setActiveDropdown(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`bg-white transition-all duration-300 ${
            isScrolled ? "shadow-md" : "shadow"
          } ${!showHeader ? "-mt-11" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <a
                href="/"
                className="flex items-center space-x-2 group"
                onClick={closeAll}
              >
                <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center group-hover:bg-green-800 transition-colors">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-black">
                  AUX Management
                </span>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <a
                  href="/about"
                  className="text-black hover:text-gray-700 font-medium transition-colors"
                >
                  About
                </a>

                {/* Features Dropdown */}
                <div className="relative group">
                  <button
                    onMouseEnter={() => setActiveDropdown("features")}
                    onClick={() => toggleDropdown("features")}
                    className="flex items-center text-black hover:text-gray-700 font-medium transition-colors"
                    aria-expanded={activeDropdown === "features"}
                  >
                    Features
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${
                        activeDropdown === "features" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {(activeDropdown === "features" || null) && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Who It's For
                      </h3>
                      <div className="space-y-2">
                        {features.map((f) => (
                          <a
                            key={f.name}
                            href={`/features/${f.name
                              .toLowerCase()
                              .replace(" ", "-")}`}
                            className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                            onClick={closeAll}
                          >
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-green-900"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {f.icon === "home" && (
                                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                )}
                                {f.icon === "building" && (
                                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                )}
                                {f.icon === "user" && (
                                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                )}
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-black group-hover/item:text-gray-900">
                                {f.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {f.description}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <a
                  href="/pricing"
                  className="text-black hover:text-gray-700 font-medium transition-colors"
                >
                  Pricing
                </a>

                {/* More Dropdown */}
                <div className="relative group">
                  <button
                    onMouseEnter={() => setActiveDropdown("more")}
                    onClick={() => toggleDropdown("more")}
                    className="flex items-center text-black hover:text-gray-700 font-medium transition-colors"
                    aria-expanded={activeDropdown === "more"}
                  >
                    More
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${
                        activeDropdown === "more" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {(activeDropdown === "more" || null) && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="space-y-2">
                        {moreItems.map((item) => (
                          <a
                            key={item.name}
                            href={`/${item.name
                              .toLowerCase()
                              .replace(" ", "-")}`}
                            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                            onClick={closeAll}
                          >
                            <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center mr-3">
                              <svg
                                className="w-4 h-4 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {item.icon === "info" && (
                                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                )}
                                {item.icon === "help" && (
                                  <path d="M8.228 9c.549-1.165 1.261-2.056 1.78-2.056.805 0 1.253 1.052 1.253 2.8 0 .795-.27 1.34-.758 1.946-.57.7-1.35 1.38-1.35 2.43 0 .28.23.5.5.5h2.5a.5.5 0 00.5-.5c0-1.05.78-1.83 1.35-2.53.488-.606.758-1.151.758-1.946 0-1.748-.448-2.8-1.253-2.8-.519 0-1.231.891-1.78 2.056-.274.582-.75 1-1.3 1-.55 0-1-.418-1-1 0-.582.45-1 1-1zM12 19h.01" />
                                )}
                                {item.icon === "blog" && (
                                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                )}
                                {item.icon === "support" && (
                                  <path d="M18 8h1a4 4 0 010 8h-1M3.5 8h17M3.5 16h17m-17-8v8a4 4 0 004 4h9a4 4 0 004-4v-8" />
                                )}
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-black">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <a
                  href="/contact"
                  className="text-black hover:text-gray-700 font-medium transition-colors"
                >
                  Contact
                </a>

                {/* CTA Button */}
                <a
                  href="/get-started"
                  className="bg-green-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-800 transition-colors shadow-sm"
                >
                  Get Started
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="lg:hidden text-black p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200">
              <div className="px-4 py-3 space-y-1">
                <a
                  href="/about"
                  className="block py-2.5 text-black font-medium hover:text-gray-700"
                  onClick={closeAll}
                >
                  About
                </a>

                {/* Mobile Features */}
                <div>
                  <button
                    onClick={() => toggleDropdown("mobile-features")}
                    className="flex w-full justify-between items-center py-2.5 text-black font-medium hover:text-gray-700"
                  >
                    Features
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        activeDropdown === "mobile-features" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {activeDropdown === "mobile-features" && (
                    <div className="ml-4 mt-1 space-y-1">
                      {features.map((f) => (
                        <a
                          key={f.name}
                          href={`/features/${f.name
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          className="block py-2 pl-3 text-sm text-gray-700 hover:text-black"
                          onClick={closeAll}
                        >
                          {f.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href="/pricing"
                  className="block py-2.5 text-black font-medium hover:text-gray-700"
                  onClick={closeAll}
                >
                  Pricing
                </a>

                {/* Mobile More */}
                <div>
                  <button
                    onClick={() => toggleDropdown("mobile-more")}
                    className="flex w-full justify-between items-center py-2.5 text-black font-medium hover:text-gray-700"
                  >
                    More
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        activeDropdown === "mobile-more" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {activeDropdown === "mobile-more" && (
                    <div className="ml-4 mt-1 space-y-1">
                      {moreItems.map((item) => (
                        <a
                          key={item.name}
                          href={`/${item.name.toLowerCase().replace(" ", "-")}`}
                          className="block py-2 pl-3 text-sm text-gray-700 hover:text-black"
                          onClick={closeAll}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href="/contact"
                  className="block py-2.5 text-black font-medium hover:text-gray-700"
                  onClick={closeAll}
                >
                  Contact
                </a>

                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  <a
                    href="/auth/login"
                    className="block py-2.5 text-black font-medium hover:text-gray-700"
                    onClick={closeAll}
                  >
                    Login
                  </a>
                  <a
                    href="/auth/register"
                    className="block py-2.5 text-black font-medium hover:text-gray-700"
                    onClick={closeAll}
                  >
                    Register
                  </a>
                  <a
                    href="/get-started"
                    className="block text-center bg-green-900 text-white py-2.5 rounded-lg font-medium hover:bg-green-800 transition-colors"
                    onClick={closeAll}
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
