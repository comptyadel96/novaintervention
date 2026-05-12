import { jsPDF } from "jspdf";

export async function generateInvoicePDF(mission: any) {
  const doc = new jsPDF();
  const primaryColor = "#002244";
  const accentColor = "#ffaa00";

  // Header - Brand
  doc.setFillColor(0, 34, 68); // Navy
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Nova Intervention", 20, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Service d'urgence 24/7", 20, 32);
  
  // Invoice Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE", 150, 60);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`N° Facture : FA-${mission.id.substring(0, 8).toUpperCase()}`, 150, 70);
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 150, 75);

  // Addresses
  doc.setFont("helvetica", "bold");
  doc.text("Émetteur :", 20, 60);
  doc.setFont("helvetica", "normal");
  doc.text("Nova Intervention S.A.S", 20, 65);
  doc.text("75008 Paris, France", 20, 70);
  doc.text("SIRET: 123 456 789 00012", 20, 75);

  doc.setFont("helvetica", "bold");
  doc.text("Client :", 20, 95);
  doc.setFont("helvetica", "normal");
  doc.text(mission.customer_name || "Nom non spécifié", 20, 100);
  doc.text(mission.location || "Adresse non spécifiée", 20, 105);
  if (mission.customer_phone) doc.text(mission.customer_phone, 20, 110);

  // Table Header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 130, 170, 10, 'F');
  doc.setFont("helvetica", "bold");
  doc.text("Description de l'intervention", 25, 136.5);
  doc.text("Total (TTC)", 160, 136.5);

  // Table Body
  doc.setFont("helvetica", "normal");
  doc.text(mission.title || "Intervention technique", 25, 150);
  doc.text(`${mission.price || 0} €`, 165, 150);
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(mission.description || "", 25, 158, { maxWidth: 130 });

  // Summary
  doc.setDrawColor(200, 200, 200);
  doc.line(140, 180, 190, 180);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total Net :", 140, 190);
  doc.text(`${mission.price || 0} €`, 170, 190);

  // Status
  doc.setFontSize(10);
  doc.setTextColor(0, 150, 0);
  doc.text("PAIEMENT TERMINÉ", 20, 220);
  
  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  const footerText = "Conformément à l'article L. 441-6 du Code de commerce, des pénalités de retard sont exigibles si le paiement n'est pas effectué à la date indiquée. Nova Intervention est une plateforme de mise en relation.";
  doc.text(footerText, 20, 280, { maxWidth: 170 });

  // Save PDF
  doc.save(`Facture-Nova-${mission.id.substring(0, 6)}.pdf`);
}
