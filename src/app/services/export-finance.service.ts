import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Transaction } from '../models/finance.model';

@Injectable({
  providedIn: 'root'
})
export class ExportFinanceService {

  // ==========================================
  // 1. GÉNÉRATION DE REÇU INDIVIDUEL (PDF)
  // ==========================================
  exportTransactionReceiptPDF(transaction: Transaction): void {
    const doc = new jsPDF();

    // En-tête B2WA
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // Bleu B2WA
    doc.text('B2WA - Business 2 West Africa', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Plateforme de Commerce & Communautés en Afrique de l\'Ouest', 14, 26);
    doc.text(`Date de génération : ${new Date().toLocaleString('fr-FR')}`, 14, 31);

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, 196, 35);

    // Titre du reçu
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`REÇU DE TRANSACTION #${transaction.reference}`, 14, 45);

    // Tableau des détails
    const details = [
      ['Référence', transaction.reference],
      ['Date & Heure', transaction.date],
      ['Description', transaction.description],
      ['Type de transaction', transaction.type],
      ['Méthode de paiement', transaction.paymentMethod],
      ['Client / Bénéficiaire', transaction.customerName || 'N/A'],
      ['Statut', transaction.status],
      ['Montant Total', `${transaction.amount.toLocaleString('fr-FR')} FCFA`]
    ];

    autoTable(doc, {
      startY: 50,
      head: [['Champ', 'Information']],
      body: details,
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138] },
      styles: { fontSize: 10, cellPadding: 4 }
    });

    // Pied de page
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFontSize(9);
    doc.setTextColor(128);
    doc.text('Merci de votre confiance en B2WA.', 14, finalY + 15);
    doc.text('Ce document sert de preuve officielle de transaction.', 14, finalY + 20);

    // Téléchargement
    doc.save(`Recu_${transaction.reference}.pdf`);
  }

  // ==========================================
  // 2. JOURNAL DES VENTES / TRANSACTIONS (PDF)
  // ==========================================
  exportTransactionsPDF(transactions: Transaction[], periodLabel: string = 'Globale'): void {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text('B2WA - Journal des Transactions', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Période : ${periodLabel} | Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 14, 26);

    // Structure des colonnes du journal
    const headers = [['Référence', 'Date', 'Description', 'Type', 'Paiement', 'Montant (FCFA)', 'Statut']];
    const rows = transactions.map(t => [
      t.reference,
      t.date,
      t.description,
      t.type,
      t.paymentMethod,
      t.amount.toLocaleString('fr-FR'),
      t.status
    ]);

    autoTable(doc, {
      startY: 32,
      head: headers,
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        5: { halign: 'right' } // Aligner le montant à droite
      }
    });

    // Calcul du total
    const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const finalY = (doc as any).lastAutoTable.finalY || 100;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(
      `Total cumulé : ${totalAmount.toLocaleString('fr-FR')} FCFA`,
      14,
      finalY + 10
    );

    doc.save(`Journal_Transactions_B2WA_${Date.now()}.pdf`);
  }

  // ==========================================
  // 3. JOURNAL DES VENTES / TRANSACTIONS (EXCEL)
  // ==========================================
  exportTransactionsExcel(transactions: Transaction[]): void {
    // Préparation des données formatées pour la feuille Excel
    const dataToExport = transactions.map(t => ({
      'Référence': t.reference,
      'Date': t.date,
      'Description': t.description,
      'Client': t.customerName || '-',
      'Type': t.type,
      'Moyen de Paiement': t.paymentMethod,
      'Statut': t.status,
      'Montant (FCFA)': t.amount
    }));

    // Création du classeur Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Définition de la largeur des colonnes
    worksheet['!cols'] = [
      { wch: 15 }, // Référence
      { wch: 18 }, // Date
      { wch: 35 }, // Description
      { wch: 20 }, // Client
      { wch: 18 }, // Type
      { wch: 18 }, // Moyen de Paiement
      { wch: 12 }, // Statut
      { wch: 15 }  // Montant
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Journal de Ventes': worksheet },
      SheetNames: ['Journal de Ventes']
    };

    // Téléchargement du fichier .xlsx
    XLSX.writeFile(workbook, `Journal_Ventes_B2WA_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}