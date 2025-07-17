'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ReceivablesCard from '@/components/cards/ReceivablesCard';
import PayablesCard from '@/components/cards/PayablesCard';
import PurchasesCard from '@/components/cards/PurchasesCard';
import DealerContactsCard from '@/components/cards/DealerContactsCard';
import FinancialOverviewCard from '@/components/cards/FinancialOverviewCard';
import HistoryCard from '@/components/cards/HistoryCard';
import type { Receivable, Payable, Purchase, DealerContact } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"
import { database } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { toast } = useToast();
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [payables, setPayables] = useState<Payable[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [dealerContacts, setDealerContacts] = useState<DealerContact[]>([]);
  const [historicalReceivables, setHistoricalReceivables] = useState<Receivable[]>([]);
  const [historicalPayables, setHistoricalPayables] = useState<Payable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to fetch initial data from Firebase
  useEffect(() => {
    const dataRef = ref(database);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setReceivables(data.receivables || []);
        setPayables((data.payables || []).map((p: any) => ({ ...p, dueDate: new Date(p.dueDate) })));
        setPurchases(data.purchases || []);
        setDealerContacts(data.dealerContacts || []);
        setHistoricalReceivables(data.historicalReceivables || []);
        setHistoricalPayables((data.historicalPayables || []).map((p: any) => ({ ...p, dueDate: new Date(p.dueDate) })));
      }
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch data from the database.'});
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  // Effect to sync state changes back to Firebase
  useEffect(() => {
    if (isLoading) return; // Don't write back to DB on initial load
    const dataToSave = {
        receivables,
        payables: payables.map(p => ({...p, dueDate: p.dueDate.toISOString()})),
        purchases,
        dealerContacts,
        historicalReceivables,
        historicalPayables: historicalPayables.map(p => ({...p, dueDate: p.dueDate.toISOString()})),
    };
    set(ref(database), dataToSave);
  }, [receivables, payables, purchases, dealerContacts, historicalReceivables, historicalPayables, isLoading]);


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

  const handleAddPurchase = (purchase: Omit<Purchase, 'id'>) => {
    setPurchases(prev => [{...purchase, id: crypto.randomUUID()}, ...prev]);
    toast({ title: "Success", description: "Purchase added." });
  };

  const handleAddDealerContact = (contact: Omit<DealerContact, 'id'>) => {
    setDealerContacts(prev => [...prev, { ...contact, id: crypto.randomUUID() }]);
    toast({ title: "Success", description: "Dealer contact added." });
  };

  if (isLoading) {
      return (
          <div className="flex flex-col min-h-screen bg-background text-foreground items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading financial data...</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto">
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
                <div className="xl:col-span-2">
                    <FinancialOverviewCard receivables={receivables} payables={payables} />
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
