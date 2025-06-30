'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating detailed invoice item descriptions from short descriptions.
 *
 * - generateDetailedDescription - A function that takes a short item description and returns a more detailed description.
 * - AiItemDescriptionInput - The input type for the generateDetailedDescription function.
 * - AiItemDescriptionOutput - The return type for the generateDetailedDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiItemDescriptionInputSchema = z.object({
  shortDescription: z
    .string()
    .describe('A short description of the invoice item.'),
});
export type AiItemDescriptionInput = z.infer<typeof AiItemDescriptionInputSchema>;

const AiItemDescriptionOutputSchema = z.object({
  detailedDescription: z
    .string()
    .describe('A more detailed and compelling description of the invoice item.'),
});
export type AiItemDescriptionOutput = z.infer<typeof AiItemDescriptionOutputSchema>;

export async function generateDetailedDescription(
  input: AiItemDescriptionInput
): Promise<AiItemDescriptionOutput> {
  return generateDetailedDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiItemDescriptionPrompt',
  input: {schema: AiItemDescriptionInputSchema},
  output: {schema: AiItemDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling invoice item descriptions.

  Given a short description of an invoice item, your task is to expand it into a more detailed and persuasive description suitable for use on an invoice.

  Short Description: {{{shortDescription}}}

  Detailed Description:`, // The detailed description should continue from here.
});

const generateDetailedDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDetailedDescriptionFlow',
    inputSchema: AiItemDescriptionInputSchema,
    outputSchema: AiItemDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
