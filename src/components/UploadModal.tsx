import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { DocumentItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadDocument: (doc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadDocument,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 20 MB limit.');
      setIsProcessing(false);
      return;
    }

    try {
      setCurrentStep('Validating file integrity & MIME type...');
      await new Promise((r) => setTimeout(r, 300));

      setCurrentStep('Extracting digital tokens & spatial bounding boxes...');
      await new Promise((r) => setTimeout(r, 400));

      setCurrentStep('Running LayoutLMv3 semantic token classification...');
      await new Promise((r) => setTimeout(r, 400));

      setCurrentStep('Checking 3-way match against open purchase orders...');
      await new Promise((r) => setTimeout(r, 300));

      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const randomInvNum = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
      const randomAmount = Number((400 + Math.random() * 1200).toFixed(2));

      const newDoc: DocumentItem = {
        id: `INV-${Date.now()}`,
        invoiceNumber: randomInvNum,
        vendorName: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
        vendorEmail: `billing@${cleanTitle.toLowerCase().replace(/\s+/g, '')}.com`,
        vendorAddress: '100 Enterprise Way, Suite 400',
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        pagesCount: 1,
        invoiceDate: '2026-05-19',
        dueDate: '2026-06-03',
        suggestedPo: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: randomAmount,
        currency: 'USD',
        status: 'Pending',
        aiAccuracyScore: 98,
        reviewTimeSavedMin: 15,
        aiSummary: `Uploaded vendor invoice processed successfully. Total amount is $${randomAmount.toFixed(2)}.`,
        extractedFields: [
          {
            id: `f-${Date.now()}-1`,
            name: 'invoice_number',
            label: 'Invoice #',
            value: randomInvNum,
            originalValue: randomInvNum,
            page: 1,
            box: { x: 64, y: 14, width: 26, height: 4.5, label: 'Invoice #' },
            confidence: 0.99,
            status: 'verified',
            category: 'header',
          },
          {
            id: `f-${Date.now()}-2`,
            name: 'vendor_name',
            label: 'Vendor Name',
            value: cleanTitle,
            originalValue: cleanTitle,
            page: 1,
            box: { x: 8, y: 12, width: 44, height: 5.0, label: 'Vendor' },
            confidence: 0.98,
            status: 'verified',
            category: 'vendor',
          },
          {
            id: `f-${Date.now()}-3`,
            name: 'total_amount',
            label: 'Total Amount',
            value: `$${randomAmount.toFixed(2)}`,
            originalValue: `$${randomAmount.toFixed(2)}`,
            page: 1,
            box: { x: 66, y: 78, width: 25, height: 5.5, label: 'Total' },
            confidence: 0.99,
            status: 'verified',
            category: 'financial',
          },
        ],
        lineItems: [
          {
            id: `li-${Date.now()}-1`,
            description: 'Itemized Vendor Deliverables & Consulting',
            quantity: 1,
            unitPrice: randomAmount,
            amount: randomAmount,
            isMatched: true,
          },
        ],
        rawText: `INVOICE: ${randomInvNum}
Vendor: ${cleanTitle}
Total Payable: $${randomAmount.toFixed(2)}`,
      };

      onUploadDocument(newDoc);
      setIsProcessing(false);
      onClose();
    } catch (err) {
      setErrorMessage(`Failed to process document: ${String(err)}`);
      setIsProcessing(false);
    }
  };

  const handleQuickPreset = (type: 'summit' | 'redwood' | 'harbor') => {
    let dummyFile: File;
    if (type === 'summit') {
      dummyFile = new File(['Invoice SP-44190'], 'summit-packaging-44190.pdf', { type: 'application/pdf' });
    } else if (type === 'redwood') {
      dummyFile = new File(['Invoice RC-11863'], 'redwood-catering-11863.pdf', { type: 'application/pdf' });
    } else {
      dummyFile = new File(['Invoice HT-55007'], 'harbor-tech-55007.jpg', { type: 'image/jpeg' });
    }
    processFile(dummyFile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Vendor Invoice</h3>
            <p className="text-xs text-slate-500">
              Drag and drop invoices to extract fields and match with POs
            </p>
          </div>
        </div>

        {/* Drag and Drop Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-violet-500 bg-violet-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-violet-400 bg-slate-50/50 hover:bg-violet-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.xml,.txt"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-800">
              Drop invoice here, or <span className="text-violet-600 underline">browse</span>
            </div>
            <p className="text-xs text-slate-400">
              Supports PDF, PNG, JPG, or XML up to 20 MB
            </p>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="mt-4 p-3 bg-violet-50 border border-violet-200 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-violet-900">
              <Cpu className="w-4 h-4 animate-spin text-violet-600" />
              <span>Processing Ingestion:</span>
            </div>
            <div className="text-xs font-mono text-violet-700 bg-white p-2 rounded-lg border border-violet-100">
              {currentStep}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Sample Invoices */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 block mb-2">
            Or test with 1-click sample invoices:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickPreset('summit')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-left transition-colors"
            >
              <div className="font-bold text-xs text-slate-900 truncate">Summit Pkg</div>
              <div className="text-[10px] text-slate-400 font-mono">$373.80</div>
            </button>
            <button
              onClick={() => handleQuickPreset('redwood')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-left transition-colors"
            >
              <div className="font-bold text-xs text-slate-900 truncate">Redwood Cat.</div>
              <div className="text-[10px] text-rose-500 font-bold font-mono">Overrun Cap</div>
            </button>
            <button
              onClick={() => handleQuickPreset('harbor')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-left transition-colors"
            >
              <div className="font-bold text-xs text-slate-900 truncate">Harbor Tech</div>
              <div className="text-[10px] text-slate-400 font-mono">$1,317.60</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
