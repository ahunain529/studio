'use client';

import { useState } from 'react';
import type { DealerContact } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, PlusCircle, Import } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';


const contactSchema = z.object({
  name: z.string().min(1, 'Dealer name is required'),
  contactInfo: z.string().min(1, 'Contact info is required'),
});

type DealerContactsCardProps = {
  dealerContacts: DealerContact[];
  onAddDealerContact: (contact: Omit<DealerContact, 'id'>) => void;
};

export default function DealerContactsCard({ dealerContacts, onAddDealerContact }: DealerContactsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      contactInfo: '',
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    onAddDealerContact(values);
    form.reset();
    setIsOpen(false);
  }

  const handleSyncContacts = async () => {
    if (!('contacts' in navigator && 'select' in navigator.contacts)) {
      toast({
        variant: 'destructive',
        title: 'Feature Not Supported',
        description: 'Your browser does not support the Contact Picker API.',
      });
      return;
    }

    try {
      const contacts = await navigator.contacts.select(['name', 'email', 'tel'], { multiple: true });

      if (contacts.length === 0) {
        return;
      }

      let importedCount = 0;
      for (const contact of contacts) {
        const name = contact.name?.[0];
        const contactInfo = contact.email?.[0] || contact.tel?.[0];
        if (name && contactInfo) {
          // Avoid adding duplicates
          if (!dealerContacts.some(dc => dc.name === name && dc.contactInfo === contactInfo)) {
             onAddDealerContact({ name, contactInfo });
             importedCount++;
          }
        }
      }

      if (importedCount > 0) {
        toast({
          title: 'Contacts Imported',
          description: `${importedCount} new contact(s) have been successfully added.`,
        });
      } else {
        toast({
          title: 'No New Contacts',
          description: 'The selected contacts are already in your list or have incomplete information.',
        });
      }

    } catch (ex) {
      console.error(ex);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not import contacts. Please try again.',
      });
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-x-2">
        <div className='flex items-center gap-2'>
          <Users className="text-accent h-6 w-6" />
          <CardTitle className="font-headline text-xl md:text-2xl">Dealer Contacts</CardTitle>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
           <Button variant={isMobile ? 'default' : 'outline'} size="sm" className='gap-2' onClick={handleSyncContacts}>
             <Import size={16}/> 
             <span className={cn(isMobile && 'hidden', 'sm:inline')}>Sync</span>
             <span className={cn(!isMobile && 'hidden', 'sm:hidden')}>Sync from Phone</span>
           </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className='gap-2'>
                <PlusCircle size={16}/>
                <span>Add</span>
                <span className="hidden sm:inline">Contact</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-md rounded-md">
              <DialogHeader>
                <DialogTitle>Add New Dealer Contact</DialogTitle>
                <DialogDescription>Enter the dealer's information.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dealer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Perfume Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Info</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., sales@perfumeinc.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit">Add Contact</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-auto">
          {dealerContacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dealerContacts.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.contactInfo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No contacts saved yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
