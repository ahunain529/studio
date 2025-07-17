'use client';

import { useState, useTransition } from 'react';
import type { Purchase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, PlusCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createPurchase } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const purchaseSchema = z.object({
  notes: z.string().min(10, 'Please provide detailed notes about the purchase.'),
});

type PurchasesCardProps = {
  purchases: Purchase[];
  onAddPurchase: (purchase: Purchase) => void;
};

export default function PurchasesCard({ purchases, onAddPurchase }: PurchasesCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      notes: '',
    },
  });

  function onSubmit(values: z.infer<typeof purchaseSchema>) {
    const formData = new FormData();
    formData.append('notes', values.notes);

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
          title: 'Purchase Analyzed',
          description: 'AI has successfully processed your purchase notes.',
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add and Analyze Purchase</DialogTitle>
              <DialogDescription>
                Describe your purchase in the notes below. Our AI will automatically analyze and categorize it.
                e.g., "Bought 100kg of super-fine talc powder for $500 from Dealer B. Their contact is 555-123-4567. Got a 5% discount."
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter all details about your purchase..." {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild><Button variant="ghost" disabled={isPending}>Cancel</Button></DialogClose>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                    Analyze and Add
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
                <p className="text-xs text-muted-foreground mb-2">{item.notes}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                    {item.category && <Badge variant="secondary">Category: {item.category}</Badge>}
                    {item.quantity && <Badge variant="secondary">Quantity: {item.quantity}</Badge>}
                    {item.price && <Badge variant="secondary">Price: ${item.price.toFixed(2)}</Badge>}
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
