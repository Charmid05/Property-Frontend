"use client";

import React, { useState, useEffect } from "react";
import { Plus, Lock, FileText, TrendingUp } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { ActionButton } from "../components/ActionButton";
import { Modal } from "../components/Modal";
import { FormInput } from "../components/FormInput";
import {
  getBillingPeriods,
  createBillingPeriod,
  closeBillingPeriod,
  generateInvoices,
} from "@/app/api/finance";
import type {
  BillingPeriod,
  BillingPeriodCreateRequest,
} from "@/types/finance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BillingPeriodsPage() {
  const router = useRouter();
  const [periods, setPeriods] = useState<BillingPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<BillingPeriodCreateRequest>({
    name: "",
    period_type: "monthly",
    start_date: "",
    end_date: "",
    due_date: "",
    is_active: true,
  });

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    setIsLoading(true);
    try {
      const data = await getBillingPeriods();
      setPeriods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load billing periods:", error);
      toast.error("Failed to load billing periods");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBillingPeriod(formData);
      toast.success("Billing period created successfully");
      setShowCreateModal(false);
      setFormData({
        name: "",
        period_type: "monthly",
        start_date: "",
        end_date: "",
        due_date: "",
        is_active: true,
      });
      loadPeriods();
    } catch (error: any) {
      toast.error(error.message || "Failed to create billing period");
    }
  };

  const handleClose = async (period: BillingPeriod) => {
    if (
      !confirm(
        `Close billing period "${period.name}"? This action cannot be undone.`
      )
    )
      return;

    try {
      await closeBillingPeriod(period.id, { force: false });
      toast.success("Billing period closed successfully");
      loadPeriods();
    } catch (error: any) {
      toast.error(error.message || "Failed to close billing period");
    }
  };

  const handleGenerateInvoices = async (period: BillingPeriod) => {
    if (!confirm(`Generate invoices for "${period.name}"?`)) return;

    try {
      const result = await generateInvoices(period.id, {
        include_utilities: true,
        auto_send: false,
      });
      toast.success(`Generated ${result.invoices_created} invoices`);
      router.push("/admin/finance/invoices");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate invoices");
    }
  };
  type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  const handleChange = (e: React.ChangeEvent<FormElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const columns = [
    {
      header: "Name",
      accessor: "name" as keyof BillingPeriod,
      className: "font-medium",
    },
    {
      header: "Type",
      accessor: (row: BillingPeriod) => (
        <span className="capitalize">{row.period_type.replace("_", " ")}</span>
      ),
    },
    {
      header: "Start Date",
      accessor: (row: BillingPeriod) =>
        new Date(row.start_date).toLocaleDateString(),
    },
    {
      header: "End Date",
      accessor: (row: BillingPeriod) =>
        new Date(row.end_date).toLocaleDateString(),
    },
    {
      header: "Due Date",
      accessor: (row: BillingPeriod) =>
        new Date(row.due_date).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: (row: BillingPeriod) => (
        <div className="space-y-1">
          {row.is_current && (
            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
              CURRENT
            </span>
          )}
          {row.is_closed && (
            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-gray-600 text-white">
              CLOSED
            </span>
          )}
          {!row.is_closed && !row.is_current && row.is_active && (
            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-800 text-white">
              ACTIVE
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (row: BillingPeriod) => (
        <div className="flex gap-2">
          {!row.is_closed && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateInvoices(row);
                }}
                className="text-orange-500 hover:text-orange-600"
                title="Generate Invoices"
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose(row);
                }}
                className="text-gray-600 hover:text-gray-700"
                title="Close Period"
              >
                <Lock className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Billing Periods</h1>
          <p className="text-gray-600 mt-1">
            Manage billing cycles and generate invoices
          </p>
        </div>
        <ActionButton
          onClick={() => setShowCreateModal(true)}
          icon={Plus}
          variant="primary"
        >
          Create Period
        </ActionButton>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <DataTable
          data={periods}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(period) =>
            router.push(`/admin/finance/billing-periods/${period.id}`)
          }
          emptyMessage="No billing periods found"
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Billing Period"
      >
        <form onSubmit={handleCreate}>
          <FormInput
            label="Period Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., December 2024"
            required
          />

          <FormInput
            label="Period Type"
            name="period_type"
            value={formData.period_type}
            onChange={handleChange}
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
              { value: "semi_annual", label: "Semi-Annual" },
              { value: "annual", label: "Annual" },
              { value: "custom", label: "Custom" },
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />

            <FormInput
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <FormInput
            label="Due Date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />

          <div className="mt-6 flex justify-end gap-3">
            <ActionButton
              onClick={() => setShowCreateModal(false)}
              variant="secondary"
              type="button"
            >
              Cancel
            </ActionButton>
            <ActionButton onClick={() => {}} variant="primary" type="submit">
              Create Period
            </ActionButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
