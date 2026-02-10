"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Pill, ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useAuthContext } from "@/context/ApiContext";
import { login, fetchCurrentUser } from "@/app/api/auth/api";

export default function LoginPage() {
  const {
    isLoggedIn,
    loading: authLoading,
    getRoleBasedRedirectUrl,
    refreshUser,
  } = useAuthContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginStep, setLoginStep] = useState<
    "idle" | "authenticating" | "fetching" | "redirecting"
  >("idle");

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setLoginStep("authenticating");

    if (!formData.identifier || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      setLoginStep("idle");
      return;
    }

    try {
      const response = await login(formData.identifier, formData.password);

      if (response.message === "Login successful") {
        setLoginStep("fetching");
        await refreshUser();
        setLoginStep("redirecting");
        const userData = await fetchCurrentUser();

        if (userData && userData.role) {
          const redirectUrl = getRoleBasedRedirectUrl(userData.role);
          toast.success(
            `Welcome back, ${userData.first_name}! Redirecting to ${userData.role} dashboard...`
          );
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1500);
        } else {
          throw new Error("Failed to fetch user data after login");
        }
      } else {
        setError(response.message || "Login failed");
        toast.error(response.message || "Login failed");
        setIsLoading(false);
        setLoginStep("idle");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      setLoginStep("idle");
    }
  };

  const getStepMessage = () => {
    switch (loginStep) {
      case "authenticating":
        return "Verifying credentials...";
      case "fetching":
        return "Loading user profile...";
      case "redirecting":
        return "Redirecting to dashboard...";
      default:
        return "Signing in...";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-800 to-orange-500 text-white">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 opacity-10">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="16"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" fill="#ffffff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          <div className="flex flex-col justify-center h-full px-12 py-20 relative z-10">
            <div className="mb-16">
              <div className="flex items-center mb-6">
                <svg
                  className="h-8 w-8 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h1 className="text-2xl font-bold">PropertySys</h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Welcome to Your Property Dashboard
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-900">PropertySys</h1>
            <p className="text-gray-600 mt-2">Property Management System</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-center text-green-900">
                Sign In
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Identifier Field */}
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-green-900">
                    Email, Phone, or Username
                  </Label>
                  <div className="relative">
                    <Input
                      id="identifier"
                      name="identifier"
                      type="text"
                      placeholder="Enter your email, phone, or username"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="h-11 pl-10 border-gray-300 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-300"
                      autoComplete="username"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-green-900">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-green-700 hover:text-orange-500 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="h-11 pl-10 pr-10 border-gray-300 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-300"
                      autoComplete="current-password"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-orange-500 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-green-600 hover:bg-orange-500 transition-colors font-medium"
                  disabled={
                    isLoading ||
                    !formData.identifier.trim() ||
                    !formData.password.trim()
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {getStepMessage()}
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-gray-50 to-gray-200 text-gray-500">
                  Need assistance?
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/contact-support"
                className="text-green-700 hover:text-orange-500 font-medium transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-sm text-gray-600">
              <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
              Your connection is secure and encrypted
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-4"
      />
    </div>
  );
}
