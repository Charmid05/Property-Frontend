"use client";
import React, { useState } from "react";
import { Property } from "@/types/property";
import PropertyList from "../pagination/PropertyList";
import PropertyForm from "../pagination/PropertyForm";
import PropertyDetails from "../pagination/PropertyDetails";

type View = "list" | "create" | "edit" | "view";

interface PropertiesPageContainerProps {
  userRole: "admin" | "property_manager";
}

export default function PropertiesPageContainer({
  userRole,
}: PropertiesPageContainerProps) {
  const [currentView, setCurrentView] = useState<View>("list");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const handleCreateNew = () => {
    setSelectedProperty(null);
    setCurrentView("create");
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView("edit");
  };

  const handleView = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView("view");
  };

  const handleFormSuccess = (property: Property) => {
    setCurrentView("list");
    setSelectedProperty(null);
  };

  const handleCancel = () => {
    setCurrentView("list");
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentView === "list" && (
        <PropertyList
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onView={handleView}
          userRole={userRole}
        />
      )}

      {(currentView === "create" || currentView === "edit") && (
        <PropertyForm
          property={
            currentView === "edit" ? selectedProperty || undefined : undefined
          }
          onSuccess={handleFormSuccess}
          onClose={handleCancel}
          isOpen={currentView === "create" || currentView === "edit"}
          userRole={userRole}
        />
      )}

      {currentView === "view" && selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onEdit={handleEdit}
          onCancel={handleCancel}
          userRole={userRole}
        />
      )}
    </div>
  );
}
