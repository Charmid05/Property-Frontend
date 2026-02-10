"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";

const ContactsClient: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <section
      id="contacts"
      className="w-full py-16 min-h-screen flex items-center bg-gray-200 bg-opacity-80"
    >
      <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-orange-500 mb-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
        >
          Get in Touch
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed text-center"
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
          Have questions or need assistance? Contact us to explore how we can
          support your property needs.
        </motion.p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Contact Form */}
          <motion.div
            className="max-w-lg mx-auto lg:mx-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.4 },
              },
            }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white shadow-lg rounded-xl p-8 border border-orange-100"
            >
              {success && (
                <motion.p
                  className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Message sent successfully!
                </motion.p>
              )}
              <div className="relative">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition bg-white text-gray-900"
                />
                <Mail
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 text-orange-500"
                  size={20}
                />
              </div>
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition bg-white text-gray-900"
                />
                <Mail
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 text-orange-500"
                  size={20}
                />
              </div>
              <div className="relative">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="pl-10 pt-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition bg-white text-gray-900 h-40 resize-none"
                />
                <MessageSquare
                  className="absolute top-3 left-3 text-orange-500"
                  size={20}
                />
              </div>
              <Button
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold text-white ${
                  isSubmitting
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                } transition duration-200 shadow-md hover:shadow-lg`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="max-w-lg mx-auto lg:mx-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.6 },
              },
            }}
          >
            <div className="bg-white shadow-lg rounded-xl p-8 space-y-6 border border-orange-100">
              <h3 className="text-2xl font-semibold text-gray-800">
                Reach Out Directly
              </h3>
              <ul className="space-y-4 text-gray-600 text-base">
                <li className="flex items-center gap-3">
                  <Mail className="text-orange-500" size={20} />
                  <a
                    href="mailto:support@smartrent.com"
                    className="hover:text-orange-500 transition"
                  >
                    support@smartrent.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-orange-500" size={20} />
                  <a
                    href="tel:+1234567890"
                    className="hover:text-orange-500 transition"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="text-orange-500" size={20} />
                  <span>123 Smart Street, Rent City, RC 12345</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactsClient;
