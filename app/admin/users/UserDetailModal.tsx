"use client";
import { User } from "@/types/user";
import {
  X,
  Mail,
  Phone,
  Calendar,
  Shield,
  User as UserIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onEdit?: (user: User) => void;
}

export default function UserDetailModal({
  user,
  onClose,
  onEdit,
}: UserDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="hover:bg-green-700 p-2 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <UserIcon size={40} className="text-orange-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black">
                {user.full_name}
              </h3>
              <p className="text-gray-600">@{user.username}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
              <Mail size={20} className="text-orange-500" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-black font-medium">{user.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  {user.email_verified ? (
                    <>
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-xs text-green-600">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={14} className="text-red-600" />
                      <span className="text-xs text-red-600">Not Verified</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="text-black font-medium">
                  {user.phone_number || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h4 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
              <Shield size={20} className="text-orange-500" />
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <p className="text-black font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">User Status</p>
                <p className="text-black font-medium">{user.user_status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Gender</p>
                <p className="text-black font-medium">
                  {user.gender || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Identity Number</p>
                <p className="text-black font-medium">
                  {user.identity_number || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {user.emergency_contact_number && (
            <div>
              <h4 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                <Phone size={20} className="text-orange-500" />
                Emergency Contact
              </h4>
              <p className="text-black font-medium">
                {user.emergency_contact_number}
              </p>
            </div>
          )}

          {/* Date Information */}
          <div>
            <h4 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
              <Calendar size={20} className="text-orange-500" />
              Account Timeline
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Joined</p>
                <p className="text-black font-medium">
                  {new Date(user.date_joined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              {user.created_by_name && (
                <div>
                  <p className="text-sm text-gray-600">Created By</p>
                  <p className="text-black font-medium">
                    {user.created_by_name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Flags */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {user.password_change_required ? (
                <XCircle size={18} className="text-red-600" />
              ) : (
                <CheckCircle size={18} className="text-green-600" />
              )}
              <span className="text-sm text-black">
                Password Change{" "}
                {user.password_change_required ? "Required" : "Not Required"}
              </span>
            </div>
            {user.tenant_count !== null && (
              <div className="flex items-center gap-2">
                <UserIcon size={18} className="text-orange-500" />
                <span className="text-sm text-black">
                  {user.tenant_count} Tenant{user.tenant_count !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onEdit && (
              <button
                onClick={() => onEdit(user)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Edit User
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
