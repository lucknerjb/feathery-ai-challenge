import * as fs from 'fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

// import * as cheerio from 'cheerio';
// import * as pdf2html from 'pdf2html';
// const TurndownService = require('turndown');

// async function convertPdfToHtml(filename: string): Promise<string> {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = dirname(__filename);

//     const pdfFilePath = join(__dirname, filename);
//     // 1 - Extract HTML from PDF
//     try {
//         const htmlContent: string = await pdf2html.html(pdfFilePath);
//         console.log('HTML extracted successfully:');
//         console.log(htmlContent);
//         return htmlContent;
//     } catch (error) {
//         console.error('Error converting PDF to HTML:', error);
//         return '';
//     }
// }
// (async () => {
//     // 2 - Load HTML into Cheerio for parsing
//     const htmlContent = await convertPdfToHtml('./input.pdf');
//     const $ = cheerio.load(htmlContent);
//     const body = $('body').html() || '';

//     // 3 - HTML to Mardown conversion
//     const turndownService = new TurndownService()
//     const markdown = turndownService.turndown(body);

//     console.log(markdown);
// })();

import path from "path";
import OpenAI from "openai";
import { EXTRACTION_MESSAGE } from './messages.js';
import { extractionSchema } from './schema.js';
import z, { json } from 'zod';

const fileId = 'file-LUJrY5XsWo1AtQ3yqjru8t';

export const STATEMENT_FORMATTER_SYSTEM_PROMPT = `
You are a financial statement formatter.

You are given raw text extracted from a brokerage / investment statement (possibly long, noisy, and with page headers/footers).

Your job is to generate clean, well-structured Markdown that captures all the information in an organized way. Do not omit any information or add any information that is not present in the original text.

Your output must be in valid Markdown format, using appropriate headings, subheadings, bullet points, and tables where applicable.
`;

export const buildUserPrompt = (rawText: string) => `
Here is the raw statement text. Please extract the individual accounts.

OUTPUT FORMAT:
Return ONLY valid JSON according to the provided schema.

RAW STATEMENT TEXT:

${rawText}
`;


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function pdfToMarkdown(inputPdfPath: string): Promise<any> {
  const resolvedPath = path.resolve(inputPdfPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found: ${resolvedPath}`);
  }

  const parser = new PDFParse({ data: fs.readFileSync(resolvedPath) });

    const result = await parser.getText();

//   console.log(`Uploading PDF: ${resolvedPath}`);

//   // 1. Upload the PDF file
//   const file = await client.files.create({
//     file: fs.createReadStream(resolvedPath),
//     purpose: "user_data",
//   });

//   console.log(`File uploaded with id: ${file.id}`);

  // 2. Ask the model to convert it to Markdown
  const response = await client.responses.create({
    model: "gpt-4o", // or "gpt-4.1" if you prefer
    max_output_tokens: 5000,
    temperature: 0,
    top_p: 0.1,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            // text: STATEMENT_FORMATTER_SYSTEM_PROMPT,
            // text: 'Convert the entire following PDF to clean, well-structured Markdown. Do not ommit any information. Once you are done, extract the per-account infformation into a json object and return this object as-is.',
            text: `
Extract general portfolio information as well as per-account details from the following financial statement PDF.
Ensure you are capturing all of the holdings within an account (cash, stocks, bonds, mutual funds, etc.) and associating them with the correct account. Assume account information is related to the previously identified account name/number until you reach a new account name/number.
`,
          },
        //   {
        //     type: 'input_file',
        //     filename: 'financial_statement.txt',
        //     file_data: `data:text/plain;base64,${fs.readFileSync(resolvedPath).toString('base64')}`,
        //   },
          {
            type: "input_text",
            text: buildUserPrompt(result.text),
          },
          {
            type: 'input_text',
            text: EXTRACTION_MESSAGE(JSON.stringify(extractionSchema)),
          },
        //   {
        //     type: "input_file",
        //     file_id: file.id,
        //   },
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

  return response;
}

const inputPdfPath = "src/input.pdf";
const response = await pdfToMarkdown(inputPdfPath);
console.log(response.output_text);

/*
{
    data: response.output_parsed,
    usage: response.usage,
  }
    */