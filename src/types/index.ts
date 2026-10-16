export type InvoiceStatus = 'Pending' | 'Exception' | 'Matched' | 'Approved' | 'Paid';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  label: string;
}

export interface LineItem {
  id: string;
  description: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  matchedPoQty?: number;
  matchedPoRate?: number;
  isMatched?: boolean;
}

export interface ExtractedField {
  id: string;
  name: string;
  label: string;
  value: string;
  originalValue: string;
  page: number;
  box: BoundingBox;
  confidence: number; // 0-1
  status: 'verified' | 'modified' | 'flagged';
  category: 'header' | 'vendor' | 'financial' | 'dates';
}

export interface DocumentItem {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorEmail?: string;
  vendorAddress?: string;
  fileName: string;
  fileSize: string;
  pagesCount: number;
  invoiceDate: string;
  dueDate: string;
  poReference?: string;
  suggestedPo?: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  status: InvoiceStatus;
  exceptionReason?: string;
  extractedFields: ExtractedField[];
  lineItems: LineItem[];
  rawText: string;
  aiSummary: string;
  aiAccuracyScore: number; // 0-100
  reviewTimeSavedMin: number;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: {
    id: number;
    title: string;
    page: number;
    snippet: string;
    boxCoords?: string;
  }[];
  timestamp: string;
}

export interface DashboardMetric {
  totalAnalyzed: number;
  risksFlagged: number;
  reviewTimeSavedPercent: number;
  aiAccuracyPercent: number;
  totalInQueueValue: number;
}
