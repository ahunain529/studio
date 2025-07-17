'use server';

/**
 * @fileOverview Provides an AI-powered summary of the user's financial status.
 *
 * - financialSummary - A function that generates a financial summary.
 * - FinancialSummaryInput - The input type for the financialSummary function.
 * - FinancialSummaryOutput - The return type for the financialSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialSummaryInputSchema = z.object({
  receivables: z
    .string()
    .describe('A list of who owes you money and how much, e.g. `Bob: $100, Jane: $200`.'),
  payables: z
    .string()
    .describe('A list of who you owe money to and how much, e.g. `Acme Corp: $500, Supplier X: $300`.'),
  purchases: z
    .string()
    .describe('A list of recent purchases including what was purchased, the quantity, the price and any special notes.'),
});
export type FinancialSummaryInput = z.infer<typeof FinancialSummaryInputSchema>;

const FinancialSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of your financial status, risks, and action items.'),
});
export type FinancialSummaryOutput = z.infer<typeof FinancialSummaryOutputSchema>;

export async function financialSummary(input: FinancialSummaryInput): Promise<FinancialSummaryOutput> {
  return financialSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialSummaryPrompt',
  input: {schema: FinancialSummaryInputSchema},
  output: {schema: FinancialSummaryOutputSchema},
  prompt: `You are a financial advisor providing a summary of a business's financial status.

  Provide a concise summary of the financial status, key risks, and action items based on the following information:

  Receivables: {{{receivables}}}
  Payables: {{{payables}}}
  Purchases: {{{purchases}}}
  `,
});

const financialSummaryFlow = ai.defineFlow(
  {
    name: 'financialSummaryFlow',
    inputSchema: FinancialSummaryInputSchema,
    outputSchema: FinancialSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
