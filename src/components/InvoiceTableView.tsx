import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  Check,
  ChevronRight,
  ChevronLeft,
  FileText,
  Eye,
} from 'lucide-react';
import { DocumentItem, InvoiceStatus } from '../types';

interface InvoiceTableViewProps {
  invoices: DocumentItem[];
  selectedInvoice: DocumentItem;
  onSelectInvoice: (invoice: DocumentItem) => void;
  onOpenUpload: () => void;
  onOpenViewer: (invoice: DocumentItem) => void;
}

export const InvoiceTableView: React.FC<InvoiceTableViewProps> = ({
  invoices,
  selectedInvoice,
  onSelectInvoice,
  onOpenUpload,
  onOpenViewer,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending Review' | 'Exceptions' | 'Matched' | 'Approved' | 'Paid'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    // Tab filter
    if (activeTab === 'Pending Review' && inv.status !== 'Pending') return false;
    if (activeTab === 'Exceptions' && inv.status !== 'Exception') return false;
    if (activeTab === 'Matched' && inv.status !== 'Matched') return false;
    if (activeTab === 'Approved' && inv.status !== 'Approved') return false;
    if (activeTab === 'Paid' && inv.status !== 'Paid') return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.vendorName.toLowerCase().includes(q) ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.fileName.toLowerCase().includes(q) ||
      (inv.poReference && inv.poReference.toLowerCase().includes(q)) ||
      (inv.suggestedPo && inv.suggestedPo.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (inv: DocumentItem) => {
    switch (inv.status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending</span>
          </span>
        );
      case 'Exception':
        return (
          <div className="space-y-0.5">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              <span>Exception</span>
            </span>
            {inv.exceptionReason && (
              <p className="text-[11px] text-rose-600 max-w-xs leading-tight">
                {inv.exceptionReason}
              </p>
            )}
          </div>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case 'Matched':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
            <Check className="w-3 h-3 text-violet-600" />
            <span>Matched</span>
          </span>
        );
      case 'Paid':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span>Paid</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <span>Invoices</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage and process incoming vendor invoices.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-violet-200 flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Invoice</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Navigation Filter Tabs Bar */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none bg-slate-200/60 p-1 rounded-xl">
            {(['All', 'Pending Review', 'Exceptions', 'Matched', 'Approved', 'Paid'] as const).map(
              (tab) => {
                const count = invoices.filter((i) => {
                  if (tab === 'All') return true;
                  if (tab === 'Pending Review') return i.status === 'Pending';
                  if (tab === 'Exceptions') return i.status === 'Exception';
                  if (tab === 'Matched') return i.status === 'Matched';
                  if (tab === 'Approved') return i.status === 'Approved';
                  if (tab === 'Paid') return i.status === 'Paid';
                  return false;
                }).length;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        tab === 'Exceptions' && count > 0
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor, invoice #, PO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500 font-semibold border-b border-slate-200 bg-white">
                <th className="py-3.5 pl-6 pr-4">Vendor</th>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">PO Reference</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 pl-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredInvoices.map((inv) => {
                const isSelected = selectedInvoice.id === inv.id;
                return (
                  <tr
                    key={inv.id}
                    onClick={() => {
                      onSelectInvoice(inv);
                      onOpenViewer(inv);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-violet-50/50' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Vendor Name + File */}
                    <td className="py-4 pl-6 pr-4">
                      <div className="font-semibold text-slate-900 text-sm">{inv.vendorName}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {inv.fileName}
                      </div>
                    </td>

                    {/* Invoice Number */}
                    <td className="py-4 px-4 font-mono font-semibold text-slate-800">
                      {inv.invoiceNumber}
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-4 text-slate-600 space-y-0.5">
                      <div>
                        <span className="text-slate-400 text-[11px]">Inv: </span>
                        <span className="font-mono">{inv.invoiceDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px]">Due: </span>
                        <span className="font-mono">{inv.dueDate}</span>
                      </div>
                    </td>

                    {/* PO Reference */}
                    <td className="py-4 px-4 text-slate-700">
                      {inv.poReference ? (
                        <span className="font-mono font-medium text-slate-900">{inv.poReference}</span>
                      ) : inv.suggestedPo ? (
                        <span className="text-slate-500 italic">
                          Suggested: <span className="font-mono text-slate-700 not-italic font-medium">{inv.suggestedPo}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 pl-4 pr-6">
                      <div className="flex items-center justify-between">
                        {getStatusBadge(inv)}
                        <ChevronRight className="w-4 h-4 text-slate-300 ml-2" />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    No invoices found matching current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredInvoices.length}</strong> of{' '}
            <strong className="text-slate-800">{invoices.length}</strong> invoices
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
