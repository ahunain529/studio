'use client';

import { useState, useTransition } from 'react';
import type { Purchase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ShoppingCart, PlusCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createPurchase } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const purchaseSchema = z.object({
  summary: z.string().min(1, 'Product name is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  dealerContactInfo: z.string().min(1, 'Dealer name is required.'),
});

type PurchasesCardProps = {
  purchases: Purchase[];
  onAddPurchase: (purchase: Omit<Purchase, 'id'>) => void;
};

export default function PurchasesCard({ purchases, onAddPurchase }: PurchasesCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      summary: '',
      quantity: 1,
      dealerContactInfo: '',
    },
  });

  function onSubmit(values: z.infer<typeof purchaseSchema>) {
    const formData = new FormData();
    formData.append('summary', values.summary);
    formData.append('quantity', String(values.quantity));
    formData.append('dealerContactInfo', values.dealerContactInfo);

    startTransition(async () => {
      const result = await createPurchase(formData);
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        onAddPurchase(result);
        toast({
          title: 'Purchase Added',
          description: 'Your purchase has been recorded.',
        });
        form.reset();
        setIsOpen(false);
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className='flex items-center gap-2'>
          <ShoppingCart className="text-accent h-6 w-6" />
          <CardTitle className="font-headline">Purchases</CardTitle>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className='gap-2'><PlusCircle size={16}/> Add Purchase</Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-md rounded-md">
            <DialogHeader>
              <DialogTitle>Add Purchase</DialogTitle>
              <DialogDescription>
                Enter the details of your purchase below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fine talc powder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dealerContactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dealer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Talc Co." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild><Button variant="ghost" disabled={isPending}>Cancel</Button></DialogClose>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                    Add Purchase
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-auto space-y-4">
          {purchases.length > 0 ? (
            purchases.map(item => (
              <div key={item.id} className="p-4 rounded-lg border bg-card-foreground/5">
                <p className="font-semibold text-sm">{item.summary || 'Purchase'}</p>
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                    {item.quantity && <Badge variant="secondary">Quantity: {item.quantity}</Badge>}
                    {item.dealerContactInfo && <Badge>Dealer: {item.dealerContactInfo}</Badge>}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No purchases recorded yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
