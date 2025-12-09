/**
 * Optimize the process of the extraction to improve the following:
 * 1. Speed of the extraction
 * 2. Cost of the extraction (token usage)
 *
 * Feel free to include modify the code below in any way you see fit.
 * You are allowed to add new dependencies to the project.
 */

import OpenAI from 'openai';
import { EXTRACTION_MESSAGE } from './messages.js';
import { extractionSchema } from './schema.js';
import * as z from 'zod';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extract(pdfBuffer: Buffer) {
  const response = await client.responses.parse({
    model: 'gpt-4.1',
    max_output_tokens: 5000,
    instructions: 'You are a helpful assistant that extracts information from a PDF file.',
    temperature: 0,
    top_p: 0.1,
    input: [
      {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_file',
            filename: 'financial_statement.pdf',
            file_data: `data:application/pdf;base64,${pdfBuffer.toString('base64')}`,
          },
          {
            type: 'input_text',
            text: EXTRACTION_MESSAGE(JSON.stringify(extractionSchema)),
          },
        ],
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'extracted_data',
        strict: true,
        schema: z.toJSONSchema(
          z.object({
            results: extractionSchema,
          }),
        ),
      },
    },
  });

  return {
    data: response.output_parsed,
    usage: response.usage,
  };
}
