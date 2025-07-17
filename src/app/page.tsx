'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ReceivablesCard from '@/components/cards/ReceivablesCard';
import PayablesCard from '@/components/cards/PayablesCard';
import PurchasesCard from '@/components/cards/PurchasesCard';
import DealerContactsCard from '@/components/cards/DealerContactsCard';
import FinancialSummaryCard from '@/components/cards/FinancialSummaryCard';
import HistoryCard from '@/components/cards/HistoryCard';
import type { Receivable, Payable, Purchase, DealerContact } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { toast } = useToast();
  const [receivables, setReceivables] = useState<Receivable[]>([
    { id: '1', payer: 'Customer A', amount: 1500 },
    { id: '2', payer: 'Customer B', amount: 800 },
  ]);
  const [payables, setPayables] = useState<Payable[]>([
    { id: '1', payee: 'Supplier X', amount: 2000, dueDate: new Date() },
    { id: '2', payee: 'Supplier Y', amount: 1200, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  ]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [dealerContacts, setDealerContacts] = useState<DealerContact[]>([
    { id: '1', name: 'Perfume Dealer A', contactInfo: 'contact@dealera.com' },
  ]);
  const [historicalReceivables, setHistoricalReceivables] = useState<Receivable[]>([]);
  const [historicalPayables, setHistoricalPayables] = useState<Payable[]>([]);


  const handleAddReceivable = (receivable: Omit<Receivable, 'id'>) => {
    setReceivables(prev => [...prev, { ...receivable, id: crypto.randomUUID() }]);
    toast({ title: "Success", description: "Receivable added." });
  };

  const handleClearReceivable = (id: string) => {
    const itemToMove = receivables.find(r => r.id === id);
    if (itemToMove) {
      setHistoricalReceivables(prev => [itemToMove, ...prev]);
      setReceivables(prev => prev.filter(r => r.id !== id));
      toast({ title: "Success", description: "Receivable cleared." });
    }
  };

  const handleAddPayable = (payable: Omit<Payable, 'id'>) => {
    setPayables(prev => [...prev, { ...payable, id: crypto.randomUUID() }]);
    toast({ title: "Success", description: "Payable added." });
  };

  const handleClearPayable = (id: string) => {
    const itemToMove = payables.find(p => p.id === id);
    if (itemToMove) {
      setHistoricalPayables(prev => [itemToMove, ...prev]);
      setPayables(prev => prev.filter(p => p.id !== id));
      toast({ title: "Success", description: "Payable cleared." });
    }
  };

  const handleAddPurchase = (purchase: Purchase) => {
    setPurchases(prev => [purchase, ...prev]);
  };

  const handleAddDealerContact = (contact: Omit<DealerContact, 'id'>) => {
    setDealerContacts(prev => [...prev, { ...contact, id: crypto.randomUUID() }]);
    toast({ title: "Success", description: "Dealer contact added." });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto">
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
                <div className="xl:col-span-2">
                    <FinancialSummaryCard receivables={receivables} payables={payables} purchases={purchases} />
                </div>
                <ReceivablesCard receivables={receivables} onAddReceivable={handleAddReceivable} onClearReceivable={handleClearReceivable} />
                <PayablesCard payables={payables} onAddPayable={handleAddPayable} onClearPayable={handleClearPayable} />
                <div className="xl:col-span-2">
                    <PurchasesCard purchases={purchases} onAddPurchase={handleAddPurchase} />
                </div>
                <div className="xl:col-span-2">
                    <DealerContactsCard dealerContacts={dealerContacts} onAddDealerContact={handleAddDealerContact} />
                </div>
                <div className="xl:col-span-2">
                  <HistoryCard clearedReceivables={historicalReceivables} clearedPayables={historicalPayables} />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
