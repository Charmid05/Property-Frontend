"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PropertiesClient: React.FC = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Property data with type for badges
  const properties = [
    {
      id: 1,
      title: "Cozy Downtown Apartment",
      description:
        "A modern 2-bedroom apartment in the heart of the city, perfect for urban living.",
      price: "$1,200/month",
      image: "/assets/images/smart1.jpg",
      type: "Residential",
    },
    {
      id: 2,
      title: "Spacious Commercial Office",
      description:
        "Prime office space with open-plan design, ideal for startups and businesses.",
      price: "$3,500/month",
      image: "/assets/images/smart3.jpg",
      type: "Commercial",
    },
    {
      id: 3,
      title: "Luxury Suburban Villa",
      description:
        "A stunning 4-bedroom villa with a private garden, perfect for families.",
      price: "$2,800/month",
      image: "/assets/images/smart4.jpeg",
      type: "Residential",
    },
  ];

  return (
    <section
      id="properties"
      className="w-full py-16 min-h-screen flex items-center bg-gray-200 bg-opacity-80"
    >
      <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-bold text-orange-500 mb-6 text-center md:text-5xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
        >
          Our Properties
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed text-center md:text-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.2 },
            },
          }}
        >
          Discover a curated selection of properties designed to meet your
          residential, commercial, or investment needs.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: index * 0.2 },
                },
              }}
            >
              <Card className="bg-white border border-orange-100 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:border-orange-300">
                <CardHeader className="p-0 relative">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {property.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-3">
                    {property.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-orange-500 font-medium text-lg">
                      {property.price}
                    </p>
                    <Link
                      href={`/properties/${property.id}`}
                      className="text-orange-500 text-sm font-semibold hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.8 },
            },
          }}
        >
          <Button
            asChild
            className="px-8 py-4 bg-orange-500 text-white rounded-full text-lg font-semibold shadow-md hover:shadow-lg hover:bg-orange-600 transition-all"
          >
            <Link href="/properties">Explore All Properties</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertiesClient;
