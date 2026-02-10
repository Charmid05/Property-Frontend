"use client";

import { useState, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
interface FormField {
  name: string;
  type: string;
  placeholder: string;
  icon?: ReactNode;
  required?: boolean;
}

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: FormField[];
  formData: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string;
  isSubmitting: boolean;
  submitButtonText: string;
  alternateLinkText: string;
  alternateLinkHref: string;
  showGoogleLogin?: boolean;
  additionalFields?: ReactNode;
  promoContent: {
    icon: string;
    title: string;
    description: string;
    features: string[];
  };
  primaryColor: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  fields,
  formData,
  onChange,
  onSubmit,
  error,
  isSubmitting,
  submitButtonText,
  alternateLinkText,
  alternateLinkHref,
  showGoogleLogin = false,
  additionalFields,
  promoContent,
  primaryColor,
}) => {
  const getIcon = (icon: ReactNode, name: string) => {
    if (icon) return icon;
    switch (name) {
      case "identifier":
      case "username":
        return <User className="text-gray-500" size={20} />;
      case "email":
        return <Mail className="text-gray-500" size={20} />;
      case "password":
      case "password2":
        return <Lock className="text-gray-500" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 transition-all duration-300 hover:shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            <p className="text-base text-gray-600 mt-2">{subtitle}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className={`text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200`}>
                {error}
              </div>
            )}

            {/* Form Fields */}
            {fields.map((field) => (
              <div key={field.name} className="relative">
                {getIcon(field.icon, field.name) && (
                  <span className="absolute top-3 left-3">
                    {getIcon(field.icon, field.name)}
                  </span>
                )}
                <Input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={onChange}
                  required={field.required}
                  disabled={isSubmitting}
                  className={`pl-10 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
            ))}

            {/* Additional Fields (e.g., Role Dropdown) */}
            {additionalFields}

            <div className="flex justify-between text-sm text-gray-700">
              <Link
                href="/forgot-password"
                className={`hover:text-${primaryColor}-600 transition font-medium`}
              >
                Forgot Password?
              </Link>
              <Link
                href={alternateLinkHref}
                className={`hover:text-${primaryColor}-600 transition font-medium`}
              >
                {alternateLinkText}
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white bg-${primaryColor}-600 hover:bg-${primaryColor}-700 transition duration-200 ${
                isSubmitting ? "bg-${primaryColor}-400 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                submitButtonText
              )}
            </Button>

            {/* Or Separator */}
            {showGoogleLogin && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-600">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Login */}
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                  className="flex items-center justify-center w-full py-3 border-gray-200 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaGoogle className="mr-2 text-blue-600" /> Sign in with Google
                </Button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Right Side: Promo Panel */}
      <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center bg-gray-50 p-8 text-gray-900">
        <div className="text-center max-w-lg">
          <div className="text-5xl mb-6 animate-pulse">{promoContent.icon}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{promoContent.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{promoContent.description}</p>
          <ul className="text-base text-gray-600 space-y-4">
            {promoContent.features.map((feature, index) => (
              <li key={index} className="flex items-center justify-center">
                <span className={`mr-2 text-${primaryColor}-500 font-semibold`}>✔️</span> {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;