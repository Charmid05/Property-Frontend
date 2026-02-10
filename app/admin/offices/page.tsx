"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building,
  MapPin,
  User,
  Calendar,
  Mail,
  Phone,
  Edit,
  X,
} from "lucide-react";
import { Office } from "@/types/office";
import OfficeForm from "./officeForm";
import OfficeList from "./officeList";

type View = "list" | "create" | "edit" | "view";

export default function OfficesPage() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

  const handleCreateNew = () => {
    setSelectedOffice(null);
    setCurrentView("create");
  };

  const handleEdit = (office: Office) => {
    setSelectedOffice(office);
    setCurrentView("edit");
  };

  const handleView = (office: Office) => {
    setSelectedOffice(office);
    setCurrentView("view");
  };

  const handleFormSuccess = (office: Office) => {
    setCurrentView("list");
    setSelectedOffice(null);
  };

  const handleCancel = () => {
    setCurrentView("list");
    setSelectedOffice(null);
  };

  const renderHeader = () => {
    switch (currentView) {
      case "create":
      case "edit":
        return null; // Header is handled within OfficeForm
      case "view":
        return (
          <div className="bg-white border-b border-green-200 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  Office Details
                </h2>
                <p className="text-green-600 mt-1">View office information</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="h-8 w-8 text-green-600 hover:bg-green-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white border-b border-green-200 p-6 z-10">
            <div>
              <h2 className="text-2xl font-bold text-black">Offices</h2>
              <p className="text-green-600 mt-1">
                Manage your office locations
              </p>
            </div>
          </div>
        );
    }
  };

  const renderOfficeDetails = () => {
    if (!selectedOffice) return null;

    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Office Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-green-200 shadow-sm">
              <CardHeader className="bg-green-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <Building className="mr-2 h-5 w-5 text-green-600" />
                  Office Information
                </CardTitle>
                <CardDescription className="text-green-600">
                  Basic office details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {selectedOffice.name}
                    </h3>
                    <p className="text-green-600 mt-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedOffice.address}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(selectedOffice)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                {selectedOffice.description && (
                  <p className="text-black mb-6 leading-relaxed">
                    {selectedOffice.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-md border border-green-200">
                    <div className="p-3 bg-green-100 rounded-md">
                      <User className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        Office Manager
                      </p>
                      <p className="font-semibold text-black">
                        {selectedOffice.manager.first_name}{" "}
                        {selectedOffice.manager.last_name}
                      </p>
                      <p className="text-sm text-green-600">
                        {selectedOffice.manager.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-md border border-green-200">
                    <div className="p-3 bg-green-100 rounded-md">
                      <Phone className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        Contact Information
                      </p>
                      <p className="font-semibold text-black">
                        {selectedOffice.contact_number}
                      </p>
                      <p className="text-sm text-green-600 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedOffice.email}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Office Metadata */}
          <div className="space-y-6">
            <Card className="border-green-200 shadow-sm">
              <CardHeader className="bg-green-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-green-600" />
                  Timeline
                </CardTitle>
                <CardDescription className="text-green-600">
                  Office history
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-green-50 rounded-md border border-green-200">
                  <p className="text-sm text-green-600 font-medium">Created</p>
                  <p className="font-semibold text-black">
                    {new Date(selectedOffice.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-md border border-green-200">
                  <p className="text-sm text-green-600 font-medium">
                    Last Updated
                  </p>
                  <p className="font-semibold text-black">
                    {new Date(selectedOffice.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {renderHeader()}

      {currentView === "list" && (
        <div className="p-6">
          <OfficeList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
          />
        </div>
      )}

      {(currentView === "create" || currentView === "edit") && (
        <OfficeForm
          office={
            currentView === "edit" ? selectedOffice || undefined : undefined
          }
          onSuccess={handleFormSuccess}
          onClose={handleCancel}
          isOpen={currentView === "create" || currentView === "edit"}
        />
      )}

      {currentView === "view" && renderOfficeDetails()}
    </div>
  );
}
