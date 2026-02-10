"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  AlertCircle,
  Building2,
  User,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "normal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ subject: "", message: "", priority: "normal" });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      subtext: "Mon-Fri, 9:00 AM - 5:00 PM",
      color: "blue",
    },
    {
      icon: Mail,
      label: "Email",
      value: "property@example.com",
      subtext: "Response within 24 hours",
      color: "green",
    },
    {
      icon: MapPin,
      label: "Office Address",
      value: "123 Property Management St",
      subtext: "Suite 100, City, State 12345",
      color: "orange",
    },
    {
      icon: Clock,
      label: "Office Hours",
      value: "Monday - Friday",
      subtext: "9:00 AM - 5:00 PM",
      color: "purple",
    },
  ];

  const emergencyContacts = [
    {
      title: "Emergency Maintenance",
      phone: "+1 (555) 911-9999",
      description: "24/7 for urgent issues (flooding, gas leaks, no heat)",
    },
    {
      title: "Security",
      phone: "+1 (555) 777-8888",
      description: "24/7 for security concerns and emergencies",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">
            Contact Property Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Get in touch with us for any questions or concerns
          </p>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900 mb-1">
                For Emergencies, Call Immediately
              </h3>
              <p className="text-sm text-red-800 mb-2">
                Do not use the contact form for emergencies. Call the emergency
                numbers below for immediate assistance.
              </p>
              <div className="space-y-2">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-red-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-red-900">
                        {contact.title}
                      </p>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-red-600 font-bold hover:text-red-700"
                      >
                        {contact.phone}
                      </a>
                    </div>
                    <p className="text-xs text-red-700">{contact.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-bold text-black">Contact Info</h2>
              </div>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 bg-${info.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <info.icon className={`w-5 h-5 text-${info.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{info.label}</p>
                      <p className="font-semibold text-black">{info.value}</p>
                      <p className="text-xs text-gray-500">{info.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Manager Info */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-6 h-6" />
                <h2 className="text-xl font-bold">Your Property Manager</h2>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">John Smith</p>
                <p className="text-sm opacity-90">Senior Property Manager</p>
                <div className="pt-3 border-t border-white/20">
                  <p className="text-sm opacity-90">Direct Line:</p>
                  <p className="font-semibold">+1 (555) 123-4567 ext. 101</p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-blue-900 mb-2">
                Response Time Tips
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Email: Within 24-48 hours</li>
                <li>• Phone: Immediate during office hours</li>
                <li>• Contact form: Within 24 hours</li>
                <li>• Emergency: Immediate response 24/7</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-black">Send a Message</h2>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 text-center">
                    Your message has been sent to the property manager. You will
                    receive a response soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="normal">Normal - Standard request</option>
                      <option value="high">High - Needs attention soon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Please provide details about your question or concern..."
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Before sending, please note:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • For maintenance issues, use the maintenance request
                        form
                      </li>
                      <li>
                        • For payment questions, check your invoices and receipts
                        first
                      </li>
                      <li>
                        • Include relevant details (unit number, dates, etc.)
                      </li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Additional Resources */}
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 mb-3">
                Frequently Used Links
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/tenant/maintenance/new"
                  className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium text-center"
                >
                  Submit Maintenance
                </a>
                <a
                  href="/tenant/finance/payments"
                  className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium text-center"
                >
                  Payment History
                </a>
                <a
                  href="/tenant/lease"
                  className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium text-center"
                >
                  View Lease
                </a>
                <a
                  href="/tenant/documents"
                  className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium text-center"
                >
                  Documents
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

