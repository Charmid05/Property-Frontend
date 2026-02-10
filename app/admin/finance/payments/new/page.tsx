"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { FormInput } from '../../components/FormInput';
import { ActionButton } from '../../components/ActionButton';
import { quickPayment } from '@/app/api/finance';
import { getTenants } from '@/app/api/tenant/api';
import { getInvoiceById } from '@/app/api/finance';
import type { QuickPaymentRequest } from '@/types/finance';
import { toast } from 'sonner';

export default function NewPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceIdParam = searchParams.get('invoice_id');
  
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceInfo, setInvoiceInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState<QuickPaymentRequest>({
    tenant_id: 0,
    invoice_id: invoiceIdParam ? parseInt(invoiceIdParam) : undefined,
    amount: '',
    payment_method: 'bank_transfer',
    reference_number: '',
    notes: ''
  });

  useEffect(() => {
    loadTenants();
    if (invoiceIdParam) {
      loadInvoice(parseInt(invoiceIdParam));
    }
  }, [invoiceIdParam]);

  const loadTenants = async () => {
    try {
      const response = await getTenants();
      if (Array.isArray(response)) {
        setTenants(response);
      } else if (response?.results) {
        setTenants(response.results);
      }
    } catch (error) {
      console.error("Failed to load tenants:", error);
      toast.error("Failed to load tenants");
    }
  };

  const loadInvoice = async (id: number) => {
    try {
      const invoice = await getInvoiceById(id);
      setInvoiceInfo(invoice);
      setFormData(prev => ({
        ...prev,
        tenant_id: invoice.tenant,
        amount: invoice.balance_due
      }));
    } catch (error) {
      console.error("Failed to load invoice:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tenant_id) {
      toast.error("Please select a tenant");
      return;
    }

    if (!formData.invoice_id && !formData.amount) {
      toast.error("Please enter an amount or select an invoice");
      return;
    }

    setIsLoading(true);
    try {
      const result = await quickPayment({
        ...formData,
        amount: formData.amount || undefined
      });

      toast.success(`Payment processed! Receipt: ${result.receipt.receipt_number}`);
      router.push(`/admin/finance/receipts/${result.receipt.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tenant_id' || name === 'invoice_id' ? parseInt(value) : value
    }));
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-black mb-2">Record Payment</h1>
        <p className="text-gray-600 mb-6">Process a new payment for a tenant or invoice</p>

        {invoiceInfo && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-black mb-2">Invoice Details</h3>
            <p className="text-sm text-gray-700">Invoice: {invoiceInfo.invoice_number}</p>
            <p className="text-sm text-gray-700">Total: ${invoiceInfo.total_amount}</p>
            <p className="text-sm text-gray-700">Paid: ${invoiceInfo.amount_paid}</p>
            <p className="text-sm font-semibold text-orange-500">Balance Due: ${invoiceInfo.balance_due}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <FormInput
            label="Tenant"
            name="tenant_id"
            value={formData.tenant_id}
            onChange={handleChange}
            options={tenants.map(t => ({
              value: t.id.toString(),
              label: t.user ? `${t.user.first_name} ${t.user.last_name}` : `Tenant ${t.id}`
            }))}
            required
            disabled={!!invoiceIdParam}
          />

          <FormInput
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder={invoiceInfo ? "Leave empty to pay full balance" : "Enter amount"}
          />

          <FormInput
            label="Payment Method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            options={[
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'mobile_money', label: 'Mobile Money' },
              { value: 'cash', label: 'Cash' },
              { value: 'card', label: 'Card' },
              { value: 'check', label: 'Check' },
              { value: 'other', label: 'Other' }
            ]}
            required
          />

          <FormInput
            label="Reference Number"
            name="reference_number"
            value={formData.reference_number}
            onChange={handleChange}
            placeholder="e.g., TRX-12345, MPESA-ABC123"
          />

          <FormInput
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            textarea
            rows={3}
            placeholder="Additional payment information..."
          />

          <div className="mt-6 flex justify-end gap-3">
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
              {isLoading ? 'Processing...' : 'Process Payment'}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
