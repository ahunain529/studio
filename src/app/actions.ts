'use server';

import { z } from 'zod';
import type { Purchase } from '@/lib/types';

const purchaseSchema = z.object({
  notes: z.string().min(1, 'Purchase notes cannot be empty.'),
  summary: z.string().optional(),
  category: z.string().optional(),
  quantity: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  dealerContactInfo: z.string().optional(),
});


export async function createPurchase(formData: FormData): Promise<Purchase | { error: string }> {
  const validatedFields = purchaseSchema.safeParse({
    notes: formData.get('notes'),
    summary: formData.get('summary'),
    category: formData.get('category'),
    quantity: formData.get('quantity'),
    price: formData.get('price'),
    dealerContactInfo: formData.get('dealerContactInfo'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid input.',
    };
  }
  
  try {
    const newPurchase: Purchase = {
      id: crypto.randomUUID(),
      ...validatedFields.data,
    };
    return newPurchase;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to create purchase. Please try again.' };
  }
}
