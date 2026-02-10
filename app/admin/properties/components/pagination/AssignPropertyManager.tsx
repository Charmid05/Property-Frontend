"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserCheck } from "lucide-react";

import { Manager } from "@/types/property";
import { assignPropertyManager } from "@/app/api/properties/api";
import { getUsers } from "@/app/api/users/api";

interface AssignPropertyManagerProps {
  propertyIds: number[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignPropertyManager({
  propertyIds,
  open,
  onClose,
  onSuccess,
}: AssignPropertyManagerProps) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetchManagers = async () => {
      try {
        setLoading(true);
        setError("");

        const users = await getUsers();

        const managers = users.filter(
          (user) => user.role === "property_manager" && user.is_active,
        );

        setManagers(managers);
      } catch (err: any) {
        setError(err.message || "Failed to load managers");
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelectedManager(null);
      setManagers([]);
      setError("");
    }
  }, [open]);
  const handleAssign = async () => {
    if (!selectedManager) return;

    try {
      setSubmitting(true);
      setError("");

      await assignPropertyManager({
        property_ids: propertyIds,
        manager: selectedManager,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to assign manager");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-orange-500" />
            Assign Property Manager
          </DialogTitle>
          <DialogDescription>
            Assign a manager to {propertyIds.length} selected property
            {propertyIds.length > 1 ? "ies" : ""}.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : (
          <Select
            value={selectedManager?.toString()}
            onValueChange={(val) => setSelectedManager(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select manager" />
            </SelectTrigger>
            <SelectContent>
              {managers.map((manager) => (
                <SelectItem key={manager.id} value={manager.id.toString()}>
                  {manager.full_name} ({manager.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedManager || submitting}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign Manager
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
