'use server';

import { z } from 'zod';
import { analyzePurchaseNotes } from '@/ai/flows/purchase-notes-analysis';
import type { Purchase } from '@/lib/types';
import { financialSummary } from '@/ai/flows/financial-summary';

const purchaseSchema = z.object({
  notes: z.string().min(1, 'Purchase notes cannot be empty.'),
});

const summarySchema = z.object({
    receivables: z.string(),
    payables: z.string(),
    purchases: z.string(),
});

export async function createPurchase(formData: FormData): Promise<Purchase | { error: string }> {
  const validatedFields = purchaseSchema.safeParse({
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.notes?.[0] ?? 'Invalid input.',
    };
  }
  
  try {
    const analysis = await analyzePurchaseNotes({ notes: validatedFields.data.notes });
    const newPurchase: Purchase = {
      id: crypto.randomUUID(),
      notes: validatedFields.data.notes,
      ...analysis,
    };
    return newPurchase;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to analyze purchase notes. Please try again.' };
  }
}

export async function generateSummary(data: {
    receivables: string;
    payables: string;
    purchases: string;
}) : Promise<{summary: string} | {error: string}> {
    const validatedFields = summarySchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            error: 'Invalid data for summary generation.'
        }
    }

    try {
        const result = await financialSummary(validatedFields.data);
        return { summary: result.summary };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to generate financial summary. Please try again.' };
    }
}
