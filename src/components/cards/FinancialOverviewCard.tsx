'use client';

import type { Receivable, Payable } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

type FinancialOverviewCardProps = {
  receivables: Receivable[];
  payables: Payable[];
};

export default function FinancialOverviewCard({ receivables, payables }: FinancialOverviewCardProps) {
  const totalReceivables = receivables.reduce((sum, item) => sum + item.amount, 0);
  const totalPayables = payables.reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalReceivables - totalPayables;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
            <Scale className="text-accent h-6 w-6" />
            <CardTitle className="font-headline">Financial Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-card-foreground/5">
                <div className='flex items-center justify-center gap-2 mb-2'>
                    <TrendingUp className="text-green-500" />
                    <h3 className="text-sm font-semibold text-muted-foreground">Total Receivables</h3>
                </div>
                <p className="text-2xl font-bold">${totalReceivables.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-card-foreground/5">
                 <div className='flex items-center justify-center gap-2 mb-2'>
                    <TrendingDown className="text-red-500" />
                    <h3 className="text-sm font-semibold text-muted-foreground">Total Payables</h3>
                </div>
                <p className="text-2xl font-bold">${totalPayables.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-card-foreground/5">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Net Balance</h3>
                <p className={cn(
                    "text-2xl font-bold",
                    netBalance >= 0 ? "text-green-500" : "text-red-500"
                )}>
                    ${netBalance.toFixed(2)}
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
