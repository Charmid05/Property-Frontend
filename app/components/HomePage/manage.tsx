"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PropertyManagementSection() {
  const [activeService, setActiveService] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      name: "Rental Recruitment",
      desc: "Targeted marketing to attract high-quality tenants fast.",
      icon: "Search",
    },
    {
      id: 2,
      name: "Screening & Contract",
      desc: "Thorough background checks and legally sound contracts.",
      icon: "Document",
    },
    {
      id: 3,
      name: "Move-in & Out",
      desc: "Smooth transitions with full inspections and support.",
      icon: "ArrowRight",
    },
    {
      id: 4,
      name: "Cash Management",
      desc: "Automated rent collection and transparent financials.",
      icon: "DollarSign",
    },
    {
      id: 5,
      name: "Tenant Support",
      desc: "24/7 multilingual support via call center and portal.",
      icon: "Headphones",
    },
    {
      id: 6,
      name: "Security Deposit",
      desc: "Fair, fast, and transparent deposit settlements.",
      icon: "Shield",
    },
    {
      id: 7,
      name: "Restoration",
      desc: "Professional refurbishment and cost management.",
      icon: "Hammer",
    },
    {
      id: 8,
      name: "Taxation Support",
      desc: "Expert tax filing for local and overseas owners.",
      icon: "Calculator",
    },
  ];

  const getSegmentPath = (index: number, total: number): string => {
    const startAngle = (index * 360) / total - 90;
    const endAngle = ((index + 1) * 360) / total - 90;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const outer = 180,
      inner = 90;
    const x1 = 200 + outer * Math.cos(startRad);
    const y1 = 200 + outer * Math.sin(startRad);
    const x2 = 200 + outer * Math.cos(endRad);
    const y2 = 200 + outer * Math.sin(endRad);
    const x3 = 200 + inner * Math.cos(endRad);
    const y3 = 200 + inner * Math.sin(endRad);
    const x4 = 200 + inner * Math.cos(startRad);
    const y4 = 200 + inner * Math.sin(startRad);

    const largeArc = endAngle - startAngle > 180 ? "1" : "0";
    return `M ${x1} ${y1} A ${outer} ${outer} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  const getTextPos = (i: number, total: number) => {
    const angle = (((i * 360) / total + 180 / total - 90) * Math.PI) / 180;
    const r = 135;
    return { x: 200 + r * Math.cos(angle), y: 200 + r * Math.sin(angle) };
  };

  const colors = [
    "#166534",
    "#15803d",
    "#16a34a",
    "#22c55e",
    "#f97316",
    "#ea580c",
    "#166534",
    "#15803d",
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-green-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-orange-600 bg-clip-text text-transparent">
            Property Management Solutions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            End-to-end service coverage with expert support in Kenya.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Circular Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-sm aspect-square">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-xl"
              >
                {/* Segments */}
                {services.map((service, i) => {
                  const isActive = activeService === service.id;
                  return (
                    <motion.g
                      key={service.id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <path
                        d={getSegmentPath(i, services.length)}
                        fill={colors[i]}
                        opacity={isActive ? 1 : 0.9}
                        className="cursor-pointer transition-all duration-300"
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${service.name}`}
                        onClick={() => setActiveService(service.id)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setActiveService(service.id)
                        }
                        style={{
                          filter: isActive
                            ? "brightness(1.15) drop-shadow(0 4px 12px rgba(0,0,0,0.2))"
                            : "none",
                          transformOrigin: "200px 200px",
                        }}
                      />
                      <text
                        x={getTextPos(i, services.length).x}
                        y={getTextPos(i, services.length).y}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="700"
                        className="pointer-events-none select-none"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
                      >
                        {service.name.split(" ").map((w, j) => (
                          <tspan
                            key={j}
                            x={getTextPos(i, services.length).x}
                            dy={j === 0 ? 0 : 12}
                          >
                            {w}
                          </tspan>
                        ))}
                      </text>
                    </motion.g>
                  );
                })}

                {/* Center */}
                <circle
                  cx="200"
                  cy="200"
                  r="85"
                  fill="white"
                  stroke="#166534"
                  strokeWidth="3"
                />
                <text
                  x="200"
                  y="195"
                  textAnchor="middle"
                  fill="#166534"
                  fontSize="16"
                  fontWeight="800"
                >
                  Property
                </text>
                <text
                  x="200"
                  y="215"
                  textAnchor="middle"
                  fill="#166534"
                  fontSize="16"
                  fontWeight="800"
                >
                  Management
                </text>
                <text
                  x="200"
                  y="232"
                  textAnchor="middle"
                  fill="#f97316"
                  fontSize="13"
                  fontWeight="600"
                >
                  Services
                </text>
              </svg>
            </div>
          </motion.div>

          {/* Right Side - Dynamic Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Active Service Detail */}
            {activeService ? (
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-orange-50 p-6 rounded-2xl border border-green-200 shadow-inner"
              >
                {services.map(
                  (s) =>
                    s.id === activeService && (
                      <div key={s.id}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {s.icon === "Search" && "Search"}
                            {s.icon === "Document" && "Document"}
                            {s.icon === "ArrowRight" && "Right Arrow"}
                            {s.icon === "DollarSign" && "$"}
                            {s.icon === "Headphones" && "Headphones"}
                            {s.icon === "Shield" && "Shield"}
                            {s.icon === "Hammer" && "Hammer"}
                            {s.icon === "Calculator" && "Calculator"}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {s.name}
                          </h3>
                        </div>
                        <p className="text-gray-700">{s.desc}</p>
                      </div>
                    )
                )}
              </motion.div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-2xl text-center text-gray-500 border border-dashed border-gray-300">
                <p className="text-sm">Tap a segment to learn more</p>
              </div>
            )}

            {/* Static Highlights */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-700">
                <h4 className="font-bold text-gray-900">Comprehensive</h4>
                <p className="text-sm text-gray-600 mt-1">
                  From marketing to tax filing
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-orange-500">
                <h4 className="font-bold text-gray-900">24/7 Support</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Multilingual team in Kenya
                </p>
              </div>
            </div>

            {/* CTA */}
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white font-bold text-lg py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <a href="/services">Explore All Services</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
