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
  Building,
  MapPin,
  User,
  Calendar,
  TrendingUp,
  Edit,
  X,
} from "lucide-react";
import { Property } from "@/types/property";
import AssignPropertyManager from "./AssignPropertyManager";

interface PropertyDetailsProps {
  property: Property;
  onEdit: (property: Property) => void;
  onCancel: () => void;
  userRole: "admin" | "property_manager";
}

export default function PropertyDetails({
  property,
  onEdit,
  onCancel,
  userRole,
}: PropertyDetailsProps) {
  const [assignOpen, setAssignOpen] = useState(false);

  // Property managers can only view, not edit or assign managers
  const canEdit = userRole === "admin";
  const canAssignManager = userRole === "admin";

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-6 z-10 sticky top-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Property Details</h2>
            <p className="text-gray-600 mt-1">View property information</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Property Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <Building className="mr-2 h-5 w-5 text-orange-500" />
                  Property Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Basic property details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {property.name}
                    </h3>
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      {property.address}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge
                      variant={property.is_active ? "default" : "secondary"}
                      className={
                        property.is_active
                          ? "bg-orange-100 text-orange-500 border-orange-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }
                    >
                      {property.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {canEdit && (
                      <Button
                        size="sm"
                        onClick={() => onEdit(property)}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}

                    {canAssignManager && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAssignOpen(true)}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Assign Manager
                      </Button>
                    )}
                  </div>
                </div>

                {property.description && (
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {property.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-md border border-orange-200">
                    <div className="p-3 bg-orange-100 rounded-md">
                      <User className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Property Manager
                      </p>

                      {property.manager ? (
                        <>
                          <p className="font-semibold text-black">
                            {property.manager.full_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {property.manager.email}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm italic text-gray-500">
                          No manager assigned
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-md border border-orange-200">
                    <div className="p-3 bg-orange-100 rounded-md">
                      <Building className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Office
                      </p>
                      {property.office ? (
                        <>
                          <p className="font-semibold text-black">
                            {property.office.name}
                          </p>
                          {/* <p className="text-sm text-gray-600">
                            {property.office.location}
                          </p> */}
                        </>
                      ) : (
                        <p className="text-sm italic text-gray-500">
                          No office assigned
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-800" />
                  Property Statistics
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Key property metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-md border border-green-200">
                    <p className="text-2xl font-semibold text-black mb-2">
                      {property.total_units}
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      Total Units
                    </p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-md border border-green-200">
                    <p className="text-2xl font-semibold text-black mb-2">
                      {property.occupied_units_count}
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      Occupied Units
                    </p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-md border border-green-200">
                    <p className="text-2xl font-semibold text-black mb-2">
                      {property.vacancy_rate}%
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      Vacancy Rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Image & Metadata */}
          <div className="space-y-6">
            {property.picture_url && (
              <Card className="border-gray-200 shadow-sm bg-white">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-lg font-semibold text-black flex items-center">
                    <Building className="mr-2 h-5 w-5 text-orange-500" />
                    Property Image
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Property visual
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <img
                    src={property.picture_url}
                    alt={property.name}
                    className="w-full h-48 object-cover rounded-md border border-gray-200"
                  />
                </CardContent>
              </Card>
            )}

            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                  Timeline
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Property history
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">Created</p>
                  <p className="font-semibold text-black">
                    {new Date(property.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">
                    Last Updated
                  </p>
                  <p className="font-semibold text-black">
                    {new Date(property.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {canAssignManager && assignOpen && (
        <AssignPropertyManager
          propertyIds={[property.id]}
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          onSuccess={() => {
            setAssignOpen(false);
            // Optionally refresh the property data
          }}
        />
      )}
    </>
  );
}
