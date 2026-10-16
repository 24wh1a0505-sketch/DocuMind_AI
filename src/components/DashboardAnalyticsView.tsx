import React from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DashboardAnalyticsViewProps {
  invoices: DocumentItem[];
  onSelectInvoice: (invoice: DocumentItem) => void;
  onOpenViewer: (invoice: DocumentItem) => void;
}

export const DashboardAnalyticsView: React.FC<DashboardAnalyticsViewProps> = ({
  invoices,
  onSelectInvoice,
  onOpenViewer,
}) => {
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const exceptions = invoices.filter((i) => i.status === 'Exception');
  const matched = invoices.filter((i) => i.status === 'Matched');
  const approved = invoices.filter((i) => i.status === 'Approved');

  // Chart data for daily trend
  const trendPoints = [
    { day: 'Mon', count: 18, amount: 24200 },
    { day: 'Tue', count: 26, amount: 31500 },
    { day: 'Wed', count: 22, amount: 28900 },
    { day: 'Thu', count: 35, amount: 44100 },
    { day: 'Fri', count: 42, amount: 56400 },
    { day: 'Sat', count: 12, amount: 15800 },
    { day: 'Sun', count: 8, amount: 11200 },
  ];

  const maxCount = Math.max(...trendPoints.map((p) => p.count));
  const svgWidth = 500;
  const svgHeight = 140;

  const pointsPath = trendPoints
    .map((pt, i) => {
      const x = (i / (trendPoints.length - 1)) * svgWidth;
      const y = svgHeight - (pt.count / maxCount) * (svgHeight - 30) - 15;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Intelligence & Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time data trends, exception detection, and automated invoice processing metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-violet-600 animate-ping"></span>
          <span>AI Engine: Active & Calibrated</span>
        </div>
      </div>

      {/* Top 4 KPI Cards (Matching Screenshot 4 & 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Docs Analyzed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Docs Analyzed
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">2,847</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12% this month
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {invoices.length} active in current queue
          </div>
        </div>

        {/* Card 2: Risks Flagged */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Exceptions & Risks
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">{exceptions.length}</span>
            <span className="text-xs font-semibold text-rose-600 flex items-center">
              Requires Review
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Price drift & PO cap discrepancies
          </div>
        </div>

        {/* Card 3: Review Time Saved */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Review Time Saved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">89%</span>
            <span className="text-xs font-semibold text-emerald-600">
              vs. manual entry
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            ~16 min saved per invoice
          </div>
        </div>

        {/* Card 4: AI Accuracy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Accuracy Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">97.8%</span>
            <span className="text-xs font-semibold text-violet-600">
              LayoutLMv3
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Automated 3-way reconciliation
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Processing Volume & Trends (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-violet-600" />
                <span>Invoice Ingestion & Automated Throughput</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily volume of invoices extracted and verified over the past 7 days
              </p>
            </div>
            <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
              163 Total This Week
            </span>
          </div>

          {/* SVG Area Trend Chart */}
          <div className="mt-5">
            <div className="h-36 w-full">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="35" x2={svgWidth} y2="35" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2={svgWidth} y2="75" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="115" x2={svgWidth} y2="115" stroke="#e2e8f0" />

                {/* Shaded Area */}
                <polygon
                  points={`0,${svgHeight} ${pointsPath} ${svgWidth},${svgHeight}`}
                  fill="url(#violetGradient)"
                />

                {/* Line Curve */}
                <polyline
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsPath}
                />

                {/* Data Points */}
                {trendPoints.map((pt, i) => {
                  const x = (i / (trendPoints.length - 1)) * svgWidth;
                  const y = svgHeight - (pt.count / maxCount) * (svgHeight - 30) - 15;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-white stroke-violet-600 stroke-2"
                    />
                  );
                })}
              </svg>
            </div>

            {/* X-axis days */}
            <div className="flex justify-between text-xs text-slate-500 font-medium mt-2 px-1">
              {trendPoints.map((p) => (
                <div key={p.day} className="text-center">
                  <div>{p.day}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{p.count} docs</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Field-Level Extraction Accuracy (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span>Field-Level Extraction Precision</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Model confidence across semantic entity types
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3.5">
            {[
              { field: 'Invoice # & PO Reference', accuracy: 99.4, color: 'bg-violet-600' },
              { field: 'Grand Total & Tax Subtotals', accuracy: 98.6, color: 'bg-violet-600' },
              { field: 'Vendor & Billed-To Entities', accuracy: 97.9, color: 'bg-violet-500' },
              { field: 'Issue & Payment Due Dates', accuracy: 97.2, color: 'bg-violet-500' },
              { field: 'Itemized Descriptions & Quantities', accuracy: 95.8, color: 'bg-purple-500' },
            ].map((row, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{row.field}</span>
                  <span className="text-violet-700 font-bold font-mono">{row.accuracy}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights & Exceptions Review Panel (Matching Screenshot 4) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>AI Insights & Flagged Exceptions</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated discrepancy detection and recommended next actions
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {exceptions.length} items flagged for human review
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Insight 1: Redwood Catering */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>LIMIT OVERRUN RISK</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">$793.80</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Redwood Catering (RC-11863)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vendor matched to PO-1186, but invoiced total is $93.80 above authorized executive cap ($700.00). Recommend requesting adjusted credit memo.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  const inv = invoices.find((i) => i.invoiceNumber === 'RC-11863');
                  if (inv) onOpenViewer(inv);
                }}
                className="text-xs font-semibold text-violet-700 hover:text-violet-800 flex items-center space-x-1"
              >
                <span>Review Document</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Insight 2: Metro Clean Services */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>UNAUTHORIZED LINE ITEM</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">$1,074.60</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Metro Clean Services (MC-33018)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add-on stain removal charge of $124.60 was billed without prior purchase order amendment. Standard monthly cleaning of $950.00 is verified.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  const inv = invoices.find((i) => i.invoiceNumber === 'MC-33018');
                  if (inv) onOpenViewer(inv);
                }}
                className="text-xs font-semibold text-violet-700 hover:text-violet-800 flex items-center space-x-1"
              >
                <span>Review Document</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
