'use client';

import { useState } from 'react';
import type { Payable, DealerContact } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingDown, PlusCircle, CalendarIcon, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const payableSchema = z.object({
  payee: z.string().min(1, 'Payee name is required'),
  amount: z.coerce.number().positive('Amount must be a positive number'),
  dueDate: z.date({ required_error: 'Due date is required.'}),
});

type PayablesCardProps = {
  payables: Payable[];
  onAddPayable: (payable: Omit<Payable, 'id'>) => void;
  onClearPayable: (id: string) => void;
  dealerContacts: DealerContact[];
};

export default function PayablesCard({ payables, onAddPayable, onClearPayable, dealerContacts }: PayablesCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<z.infer<typeof payableSchema>>({
    resolver: zodResolver(payableSchema),
    defaultValues: {
      payee: '',
      amount: 0,
      dueDate: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof payableSchema>) {
    onAddPayable(values);
    form.reset();
    setIsOpen(false);
  }
  
  const totalPayables = payables.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className='flex items-center gap-2'>
          <TrendingDown className="text-accent h-6 w-6" />
          <CardTitle className="font-headline">Payables</CardTitle>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className='gap-2'><PlusCircle size={16}/> Add New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Payable</DialogTitle>
              <DialogDescription>Enter the details of the outgoing payment.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="payee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payee</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a contact" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dealerContacts.map(contact => (
                            <SelectItem key={contact.id} value={contact.name}>{contact.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input type="number" placeholder="e.g., 2000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                  <Button type="submit">Add Payable</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-auto">
          {payables.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payee</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payables.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.payee}</TableCell>
                    <TableCell>{format(item.dueDate, "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onClearPayable(item.id)} title="Clear Payable">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No outstanding payables.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
         <p className="text-sm font-bold w-full text-right">Total: ${totalPayables.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
}
