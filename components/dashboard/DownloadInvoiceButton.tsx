"use client";

import { FileText } from "lucide-react";
import { generateInvoicePDF } from "@/lib/pdf/invoice-generator";

export default function DownloadInvoiceButton({ mission, className }: { mission: any, className?: string }) {
  return (
    <button 
      onClick={() => generateInvoicePDF(mission)}
      className={className || "px-4 py-2 bg-bg-alt rounded-xl text-xs font-bold text-primary-dk hover:bg-border transition-colors"}
    >
      <FileText size={14} className="inline mr-2" />
      Facture PDF
    </button>
  );
}
