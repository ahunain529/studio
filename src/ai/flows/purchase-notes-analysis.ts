// src/ai/flows/purchase-notes-analysis.ts
'use server';

/**
 * @fileOverview Analyzes purchase notes to categorize and summarize purchase information.
 *
 * - analyzePurchaseNotes - A function that handles the purchase notes analysis process.
 * - AnalyzePurchaseNotesInput - The input type for the analyzePurchaseNotes function.
 * - AnalyzePurchaseNotesOutput - The return type for the analyzePurchaseNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePurchaseNotesInputSchema = z.object({
  notes: z
    .string()
    .describe('The notes about the purchase, including details like quantity, price, and special notes.'),
});
export type AnalyzePurchaseNotesInput = z.infer<typeof AnalyzePurchaseNotesInputSchema>;

const AnalyzePurchaseNotesOutputSchema = z.object({
  summary: z.string().describe('A summary of the purchase.'),
  category: z.string().describe('The category of the purchased items.'),
  quantity: z.number().describe('The quantity of the purchased items.'),
  price: z.number().describe('The price of the purchased items.'),
  dealerContactInfo: z.string().describe('The contact information of the dealer.'),
});
export type AnalyzePurchaseNotesOutput = z.infer<typeof AnalyzePurchaseNotesOutputSchema>;

export async function analyzePurchaseNotes(input: AnalyzePurchaseNotesInput): Promise<AnalyzePurchaseNotesOutput> {
  return analyzePurchaseNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePurchaseNotesPrompt',
  input: {schema: AnalyzePurchaseNotesInputSchema},
  output: {schema: AnalyzePurchaseNotesOutputSchema},
  prompt: `You are an expert business analyst specializing in purchase analysis.

You will use these notes to extract key information about the purchase, including a summary, category, quantity, price and dealer contact information.

Notes: {{{notes}}}`,
});

const analyzePurchaseNotesFlow = ai.defineFlow(
  {
    name: 'analyzePurchaseNotesFlow',
    inputSchema: AnalyzePurchaseNotesInputSchema,
    outputSchema: AnalyzePurchaseNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
