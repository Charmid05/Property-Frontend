"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => setIsLoaded(true), []);

  return (
    <section
      className="relative bg-white"
      style={{ paddingTop: "calc(3rem + 4rem)" }} // 3rem = top bar, 4rem = main navbar
      aria-labelledby="hero-heading"
    >
      {/* Mobile-only animated SVG background */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#166534" />
              <stop offset="50%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>

          <rect width="1440" height="800" fill="url(#bgGradient)" />

          {/* Tetris & LEGO animations */}
          {[
            {
              d: "M150,80 L280,80 L280,160 L210,160 L210,230 L150,230 Z",
              fill: "#16a34a",
              o: 0.3,
              delay: 0,
            },
            {
              d: "M320,50 L450,50 L450,120 L320,120 Z",
              fill: "#15803d",
              o: 0.25,
              delay: 1,
            },
            {
              d: "M500,100 L580,100 L580,180 L500,180 Z",
              fill: "#f97316",
              o: 0.4,
              delay: 2,
            },
            {
              d: "M100,300 L220,300 L220,370 L150,370 L150,440 L100,440 Z",
              fill: "#166534",
              o: 0.35,
              delay: 0.5,
            },
            {
              d: "M1200,100 L1380,100 L1380,180 L1200,180 Z",
              fill: "#15803d",
              o: 0.3,
              delay: 1.5,
            },
            {
              d: "M1100,250 L1180,250 L1180,330 L1100,330 Z",
              fill: "#ea580c",
              o: 0.35,
              delay: 2.5,
            },
            {
              d: "M50,550 L180,550 L180,620 L120,620 L120,690 L50,690 Z",
              fill: "#16a34a",
              o: 0.25,
              delay: 0.8,
            },
            {
              d: "M900,600 L1100,600 L1100,680 L900,680 Z",
              fill: "#166534",
              o: 0.3,
              delay: 1.8,
            },
            {
              d: "M1250,500 L1330,500 L1330,580 L1250,580 Z",
              fill: "#f97316",
              o: 0.4,
              delay: 2.2,
            },
            {
              d: "M1300,650 L1440,650 L1440,750 L1300,750 Z",
              fill: "#15803d",
              o: 0.3,
              delay: 1.2,
            },
          ].map((p, i) => (
            <motion.path
              key={i}
              d={p.d}
              fill={p.fill}
              opacity={p.o}
              animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay,
              }}
            />
          ))}

          {[
            { cx: 215, cy: 130, r: 14, fill: "#15803d", d: 0.3 },
            { cx: 385, cy: 85, r: 12, fill: "#14532d", d: 1 },
            { cx: 540, cy: 140, r: 16, fill: "#f97316", d: 1.8 },
            { cx: 160, cy: 370, r: 15, fill: "#16a34a", d: 0.6 },
            { cx: 1290, cy: 140, r: 18, fill: "#166534", d: 2 },
            { cx: 1140, cy: 290, r: 14, fill: "#ea580c", d: 1.4 },
            { cx: 115, cy: 620, r: 16, fill: "#15803d", d: 0.9 },
            { cx: 1000, cy: 640, r: 17, fill: "#14532d", d: 1.6 },
            { cx: 1290, cy: 540, r: 15, fill: "#f97316", d: 2.3 },
            { cx: 1370, cy: 700, r: 19, fill: "#166534", d: 0.7 },
          ].map((s, i) => (
            <motion.circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill={s.fill}
              opacity={0.4}
              animate={{ y: [0, -25, 0] }}
              transition={{
                duration: 5 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: s.d,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Main hero container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full max-w-7xl mx-auto"
        >
          {/* Full hero card – NO OVERLAP, NO GAP */}
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
            className={`
              relative rounded-2xl sm:rounded-3xl overflow-hidden
              shadow-2xl bg-black/20 backdrop-blur-sm border border-white/10
              h-[420px] sm:h-[500px] lg:h-[560px]
            `}
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=800&fit=crop')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

            <div className="relative z-10 flex h-full items-center p-6 sm:p-10 lg:p-16">
              <div className="max-w-3xl text-left">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-block mb-5"
                >
                  <span className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold tracking-wider shadow-lg">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    EXPERT PROPERTY MANAGEMENT
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  id="hero-heading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 leading-tight drop-shadow-2xl"
                >
                  Services You Can{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                    Trust
                  </span>
                </motion.h1>

                {/* Copy */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  className="text-base sm:text-lg lg:text-xl text-gray-100 mb-8 leading-relaxed max-w-2xl drop-shadow-md"
                >
                  From tenant screening to 24/7 emergency maintenance, we handle
                  every detail so you can enjoy passive income —
                  <span className="font-semibold text-orange-300">
                    stress-free
                  </span>
                  .
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                >
                  <a
                    href="/get-quote"
                    className="group inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/50 shadow-xl"
                  >
                    Get a Free Quote
                    <svg
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </a>
                </motion.div>

                {/* Trust */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="mt-10 flex flex-wrap items-center gap-6 text-white/80 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>500+ Properties Managed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>4.9/5 Client Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h5a3 3 0 013 3v1h2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm1 0h6V5a1 1 0 00-1-1H7a1 1 0 00-1 1v1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Since 2015</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
