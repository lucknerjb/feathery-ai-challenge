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
import * as fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractRelevantTextFromPdf } from './parse.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "report.html");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const file = await client.files.create({
    file: fs.createReadStream(filePath),
    purpose: "user_data",
});

export async function extract(pdfBuffer: Buffer) {
  return await extractRelevantTextFromPdf().then(async (joined) => {
    const response = await client.responses.parse({
      model: 'gpt-4.1',
      max_output_tokens: 5000,
      instructions: 'You are a helpful assistant that extracts information from an HTML file.',
    //   temperature: 0,
    //   top_p: 0.1,
      input: [
        {
          type: 'message',
          role: 'user',
          content: [
            // {
            //   type: 'input_file',
            //   filename: 'financial_statement.pdf',
            //   file_data: `data:application/pdf;base64,${pdfBuffer.toString('base64')}`,
            // },
            // {
            //   type: 'input_file',
            //   filename: 'financial_statement.pdf',
            //   file_data: `data:text/plain;base64,${Buffer.from(joined).toString('base64')}`,
            //   // file_id: file.id,
            // },
            {
              type: 'input_text',
              text: joined,
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
  });
}
