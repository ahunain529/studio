'use client';

import { useState } from 'react';
import type { Receivable, DealerContact } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, PlusCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const receivableSchema = z.object({
  payer: z.string().min(1, 'Payer name is required'),
  amount: z.coerce.number().positive('Amount must be a positive number'),
});

type ReceivablesCardProps = {
  receivables: Receivable[];
  onAddReceivable: (receivable: Omit<Receivable, 'id'>) => void;
  onClearReceivable: (id: string) => void;
  dealerContacts: DealerContact[];
};

export default function ReceivablesCard({ receivables, onAddReceivable, onClearReceivable, dealerContacts }: ReceivablesCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<z.infer<typeof receivableSchema>>({
    resolver: zodResolver(receivableSchema),
    defaultValues: {
      payer: '',
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof receivableSchema>) {
    onAddReceivable(values);
    form.reset();
    setIsOpen(false);
  }
  
  const totalReceivables = receivables.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className='flex items-center gap-2'>
          <TrendingUp className="text-accent h-6 w-6" />
          <CardTitle className="font-headline">Receivables</CardTitle>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className='gap-2'><PlusCircle size={16}/> Add New</Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-md rounded-md">
            <DialogHeader>
              <DialogTitle>Add New Receivable</DialogTitle>
              <DialogDescription>Enter the details of the incoming payment.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="payer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payer</FormLabel>
                       <FormControl>
                        <>
                          <Input list="dealer-contacts-list" placeholder="Select or type a payer" {...field} />
                           <datalist id="dealer-contacts-list">
                            {dealerContacts.map(contact => (
                              <option key={contact.id} value={contact.name} />
                            ))}
                          </datalist>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                  <Button type="submit">Add Receivable</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-auto">
          {receivables.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receivables.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.payer}</TableCell>
                    <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onClearReceivable(item.id)} title="Clear Receivable">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No outstanding receivables.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm font-bold w-full text-right">Total: ${totalReceivables.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
}
