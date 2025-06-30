'use server';

import { generateDetailedDescription } from '@/ai/flows/ai-item-description';
import { z } from 'zod';

const inputSchema = z.object({
  shortDescription: z.string().min(1, { message: 'Short description cannot be empty.' }),
});

export async function getAIDescription(formData: FormData) {
  const shortDescription = formData.get('shortDescription') as string;

  const parsed = inputSchema.safeParse({ shortDescription });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    const result = await generateDetailedDescription({ shortDescription: parsed.data.shortDescription });
    return { description: result.detailedDescription };
  } catch (e) {
    console.error('AI Error:', e);
    return { error: 'Failed to generate description due to a server error.' };
  }
}
