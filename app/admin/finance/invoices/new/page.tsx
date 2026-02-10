"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { FormInput } from "../../components/FormInput";
import { ActionButton } from "../../components/ActionButton";
import { createInvoice } from "@/app/api/finance";
import { getTenants } from "@/app/api/tenant/api";
import { getBillingPeriods, getChargeTypes } from "@/app/api/finance";
import type {
  InvoiceCreateRequest,
  InvoiceItemCreateRequest,
} from "@/types/finance";
import { toast } from "sonner";

export default function CreateInvoicePage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<any[]>([]);
  const [periods, setPeriods] = useState<any[]>([]);
  const [chargeTypes, setChargeTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<InvoiceCreateRequest>({
    tenant: 0,
    billing_period: 0,
    due_date: "",
    issue_date: new Date().toISOString().split("T")[0],
    status: "draft",
    tax_amount: "0.00",
    notes: "",
    items: [],
  });

  const [currentItem, setCurrentItem] = useState<InvoiceItemCreateRequest>({
    charge_type: 0,
    description: "",
    quantity: "1.00",
    unit_price: "0.00",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tenantsData, periodsData, typesData] = await Promise.all([
        getTenants(),
        getBillingPeriods(),
        getChargeTypes(),
      ]);

      setTenants(
        Array.isArray(tenantsData) ? tenantsData : tenantsData?.results || []
      );
      setPeriods(Array.isArray(periodsData) ? periodsData : []);
      setChargeTypes(Array.isArray(typesData) ? typesData : []);

      // Show info toast if backend data is missing
      if (!periodsData || (Array.isArray(periodsData) && periodsData.length === 0)) {
        toast.info("Using default billing periods. Configure billing periods in Settings.");
      }
      if (!typesData || (Array.isArray(typesData) && typesData.length === 0)) {
        toast.info("Using default charge types. Configure charge types in Settings.");
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load form data");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "tenant" || name === "billing_period"
          ? parseInt(value)
          : value,
    }));
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: name === "charge_type" ? parseInt(value) : value,
    }));
  };

  const addItem = () => {
    if (
      !currentItem.charge_type ||
      !currentItem.description ||
      !currentItem.unit_price
    ) {
      toast.error("Please fill in all item fields");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), currentItem],
    }));

    setCurrentItem({
      charge_type: 0,
      description: "",
      quantity: "1.00",
      unit_price: "0.00",
    });
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index) || [],
    }));
  };

  const calculateSubtotal = () => {
    return (formData.items || []).reduce((sum, item) => {
      const lineTotal = parseFloat(item.quantity) * parseFloat(item.unit_price);
      return sum + lineTotal;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = parseFloat(formData.tax_amount || "0");
    return subtotal + tax;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenant || !formData.billing_period) {
      toast.error("Please select tenant and billing period");
      return;
    }

    if (!formData.items || formData.items.length === 0) {
      toast.error("Please add at least one line item");
      return;
    }

    setIsLoading(true);
    try {
      const invoice = await createInvoice(formData);
      toast.success("Invoice created successfully");
      router.push(`/admin/finance/invoices/${invoice.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Invoices
      </button>

      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-black mb-2">Create Invoice</h1>
        <p className="text-gray-600 mb-6">
          Generate a new invoice for a tenant
        </p>

        <form onSubmit={handleSubmit}>
          {/* Invoice Details */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-black mb-4">
              Invoice Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Tenant"
                name="tenant"
                value={formData.tenant}
                onChange={handleChange}
                options={tenants.map((t) => ({
                  value: t.id.toString(),
                  label: t.user
                    ? `${t.user.first_name} ${t.user.last_name} - Unit ${
                        t.unit?.unit_number || ""
                      }`
                    : `Tenant ${t.id}`,
                }))}
                required
              />

              <FormInput
                label="Billing Period"
                name="billing_period"
                value={formData.billing_period}
                onChange={handleChange}
                options={
                  periods.length > 0
                    ? periods.map((p) => ({
                        value: p.id.toString(),
                        label: p.name,
                      }))
                    : [
                        { value: "0", label: "Select a billing period" },
                        { value: "monthly", label: "Monthly" },
                        { value: "quarterly", label: "Quarterly" },
                        { value: "yearly", label: "Yearly" },
                      ]
                }
                required
              />

              <FormInput
                label="Issue Date"
                name="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Due Date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Tax Amount"
                name="tax_amount"
                type="number"
                value={formData.tax_amount}
                onChange={handleChange}
                placeholder="0.00"
              />

              <FormInput
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "sent", label: "Sent" },
                ]}
              />
            </div>

            <FormInput
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              textarea
              rows={3}
              placeholder="Additional notes or instructions..."
            />
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-black mb-4">
              Line Items
            </h2>

            {/* Add Item Form */}
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="grid grid-cols-5 gap-3 items-end">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">
                    Charge Type
                  </label>
                  <select
                    name="charge_type"
                    value={currentItem.charge_type}
                    onChange={handleItemChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-black"
                  >
                    <option value={0}>Select type</option>
                    {chargeTypes.length > 0 ? (
                      chargeTypes.map((ct) => (
                        <option key={ct.id} value={ct.id}>
                          {ct.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="rent">Rent</option>
                        <option value="water">Water</option>
                        <option value="electricity">Electricity</option>
                        <option value="gas">Gas</option>
                        <option value="internet">Internet</option>
                        <option value="parking">Parking</option>
                        <option value="maintenance">Maintenance Fee</option>
                        <option value="late_fee">Late Fee</option>
                        <option value="security">Security Deposit</option>
                        <option value="cleaning">Cleaning Fee</option>
                        <option value="garbage">Garbage Collection</option>
                        <option value="sewage">Sewage</option>
                        <option value="hvac">HVAC</option>
                        <option value="other">Other</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={currentItem.description}
                    onChange={handleItemChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-black"
                    placeholder="Item description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={currentItem.quantity}
                    onChange={handleItemChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-black"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    name="unit_price"
                    value={currentItem.unit_price}
                    onChange={handleItemChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-black"
                    step="0.01"
                  />
                </div>

                <ActionButton
                  onClick={addItem}
                  icon={Plus}
                  variant="secondary"
                  type="button"
                  size="sm"
                >
                  Add
                </ActionButton>
              </div>
            </div>

            {/* Items Table */}
            {formData.items && formData.items.length > 0 ? (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                      Description
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">
                      Price
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">
                      Total
                    </th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-black">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-black">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-black">
                        ${item.unit_price}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-black">
                        $
                        {(
                          parseFloat(item.quantity) *
                          parseFloat(item.unit_price)
                        ).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-right text-sm font-medium text-gray-700"
                    >
                      Subtotal:
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-black">
                      ${calculateSubtotal().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-right text-sm font-medium text-gray-700"
                    >
                      Tax:
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-black">
                      ${parseFloat(formData.tax_amount || "0").toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                  <tr className="border-t-2 border-gray-300">
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-right text-sm font-bold text-gray-900"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-3 text-right text-lg font-bold text-orange-500">
                      ${calculateTotal().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No items added yet. Use the form above to add line items.</p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <ActionButton
              onClick={() => router.back()}
              variant="secondary"
              type="button"
              disabled={isLoading}
            >
              Cancel
            </ActionButton>
            <ActionButton
              onClick={() => {}}
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Invoice"}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
