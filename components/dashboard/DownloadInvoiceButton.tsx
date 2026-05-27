"use client";

import { FileText } from "lucide-react";

export default function DownloadInvoiceButton({
  mission,
  className,
}: {
  mission: { id: string };
  className?: string;
}) {
  const handleDownload = () => {
    window.open(`/api/missions/${mission.id}/invoice`, "_blank");
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={
        className ||
        "px-4 py-2 bg-bg-alt rounded-xl text-xs font-bold text-primary-dk hover:bg-border transition-colors"
      }
    >
      <FileText size={14} className="inline mr-2" />
      Facture PDF
    </button>
  );
}
