import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  CornerDownRight,
  ThumbsUp,
  ThumbsDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Search,
  BookOpen,
} from 'lucide-react';
import { DocumentItem, AiChatMessage } from '../types';

interface AiAssistantViewProps {
  selectedInvoice: DocumentItem;
  allInvoices: DocumentItem[];
  onSelectInvoice: (invoice: DocumentItem) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  selectedInvoice,
  allInvoices,
  onSelectInvoice,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [highlightedCitationId, setHighlightedCitationId] = useState<number | null>(1);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I am DocuMind AI. I have indexed "${selectedInvoice.fileName}" and associated purchase orders. What would you like to verify?`,
      timestamp: '11:30 AM',
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: 'What are the invoiced totals, payment terms, and are there any PO discrepancies?',
      timestamp: '11:31 AM',
    },
    {
      id: 'msg-3',
      sender: 'assistant',
      text: `According to the verified document fields and line items for ${selectedInvoice.vendorName}:

• Total Payable: $${selectedInvoice.amount.toFixed(2)} with payment terms due on ${selectedInvoice.dueDate}.
• Purchase Order Reference: ${selectedInvoice.poReference || selectedInvoice.suggestedPo || 'Unlinked'}.
• Audit Reconciliation: ${
        selectedInvoice.status === 'Exception'
          ? `Discrepancy flagged: ${selectedInvoice.exceptionReason}`
          : '100% matched with contracted line items and approved receiving manifest.'
      }`,
      citations: [
        {
          id: 1,
          title: selectedInvoice.fileName,
          page: 1,
          snippet: `Total Amount $${selectedInvoice.amount.toFixed(2)}, Due Date: ${selectedInvoice.dueDate}`,
          boxCoords: 'x: 66%, y: 78%',
        },
        {
          id: 2,
          title: selectedInvoice.fileName,
          page: 1,
          snippet: `PO Reference: ${selectedInvoice.poReference || selectedInvoice.suggestedPo}`,
          boxCoords: 'x: 64%, y: 30%',
        },
      ],
      timestamp: '11:31 AM',
    },
  ]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulate grounded response with citation badges
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = '';
      let citationsList = [];

      if (lower.includes('line item') || lower.includes('product') || lower.includes('item')) {
        replyText = `Extracted ${selectedInvoice.lineItems.length} verified line items from page 1:\n` +
          selectedInvoice.lineItems
            .map(
              (li, idx) =>
                `• ${li.description}: Qty ${li.quantity} @ $${li.unitPrice.toFixed(2)} = $${li.amount.toFixed(2)}`
            )
            .join('\n');
        citationsList = [
          {
            id: 1,
            title: selectedInvoice.fileName,
            page: 1,
            snippet: 'Itemized Schedule of Services and Products',
          },
        ];
      } else if (lower.includes('discrepancy') || lower.includes('exception') || lower.includes('risk')) {
        replyText = selectedInvoice.status === 'Exception'
          ? `⚠️ Exception Detected: ${selectedInvoice.exceptionReason}.\nRecommendation: Issue approval hold until vendor submits revised invoice or procurement approves amendment.`
          : `✓ No discrepancies found. All items, unit rates, and totals match authorized PO ${selectedInvoice.poReference}.`;
        citationsList = [
          {
            id: 1,
            title: selectedInvoice.fileName,
            page: 1,
            snippet: `Audit verification status: ${selectedInvoice.status}`,
          },
        ];
      } else {
        replyText = `Based on verified extraction for ${selectedInvoice.vendorName} (${selectedInvoice.invoiceNumber}):\n• Total Billed: $${selectedInvoice.amount.toFixed(2)}\n• Issued: ${selectedInvoice.invoiceDate} | Due: ${selectedInvoice.dueDate}\n• AI Accuracy Score: ${selectedInvoice.aiAccuracyScore}%\nEvery fact is grounded in spatial coordinates.`;
        citationsList = [
          {
            id: 1,
            title: selectedInvoice.fileName,
            page: 1,
            snippet: `Invoice ${selectedInvoice.invoiceNumber} header`,
          },
        ];
      }

      const botReply: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        citations: citationsList,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    }, 450);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <span>Chat With Your Documents</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ask questions, check contract clauses, and inspect line items with grounded citations.
          </p>
        </div>

        {/* Workspace Document Selector */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
          <FileText className="w-4 h-4 text-violet-600" />
          <label htmlFor="assistant-doc-select" className="sr-only">Active Document</label>
          <select
            id="assistant-doc-select"
            value={selectedInvoice.id}
            onChange={(e) => {
              const found = allInvoices.find((i) => i.id === e.target.value);
              if (found) onSelectInvoice(found);
            }}
            className="font-semibold text-slate-800 bg-transparent border-0 focus:ring-0 cursor-pointer text-xs"
          >
            {allInvoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.vendorName} ({inv.invoiceNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Prompt Pills (Matching Screenshot 3) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Examples:</span>
        <button
          onClick={() => handleSendMessage('What are the invoiced totals, payment terms, and are there any PO discrepancies?')}
          className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-xs font-medium text-slate-700 whitespace-nowrap transition-colors"
        >
          Check for PO discrepancies...
        </button>
        <button
          onClick={() => handleSendMessage('List all itemized line items with unit quantities and rates')}
          className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-xs font-medium text-slate-700 whitespace-nowrap transition-colors"
        >
          Extract the line items...
        </button>
        <button
          onClick={() => handleSendMessage('What are the payment due dates and early settlement discounts?')}
          className="px-3 py-1.5 rounded-full bg-violet-600 text-white hover:bg-violet-700 text-xs font-medium whitespace-nowrap shadow-sm shadow-violet-200 transition-colors"
        >
          Unveil payment terms & due dates...
        </button>
      </div>

      {/* Split Grid: Left Chat Pane, Right Grounded Document Canvas (Screenshot 2 & 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chat Feed (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-violet-600 text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Grounded Citation Badges Matching Screenshot 2 & 3 */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block w-full mb-1">
                        Citations:
                      </span>
                      {msg.citations.map((cite) => (
                        <button
                          key={cite.id}
                          onClick={() => setHighlightedCitationId(cite.id)}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 hover:bg-violet-200 text-violet-800 border border-violet-200 cursor-pointer transition-colors"
                        >
                          <span className="w-3.5 h-3.5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[9px]">
                            {cite.id}
                          </span>
                          <span>Page {cite.page}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.sender === 'assistant' && (
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      <div className="flex space-x-2">
                        <ThumbsUp className="w-3 h-3 hover:text-slate-600 cursor-pointer" />
                        <ThumbsDown className="w-3 h-3 hover:text-slate-600 cursor-pointer" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything about this document..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Grounded Document Canvas with Active Highlight (6 cols, Screenshot 2 & 5) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center space-x-2 font-mono font-bold text-slate-800">
              <BookOpen className="w-4 h-4 text-violet-600" />
              <span>{selectedInvoice.fileName}</span>
            </div>
            <span className="text-[11px] text-violet-700 bg-violet-50 px-2 py-0.5 rounded font-bold">
              Citation Focus: #{highlightedCitationId}
            </span>
          </div>

          {/* Rendered Document Page */}
          <div className="mt-4 flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-y-auto font-sans text-xs text-slate-700 space-y-4 shadow-inner">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-extrabold text-sm text-slate-900">{selectedInvoice.vendorName}</span>
                <span className="font-mono text-xs font-bold text-violet-700">{selectedInvoice.invoiceNumber}</span>
              </div>

              {/* Highlighted Citation Snippet Matching Screenshot 2 & 5 */}
              <div
                className={`p-3 rounded-lg border transition-all ${
                  highlightedCitationId === 1
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="font-bold text-xs text-slate-900">Financial Schedule & Totals</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed font-mono">
                  Total Payable: ${selectedInvoice.amount.toFixed(2)} | Invoice Date: {selectedInvoice.invoiceDate} | Due: {selectedInvoice.dueDate}
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border transition-all ${
                  highlightedCitationId === 2
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="font-bold text-xs text-slate-900">Procurement Authorization</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed font-mono">
                  PO Reference: {selectedInvoice.poReference || selectedInvoice.suggestedPo}
                </p>
              </div>

              <div className="pt-2 text-slate-500 text-[11px] leading-relaxed">
                {selectedInvoice.rawText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
