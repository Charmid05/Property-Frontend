"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UseCasesClient: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="use-cases"
      className="w-full py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-10"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-600"
          >
            Use Cases
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            See how landlords and property managers use AUX to save time and
            grow revenue.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Video Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col bg-white rounded-2xl">
              <CardHeader className="p-0 relative">
                <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/Iqr3XIhSnUQ?rel=0"
                    title="AUX Property Management Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                  {/* Play Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7L8 5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      AUX Demo
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  The All-in-One Property Management System
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 flex-1">
                  Never miss rent again. Automated workflows, real-time
                  tracking, and instant reports.
                </p>
                <Button
                  asChild
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Link href="/demo">Book a Demo</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Text Card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full flex flex-col bg-white border-0 shadow-xl rounded-2xl p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Streamline Your Property Management
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-5 flex-1">
                From solo landlords to large portfolios — our tools save time,
                reduce stress, and boost returns.
              </p>

              <ul className="space-y-3 mb-6 flex-1">
                {[
                  "Automated tenant communication & lease tracking",
                  "Instant rent collection + financial reports",
                  "Maintenance requests with real-time updates",
                  "Portfolio analytics & performance insights",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm sm:text-base text-gray-700"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/use-cases/property-managers">Learn More</Link>
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesClient;
