import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { InvoiceTableView } from './components/InvoiceTableView';
import { DashboardAnalyticsView } from './components/DashboardAnalyticsView';
import { AiAssistantView } from './components/AiAssistantView';
import { DocumentSplitViewer } from './components/DocumentSplitViewer';
import { UploadModal } from './components/UploadModal';
import { INITIAL_INVOICES } from './data/sampleDocuments';
import { DocumentItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('invoices');
  const [invoices, setInvoices] = useState<DocumentItem[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<DocumentItem>(INITIAL_INVOICES[0]);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Field Edit Handler
  const handleUpdateField = (invoiceId: string, fieldId: string, newValue: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const updatedFields = inv.extractedFields.map((f) =>
          f.id === fieldId ? { ...f, value: newValue, status: 'modified' as const } : f
        );
        const updated = { ...inv, extractedFields: updatedFields };
        if (selectedInvoice.id === invoiceId) {
          setSelectedInvoice(updated);
        }
        return updated;
      })
    );
  };

  // Invoice Approval Handler
  const handleApproveInvoice = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: 'Approved' as const, exceptionReason: undefined } : inv
      )
    );
    if (selectedInvoice.id === invoiceId) {
      setSelectedInvoice((prev) => ({ ...prev, status: 'Approved', exceptionReason: undefined }));
    }
  };

  // Invoice Flag Exception Handler
  const handleFlagInvoice = (invoiceId: string, reason: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: 'Exception' as const, exceptionReason: reason } : inv
      )
    );
    if (selectedInvoice.id === invoiceId) {
      setSelectedInvoice((prev) => ({ ...prev, status: 'Exception', exceptionReason: reason }));
    }
  };

  // Ingestion Handler
  const handleUploadDocument = (newDoc: DocumentItem) => {
    setInvoices((prev) => [newDoc, ...prev]);
    setSelectedInvoice(newDoc);
    setCurrentTab('viewer');
    setIsUploadOpen(false);
  };

  const exceptionsCount = invoices.filter((i) => i.status === 'Exception').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-violet-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        invoicesCount={invoices.length}
        exceptionsCount={exceptionsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {currentTab === 'invoices' && (
          <InvoiceTableView
            invoices={invoices}
            selectedInvoice={selectedInvoice}
            onSelectInvoice={setSelectedInvoice}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenViewer={(inv) => {
              setSelectedInvoice(inv);
              setCurrentTab('viewer');
            }}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardAnalyticsView
            invoices={invoices}
            onSelectInvoice={setSelectedInvoice}
            onOpenViewer={(inv) => {
              setSelectedInvoice(inv);
              setCurrentTab('viewer');
            }}
          />
        )}

        {currentTab === 'assistant' && (
          <AiAssistantView
            selectedInvoice={selectedInvoice}
            allInvoices={invoices}
            onSelectInvoice={setSelectedInvoice}
          />
        )}

        {currentTab === 'viewer' && (
          <DocumentSplitViewer
            invoice={selectedInvoice}
            allInvoices={invoices}
            onSelectInvoice={setSelectedInvoice}
            onUpdateField={handleUpdateField}
            onApproveInvoice={handleApproveInvoice}
            onFlagInvoice={handleFlagInvoice}
            onBackToList={() => setCurrentTab('invoices')}
            onOpenAssistant={(inv) => {
              setSelectedInvoice(inv);
              setCurrentTab('assistant');
            }}
          />
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadDocument={handleUploadDocument}
      />

      {/* Clean White Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-600">DocuMind AI</span>
            <span>•</span>
            <span>Intelligent Document Processing & 3-Way Reconciliation</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px] text-slate-400">
            <span>LayoutLMv3: 97.8% F1</span>
            <span>•</span>
            <span>2,847 Invoices Processed</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
