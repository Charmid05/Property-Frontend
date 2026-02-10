"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  X,
  Plus,
  Trash2,
  DollarSign,
  Download,
} from "lucide-react";
import { ActionButton } from "../../components/ActionButton";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { FormInput } from "../../components/FormInput";
import {
  getInvoiceById,
  sendInvoice,
  cancelInvoice,
  addChargeToInvoice,
  removeChargeFromInvoice,
  getInvoicePaymentHistory,
} from "@/app/api/finance";
import { getChargeTypes } from "@/app/api/finance";
import type {
  InvoiceDetail,
  ChargeType,
  AddChargeRequest,
} from "@/types/finance";
import { toast } from "sonner";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = parseInt(params.id as string);

  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [chargeTypes, setChargeTypes] = useState<ChargeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddChargeModal, setShowAddChargeModal] = useState(false);
  const [newCharge, setNewCharge] = useState<AddChargeRequest>({
    charge_type: 0,
    description: "",
    quantity: "1.00",
    unit_price: "0.00",
  });

  useEffect(() => {
    loadInvoice();
    loadChargeTypes();
  }, [invoiceId]);

  const loadInvoice = async () => {
    setIsLoading(true);
    try {
      const data = await getInvoiceById(invoiceId);
      setInvoice(data);
    } catch (error) {
      console.error("Failed to load invoice:", error);
      toast.error("Failed to load invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const loadChargeTypes = async () => {
    try {
      const data = await getChargeTypes();
      setChargeTypes(data);
    } catch (error) {
      console.error("Failed to load charge types:", error);
    }
  };

  const handleSend = async () => {
    try {
      await sendInvoice(invoiceId);
      toast.success("Invoice sent successfully");
      loadInvoice();
    } catch (error: any) {
      toast.error(error.message || "Failed to send invoice");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this invoice?")) return;

    try {
      await cancelInvoice(invoiceId);
      toast.success("Invoice cancelled");
      loadInvoice();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel invoice");
    }
  };

  const handleAddCharge = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addChargeToInvoice(invoiceId, newCharge);
      toast.success("Charge added successfully");
      setShowAddChargeModal(false);
      setNewCharge({
        charge_type: 0,
        description: "",
        quantity: "1.00",
        unit_price: "0.00",
      });
      loadInvoice();
    } catch (error: any) {
      toast.error(error.message || "Failed to add charge");
    }
  };

  const handleRemoveCharge = async (itemId: number) => {
    if (!confirm("Remove this charge from the invoice?")) return;

    try {
      await removeChargeFromInvoice(invoiceId, { item_id: itemId });
      toast.success("Charge removed");
      loadInvoice();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove charge");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!invoice) {
    return <div className="p-6 text-center">Invoice not found</div>;
  }

  const canEdit = invoice.status === "draft" || invoice.status === "sent";

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-black">
              {invoice.invoice_number}
            </h1>
            <p className="text-gray-600 mt-1">Invoice Details</p>
          </div>
          <div className="flex gap-2">
            {invoice.status === "draft" && (
              <ActionButton onClick={handleSend} icon={Send} variant="success">
                Send Invoice
              </ActionButton>
            )}
            {(invoice.status === "sent" || invoice.status === "partial") && (
              <ActionButton
                onClick={() =>
                  router.push(`/admin/finance/payments/new?invoice_id=${invoiceId}`)
                }
                icon={DollarSign}
                variant="primary"
              >
                Apply Payment
              </ActionButton>
            )}
            {canEdit && (
              <ActionButton onClick={handleCancel} icon={X} variant="danger">
                Cancel
              </ActionButton>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Info */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">
              Invoice Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge status={invoice.status} type="invoice" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="text-black">
                  {new Date(invoice.issue_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="text-black">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </p>
              </div>
              {invoice.is_overdue && (
                <div>
                  <p className="text-sm text-gray-600">Days Overdue</p>
                  <p className="text-red-600 font-semibold">
                    {invoice.days_overdue} days
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">Line Items</h2>
              {canEdit && (
                <ActionButton
                  onClick={() => setShowAddChargeModal(true)}
                  icon={Plus}
                  variant="secondary"
                  size="sm"
                >
                  Add Charge
                </ActionButton>
              )}
            </div>

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
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">
                    Total
                  </th>
                  {canEdit && <th className="px-4 py-2"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
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
                      ${item.line_total}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemoveCharge(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
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
                    ${invoice.subtotal}
                  </td>
                  {canEdit && <td></td>}
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-right text-sm font-medium text-gray-700"
                  >
                    Tax:
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-black">
                    ${invoice.tax_amount}
                  </td>
                  {canEdit && <td></td>}
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-right text-sm font-bold text-gray-900"
                  >
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-orange-500">
                    ${invoice.total_amount}
                  </td>
                  {canEdit && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment History */}
          {invoice.receipts && invoice.receipts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-black mb-4">
                Payment History
              </h2>
              <div className="space-y-3">
                {invoice.receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-black">
                        {receipt.receipt_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(receipt.payment_date).toLocaleDateString()} •{" "}
                        {receipt.payment_method}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-green-800">
                      ${receipt.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-black">
                  ${invoice.total_amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-green-800">
                  ${invoice.amount_paid}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-900">
                  Balance Due:
                </span>
                <span className="text-xl font-bold text-orange-500">
                  ${invoice.balance_due}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-black mb-4">Notes</h2>
              <p className="text-gray-700 text-sm">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Charge Modal */}
      <Modal
        isOpen={showAddChargeModal}
        onClose={() => setShowAddChargeModal(false)}
        title="Add Charge to Invoice"
      >
        <form onSubmit={handleAddCharge}>
          <FormInput
            label="Charge Type"
            name="charge_type"
            value={newCharge.charge_type}
            onChange={(e) =>
              setNewCharge({
                ...newCharge,
                charge_type: parseInt(e.target.value),
              })
            }
            options={chargeTypes.map((ct) => ({
              value: ct.id.toString(),
              label: ct.name,
            }))}
            required
          />

          <FormInput
            label="Description"
            name="description"
            value={newCharge.description}
            onChange={(e) =>
              setNewCharge({ ...newCharge, description: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Quantity"
              name="quantity"
              type="number"
              value={newCharge.quantity}
              onChange={(e) =>
                setNewCharge({ ...newCharge, quantity: e.target.value })
              }
              required
            />

            <FormInput
              label="Unit Price"
              name="unit_price"
              type="number"
              value={newCharge.unit_price}
              onChange={(e) =>
                setNewCharge({ ...newCharge, unit_price: e.target.value })
              }
              required
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <ActionButton
              onClick={() => setShowAddChargeModal(false)}
              variant="secondary"
              type="button"
            >
              Cancel
            </ActionButton>
            <ActionButton onClick={() => {}} variant="primary" type="submit">
              Add Charge
            </ActionButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
