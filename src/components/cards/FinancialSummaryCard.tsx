'use client';

import { useState, useTransition } from 'react';
import type { Receivable, Payable, Purchase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateSummary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type FinancialSummaryCardProps = {
  receivables: Receivable[];
  payables: Payable[];
  purchases: Purchase[];
};

export default function FinancialSummaryCard({ receivables, payables, purchases }: FinancialSummaryCardProps) {
  const [summary, setSummary] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateSummary = () => {
    const receivablesText = receivables.map(r => `${r.payer}: $${r.amount}`).join(', ') || 'None';
    const payablesText = payables.map(p => `${p.payee}: $${p.amount}`).join(', ') || 'None';
    const purchasesText = purchases.map(p => p.notes).join('; ') || 'None';
    
    startTransition(async () => {
      setSummary('');
      const result = await generateSummary({
        receivables: receivablesText,
        payables: payablesText,
        purchases: purchasesText,
      });

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setSummary('');
      } else {
        setSummary(result.summary);
        toast({
          title: 'Summary Generated',
          description: 'AI financial summary is ready.',
        });
      }
    });
  };

  return (
    <Card className="bg-gradient-to-br from-primary/30 to-background">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className='flex items-center gap-2'>
          <Sparkles className="text-accent h-6 w-6" />
          <CardTitle className="font-headline">AI Financial Summary</CardTitle>
        </div>
        <Button onClick={handleGenerateSummary} disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          Generate Summary
        </Button>
      </CardHeader>
      <CardContent className="min-h-[10rem] flex items-center justify-center">
        {isPending ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin h-8 w-8 text-accent" />
            <p>Analyzing your finances...</p>
          </div>
        ) : summary ? (
          <p className="whitespace-pre-wrap text-sm">{summary}</p>
        ) : (
          <CardDescription className="text-center">
            Click "Generate Summary" to get an AI-powered overview of your financial status, risks, and action items.
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}
