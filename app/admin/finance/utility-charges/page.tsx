"use client";

import React, { useState, useEffect } from 'react';
import { Plus, FileText, Eye, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { ActionButton } from '../components/ActionButton';
import { Modal } from '../components/Modal';
import { FormInput } from '../components/FormInput';
import {
  getUtilityCharges,
  createUtilityCharge,
  bulkBillUtilityCharges,
  deleteUtilityCharge
} from '@/app/api/finance';
import { getTenants } from '@/app/api/tenant/api';
import { getBillingPeriods } from '@/app/api/finance';
import type { UtilityCharge, UtilityChargeCreateRequest } from '@/types/finance';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function UtilityChargesPage() {
  const router = useRouter();
  const [charges, setCharges] = useState<UtilityCharge[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [periods, setPeriods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [billedFilter, setBilledFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<UtilityCharge | null>(null);

  const [formData, setFormData] = useState<UtilityChargeCreateRequest>({
    tenant: 0,
    utility_type: 'Electricity',
    billing_period: 0,
    amount: '',
    description: '',
    reference_number: ''
  });

  useEffect(() => {
    loadData();
  }, [typeFilter, billedFilter, periodFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [chargesData, tenantsData, periodsData] = await Promise.all([
        getUtilityCharges({
          utility_type: typeFilter || undefined,
          is_billed: billedFilter ? billedFilter === 'true' : undefined,
          billing_period: periodFilter ? parseInt(periodFilter) : undefined
        }),
        getTenants(),
        getBillingPeriods()
      ]);

      setCharges(Array.isArray(chargesData) ? chargesData : []);
      setTenants(Array.isArray(tenantsData) ? tenantsData : tenantsData?.results || []);
      setPeriods(Array.isArray(periodsData) ? periodsData : []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load utility charges");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUtilityCharge(formData);
      toast.success("Utility charge created successfully");
      setShowCreateModal(false);
      setFormData({
        tenant: 0,
        utility_type: 'Electricity',
        billing_period: 0,
        amount: '',
        description: '',
        reference_number: ''
      });
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create utility charge");
    }
  };

  const handleBulkBill = async () => {
    const unbilled = charges.filter(c => !c.is_billed);
    if (unbilled.length === 0) {
      toast.error("No unbilled charges to process");
      return;
    }

    if (!periodFilter) {
      toast.error("Please select a billing period to bill charges");
      return;
    }

    if (!confirm(`Bill ${unbilled.length} utility charges?`)) return;

    try {
      const result = await bulkBillUtilityCharges({
        billing_period_id: parseInt(periodFilter)
      });
      toast.success(`Billed ${result.charges_billed} charges`);
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to bill charges");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this utility charge?")) return;

    try {
      await deleteUtilityCharge(id);
      toast.success("Utility charge deleted successfully");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete utility charge");
    }
  };

  const handleView = (charge: UtilityCharge) => {
    setSelectedCharge(charge);
    setShowViewModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tenant' || name === 'billing_period' ? parseInt(value) : value
    }));
  };

  const handleReset = () => {
    setSearchTerm('');
    setTypeFilter('');
    setBilledFilter('');
    setPeriodFilter('');
  };

  const columns = [
    {
      header: 'Type',
      accessor: (row: UtilityCharge) => (
        <span className="font-medium">{row.utility_type}</span>
      )
    },
    {
      header: 'Amount',
      accessor: (row: UtilityCharge) => (
        <span className="font-semibold">${row.amount}</span>
      )
    },
    {
      header: 'Description',
      accessor: 'description' as keyof UtilityCharge
    },
    {
      header: 'Reference',
      accessor: 'reference_number' as keyof UtilityCharge
    },
    {
      header: 'Status',
      accessor: (row: UtilityCharge) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.is_billed
          ? 'bg-green-800 text-white'
          : 'bg-orange-500 text-white'
          }`}>
          {row.is_billed ? 'BILLED' : 'UNBILLED'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (row: UtilityCharge) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(row);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Charge"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Utility Charges</h1>
          <p className="text-gray-600 mt-1">Manage utility bills and charges</p>
        </div>
        <div className="flex gap-2">
          {charges.some(c => !c.is_billed) && (
            <ActionButton
              onClick={handleBulkBill}
              icon={FileText}
              variant="secondary"
            >
              Bill Unbilled Charges
            </ActionButton>
          )}
          <ActionButton
            onClick={() => setShowCreateModal(true)}
            icon={Plus}
            variant="primary"
          >
            Add Charge
          </ActionButton>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            name: 'type',
            label: 'All Types',
            value: typeFilter,
            options: [
              { value: 'Electricity', label: 'Electricity' },
              { value: 'Water', label: 'Water' },
              { value: 'Gas', label: 'Gas' },
              { value: 'Internet', label: 'Internet' },
              { value: 'Garbage Collection', label: 'Garbage Collection' },
              { value: 'Security', label: 'Security' },
              { value: 'Other', label: 'Other' }
            ],
            onChange: setTypeFilter
          },
          {
            name: 'period',
            label: 'Billing Period',
            value: periodFilter,
            options: periods.map(p => ({
              value: p.id.toString(),
              label: p.name
            })),
            onChange: setPeriodFilter
          },
          {
            name: 'billed',
            label: 'Billing Status',
            value: billedFilter,
            options: [
              { value: 'false', label: 'Unbilled' },
              { value: 'true', label: 'Billed' }
            ],
            onChange: setBilledFilter
          }
        ]}
        onReset={handleReset}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <DataTable
          data={charges}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No utility charges found"
        />
      </div>

      {/* Summary */}
      {!isLoading && charges.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Charges</p>
              <p className="text-xl font-bold text-black">{charges.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unbilled</p>
              <p className="text-xl font-bold text-orange-500">
                {charges.filter(c => !c.is_billed).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-black">
                ${charges.reduce((sum, c) => sum + parseFloat(c.amount), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Utility Charge"
      >
        <form onSubmit={handleCreate}>
          <FormInput
            label="Tenant"
            name="tenant"
            value={formData.tenant}
            onChange={handleChange}
            options={tenants.map(t => ({
              value: t.id.toString(),
              label: t.user ? `${t.user.first_name} ${t.user.last_name}` : `Tenant ${t.id}`
            }))}
            required
          />

          <FormInput
            label="Billing Period"
            name="billing_period"
            value={formData.billing_period}
            onChange={handleChange}
            options={periods.map(p => ({
              value: p.id.toString(),
              label: p.name
            }))}
            required
          />

          <FormInput
            label="Utility Type"
            name="utility_type"
            value={formData.utility_type}
            onChange={handleChange}
            options={[
              { value: 'Electricity', label: 'Electricity' },
              { value: 'Water', label: 'Water' },
              { value: 'Gas', label: 'Gas' },
              { value: 'Internet', label: 'Internet' },
              { value: 'Garbage Collection', label: 'Garbage Collection' },
              { value: 'Sewer', label: 'Sewer' },
              { value: 'Security', label: 'Security' },
              { value: 'Cleaning', label: 'Cleaning' },
              { value: 'Parking', label: 'Parking' },
              { value: 'Deposit', label: 'Deposit' },
              { value: 'Other', label: 'Other' }
            ]}
            required
          />

          <FormInput
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., November electricity bill"
          />

          <FormInput
            label="Reference Number"
            name="reference_number"
            value={formData.reference_number}
            onChange={handleChange}
            placeholder="e.g., ELEC-2024-11-001"
          />

          <div className="mt-6 flex justify-end gap-3">
            <ActionButton
              onClick={() => setShowCreateModal(false)}
              variant="secondary"
              type="button"
            >
              Cancel
            </ActionButton>
            <ActionButton
              onClick={() => { }}
              variant="primary"
              type="submit"
            >
              Add Charge
            </ActionButton>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Utility Charge Details"
      >
        {selectedCharge && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Type</p>
                <p className="text-sm font-medium">{selectedCharge.utility_type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Amount</p>
                <p className="text-sm font-bold text-orange-600">${selectedCharge.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Tenant</p>
                <p className="text-sm">
                  {tenants.find(t => t.id === selectedCharge.tenant)?.user
                    ? `${tenants.find(t => t.id === selectedCharge.tenant).user.first_name} ${tenants.find(t => t.id === selectedCharge.tenant).user.last_name}`
                    : `Tenant #${selectedCharge.tenant}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Billing Period</p>
                <p className="text-sm">
                  {periods.find(p => p.id === selectedCharge.billing_period)?.name || `Period #${selectedCharge.billing_period}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Reference</p>
                <p className="text-sm font-mono">{selectedCharge.reference_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedCharge.is_billed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                  {selectedCharge.is_billed ? 'BILLED' : 'UNBILLED'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Description</p>
              <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-100 italic">
                {selectedCharge.description || 'No description provided.'}
              </p>
            </div>
            {/* Removed warning about billed charges deletion */}
            <div className="mt-6 flex justify-end">
              <ActionButton
                onClick={() => setShowViewModal(false)}
                variant="secondary"
              >
                Close
              </ActionButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}