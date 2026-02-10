import {
  Search,
  Megaphone,
  ShieldCheck,
  Wrench,
  HandCoins,
  FileText,
  Users,
  Home,
} from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Property Inspections",
    description:
      "Yearly maintenance inspections to ensure lease compliance and property condition.",
  },
  {
    icon: Megaphone,
    title: "Property Marketing",
    description:
      "Creative marketing strategies to find quality tenants quickly.",
  },
  {
    icon: ShieldCheck,
    title: "Tenant Screening",
    description:
      "Thorough background and financial checks for reliable tenants.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description:
      "Coordinated maintenance services to keep properties in top shape.",
  },
  {
    icon: HandCoins,
    title: "Rent Collection",
    description:
      "Efficient handling of collections, payments, and disbursements.",
  },
  {
    icon: FileText,
    title: "Reporting",
    description: "Detailed documentation and reports via our owner's portal.",
  },
  {
    icon: Users,
    title: "Tenant Relations",
    description:
      "Building relationships that encourage renewals and property care.",
  },
  {
    icon: Home,
    title: "Property Finder",
    description: "Helping expats find flats and homes in Amsterdam with ease.",
  },
];

export default function WhatWeDo() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white" id="whatwedo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            What We Do
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map(({ icon: Icon, title, description }, index) => (
            <div
              key={index}
              className="p-5 rounded-xl group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex justify-center mb-3">
                <Icon className="h-8 w-8 text-[#00695C] group-hover:text-orange-500 transition-colors duration-300" />
              </div>
              <h3 className="text-base font-semibold text-center text-gray-800 mb-2">
                {title}
              </h3>
              <p className="text-sm text-center text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
