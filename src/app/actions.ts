'use server';

import { z } from 'zod';
import type { Purchase } from '@/lib/types';

const purchaseSchema = z.object({
  summary: z.string().min(1, 'Product name is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  dealerContactInfo: z.string().min(1, 'Dealer name is required.'),
});


export async function createPurchase(formData: FormData): Promise<Purchase | { error: string }> {
  const validatedFields = purchaseSchema.safeParse({
    summary: formData.get('summary'),
    quantity: formData.get('quantity'),
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
