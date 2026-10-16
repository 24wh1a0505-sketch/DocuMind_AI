import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  Edit2,
  Save,
  Check,
  X,
  Sparkles,
  ArrowLeft,
  Search,
  MessageSquare,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { DocumentItem, ExtractedField, LineItem } from '../types';

interface DocumentSplitViewerProps {
  invoice: DocumentItem;
  allInvoices: DocumentItem[];
  onSelectInvoice: (invoice: DocumentItem) => void;
  onUpdateField: (invoiceId: string, fieldId: string, newValue: string) => void;
  onApproveInvoice: (invoiceId: string) => void;
  onFlagInvoice: (invoiceId: string, reason: string) => void;
  onBackToList: () => void;
  onOpenAssistant: (invoice: DocumentItem) => void;
}

export const DocumentSplitViewer: React.FC<DocumentSplitViewerProps> = ({
  invoice,
  allInvoices,
  onSelectInvoice,
  onUpdateField,
  onApproveInvoice,
  onFlagInvoice,
  onBackToList,
  onOpenAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'lineItems' | 'matching'>('fields');
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
  };

  const handleSaveEdit = (fieldId: string) => {
    onUpdateField(invoice.id, fieldId, editValue);
    setEditingFieldId(null);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header Bar matching Screenshot 2 & 8 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToList}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Back to Invoices list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <label htmlFor="viewer-doc-select" className="sr-only">Select Document</label>
              <select
                id="viewer-doc-select"
                value={invoice.id}
                onChange={(e) => {
                  const found = allInvoices.find((i) => i.id === e.target.value);
                  if (found) onSelectInvoice(found);
                }}
                className="font-bold text-slate-900 text-sm bg-transparent border-0 focus:ring-0 cursor-pointer p-0"
              >
                {allInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.vendorName} — {inv.invoiceNumber} (${inv.amount})
                  </option>
                ))}
              </select>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  invoice.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : invoice.status === 'Exception'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {invoice.fileName} • {invoice.fileSize} • AI Confidence: {invoice.aiAccuracyScore}%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 self-end md:self-center">
          <button
            onClick={() => onOpenAssistant(invoice)}
            className="px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold border border-violet-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>Ask AI Assistant</span>
          </button>

          {invoice.status !== 'Approved' && (
            <button
              onClick={() => onApproveInvoice(invoice.id)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm shadow-violet-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Approve Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split-Screen Grid (Matching Screenshot 2 & 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Extracted Data & Fields (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            {/* View Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('fields')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'fields'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Extracted Fields
                </button>
                <button
                  onClick={() => setActiveTab('lineItems')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'lineItems'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Line Items ({invoice.lineItems.length})
                </button>
                <button
                  onClick={() => setActiveTab('matching')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'matching'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PO Matching
                </button>
              </div>

              <div className="text-right">
                <span className="text-xs text-emerald-600 font-bold">
                  {invoice.aiAccuracyScore}% Confidence
                </span>
              </div>
            </div>

            {/* Tab 1: Extracted Fields List */}
            {activeTab === 'fields' && (
              <div className="space-y-3">
                {invoice.extractedFields.map((field) => {
                  const isHovered = activeFieldId === field.id;
                  const isEditing = editingFieldId === field.id;

                  return (
                    <div
                      key={field.id}
                      onMouseEnter={() => setActiveFieldId(field.id)}
                      className={`p-3 rounded-xl border transition-all ${
                        isHovered
                          ? 'border-violet-300 bg-violet-50/50'
                          : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                          {field.label}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[11px] text-violet-700 font-bold">
                            {(field.confidence * 100).toFixed(0)}% AI Score
                          </span>
                          {!isEditing && (
                            <button
                              onClick={() => handleStartEdit(field)}
                              className="text-slate-400 hover:text-violet-700 transition-colors"
                              title="Edit value"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-1.5">
                        {isEditing ? (
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full bg-white border border-violet-400 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(field.id)}
                              className="p-1 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingFieldId(null)}
                              className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="font-bold text-slate-900 text-sm font-mono">
                            {field.value}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Itemized Line Items Table */}
            {activeTab === 'lineItems' && (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 font-medium">
                        <th className="pb-2">Description</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Rate</th>
                        <th className="pb-2 text-right">Amount</th>
                        <th className="pb-2 text-right">Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoice.lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 pr-2 font-medium text-slate-800">
                            <div>{item.description}</div>
                            {item.sku && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                SKU: {item.sku}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 text-center font-mono text-slate-600">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 text-right font-mono text-slate-600">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                            ${item.amount.toFixed(2)}
                          </td>
                          <td className="py-2.5 text-right">
                            {item.isMatched ? (
                              <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                                Matched
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
                                Discrepancy
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: PO Matching Analysis */}
            {activeTab === 'matching' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-violet-100 bg-violet-50/60 space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-700">Linked Purchase Order</span>
                    <span className="font-mono text-violet-700 font-bold">
                      {invoice.poReference || invoice.suggestedPo || 'None'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {invoice.status === 'Exception'
                      ? invoice.exceptionReason
                      : 'All line item quantities and contracted unit prices match authorized purchase order 100%.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Document Visual PDF Canvas (6 cols, Matching Screenshot 2 & 5) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            {/* Document Canvas Toolbar */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 font-mono truncate max-w-xs">
                  {invoice.fileName}
                </span>
              </div>

              {/* Controls: Zoom & Page Navigation */}
              <div className="flex items-center space-x-3 text-xs text-slate-600">
                <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                    className="p-1 hover:bg-white rounded transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] px-1 font-semibold">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                    className="p-1 hover:bg-white rounded transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-1 hover:bg-white rounded disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] px-1 font-semibold">
                    {currentPage} / {invoice.pagesCount}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(invoice.pagesCount, p + 1))}
                    disabled={currentPage >= invoice.pagesCount}
                    className="p-1 hover:bg-white rounded disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Document Rendered Canvas Surface */}
            <div className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden aspect-[1/1.28] shadow-inner p-6 select-none">
              {/* Document Paper Mockup with Authentic Invoice Layout */}
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full h-full bg-white p-6 shadow-sm border border-slate-100 rounded-lg text-xs font-sans text-slate-800 space-y-4 relative transition-transform"
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                      {invoice.vendorName}
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {invoice.vendorAddress || 'Corporate Headquarters'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {invoice.vendorEmail || 'billing@vendor.com'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs uppercase font-extrabold text-violet-700 tracking-widest block">
                      INVOICE
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {invoice.invoiceNumber}
                    </span>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">
                      Billed To:
                    </span>
                    <div className="font-bold text-slate-900 mt-0.5">Enterprise Client Corp</div>
                    <div className="text-slate-500 text-[11px]">789 Innovation Parkway</div>
                  </div>

                  <div className="text-right space-y-1 text-slate-600 font-mono text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] font-sans">Date: </span>
                      <span>{invoice.invoiceDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] font-sans">Due Date: </span>
                      <span>{invoice.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] font-sans">PO Ref: </span>
                      <span className="font-bold text-slate-800">
                        {invoice.poReference || invoice.suggestedPo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="pt-2">
                  <div className="border-t border-slate-200 divide-y divide-slate-100">
                    {invoice.lineItems.map((li) => (
                      <div key={li.id} className="py-2 flex justify-between items-center text-xs">
                        <span className="text-slate-700">{li.description}</span>
                        <span className="font-mono font-bold text-slate-900">
                          ${li.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-4 pt-3 border-t-2 border-slate-900 flex justify-between items-center">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                      Total Payable:
                    </span>
                    <span className="font-mono text-base font-extrabold text-violet-700">
                      ${invoice.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Interactive Bounding Boxes Overlay */}
                {invoice.extractedFields.map((field) => {
                  const isActive = activeFieldId === field.id;
                  return (
                    <div
                      key={field.id}
                      onClick={() => setActiveFieldId(field.id)}
                      onMouseEnter={() => setActiveFieldId(field.id)}
                      style={{
                        left: `${field.box.x}%`,
                        top: `${field.box.y}%`,
                        width: `${field.box.width}%`,
                        height: `${field.box.height}%`,
                      }}
                      className={`absolute rounded transition-all cursor-pointer border-2 flex items-center px-1 overflow-hidden pointer-events-auto ${
                        isActive
                          ? 'border-violet-600 bg-violet-600/15 shadow-md shadow-violet-200 z-30'
                          : 'border-violet-400/40 bg-violet-500/5 hover:border-violet-500'
                      }`}
                      title={`${field.label}: ${field.value}`}
                    >
                      <span
                        className={`text-[9px] font-bold truncate ${
                          isActive ? 'text-violet-800' : 'text-violet-600/80'
                        }`}
                      >
                        {field.box.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Hover over or click any field on the left to highlight its spatial region on the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
