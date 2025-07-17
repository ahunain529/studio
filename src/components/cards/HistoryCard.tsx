'use client';

import type { Payable, Receivable } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History } from 'lucide-react';
import { format } from 'date-fns';

type HistoryCardProps = {
  clearedReceivables: Receivable[];
  clearedPayables: Payable[];
};

export default function HistoryCard({ clearedReceivables, clearedPayables }: HistoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <History className="text-accent h-6 w-6" />
        <CardTitle className="font-headline">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="receivables">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="receivables">Cleared Receivables</TabsTrigger>
            <TabsTrigger value="payables">Cleared Payables</TabsTrigger>
          </TabsList>
          <TabsContent value="receivables">
            <div className="h-80 overflow-auto">
              {clearedReceivables.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payer</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clearedReceivables.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.payer}</TableCell>
                        <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No cleared receivables yet.
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="payables">
            <div className="h-80 overflow-auto">
              {clearedPayables.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payee</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clearedPayables.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.payee}</TableCell>
                        <TableCell>{format(item.dueDate, "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No cleared payables yet.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
