"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/api/auth/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: "admin" | "landlord";
  }>({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: [] }));
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value as "admin" | "landlord" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setSuccess(null);

    const response = await registerUser(formData);

    if (response.access) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } else {
      if (response.fieldErrors) {
        setFieldErrors(response.fieldErrors);
      } else {
        setFieldErrors({ general: [response.message] });
      }
    }

    setLoading(false);
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-50 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Only property managers can register admins and landlords
        </p>

        {success && (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 p-4 rounded-lg mb-6 text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={`mt-1 ${fieldErrors.username ? "border-red-500" : ""}`}
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.username.join(", ")}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`mt-1 ${fieldErrors.email ? "border-red-500" : ""}`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.email.join(", ")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className={`mt-1 ${
                  fieldErrors.first_name ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.first_name && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.first_name.join(", ")}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className={`mt-1 ${
                  fieldErrors.last_name ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.last_name.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone_number" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={`mt-1 ${
                fieldErrors.phone_number ? "border-red-500" : ""
              }`}
            />
            {fieldErrors.phone_number && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.phone_number.join(", ")}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="landlord">Landlord</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`mt-1 ${fieldErrors.password ? "border-red-500" : ""}`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.password.join(", ")}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password2" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="password2"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              className={`mt-1 ${
                fieldErrors.password2 ? "border-red-500" : ""
              }`}
            />
            {fieldErrors.password2 && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.password2.join(", ")}
              </p>
            )}
          </div>

          {fieldErrors.general && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 p-4 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>{fieldErrors.general.join(", ")}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-900 text-white rounded-lg py-6 text-lg font-medium transition-all duration-300"
          >
            {loading ? "Registering..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="text-green-600 font-semibold cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
