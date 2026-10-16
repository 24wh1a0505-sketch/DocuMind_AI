import React from 'react';
import {
  FileText,
  Upload,
  BarChart3,
  MessageSquare,
  Layers,
  Settings,
  Share2,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export type ActiveTab = 'invoices' | 'dashboard' | 'assistant' | 'viewer';

interface HeaderProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenUpload: () => void;
  invoicesCount: number;
  exceptionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenUpload,
  invoicesCount,
  exceptionsCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Breadcrumbs & System Status */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm shadow-violet-200">
              <FileText className="w-5 h-5" />
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-slate-500 font-medium">Apps</span>
              <span className="text-slate-300">/</span>
              <div className="flex items-center space-x-1.5">
                <span className="font-semibold text-slate-900 text-base">Invoice Processing</span>
                <Star className="w-4 h-4 text-slate-300 hover:text-amber-400 cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-1.5 pl-3 border-l border-slate-200 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active</span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => onTabChange('invoices')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'invoices'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Invoices</span>
              <span className="ml-1 text-[11px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded-full">
                {invoicesCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dashboard Analytics</span>
            </button>

            <button
              onClick={() => onTabChange('assistant')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'assistant'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => onTabChange('viewer')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'viewer'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Document Review</span>
              {exceptionsCount > 0 && (
                <span className="ml-1 text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full">
                  {exceptionsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action: Upload Button & Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenUpload}
              className="bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-violet-200 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Invoice</span>
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-slate-400">
              <button
                title="Share workspace"
                className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                title="Workspace settings"
                className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 text-violet-700 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => onTabChange('invoices')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              currentTab === 'invoices' ? 'bg-violet-50 text-violet-700' : 'text-slate-600'
            }`}
          >
            Invoices ({invoicesCount})
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              currentTab === 'dashboard' ? 'bg-violet-50 text-violet-700' : 'text-slate-600'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => onTabChange('assistant')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              currentTab === 'assistant' ? 'bg-violet-50 text-violet-700' : 'text-slate-600'
            }`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => onTabChange('viewer')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              currentTab === 'viewer' ? 'bg-violet-50 text-violet-700' : 'text-slate-600'
            }`}
          >
            Review ({exceptionsCount})
          </button>
        </div>
      </div>
    </header>
  );
};
