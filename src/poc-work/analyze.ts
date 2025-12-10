// analyzeTxtFile-upload.ts
import fs from "fs";
import path from "path";
// import { client } from "./openaiClient";

import OpenAI from "openai";
import { extractionSchema } from "./schema.js";
import { EXTRACTION_MESSAGE } from "./messages.js";
import z from "zod";

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // or omit if using env var
});

async function analyzeTxtFile(
  filePath: string,
  instruction: string
){
  // 1. Upload the txt file to OpenAI
  const file = await client.files.create({
    file: fs.createReadStream(path.resolve(filePath)),
    purpose: "user_data",
  });

  // 2. Ask the model to analyze it using file input
  const response = await client.responses.parse({
    model: "gpt-4o",
    max_output_tokens: 5000,
    temperature: 0,
    top_p: 0.1,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are an expert document analyst. " +
              "You will be given a text file that is the extracted text of a PDF. " +
              "Follow the user's instruction exactly.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: fs.readFileSync(path.resolve(filePath), "utf-8"),
          },
          {
            type: "input_text",
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

  // 3. Get the combined text output
  return {
    data: response.output_parsed,
    usage: response.usage,
  };
}

(async () => {
  const filePath = "src/markdown2.md";
  const instruction = `
Analyze this document and produce:
1. A high-level summary
2. A bullet list of key entities (companies, people, dates, dollar amounts)
3. Any obvious risks or red flags
Return the result as Markdown.
`;

  const result = await analyzeTxtFile(filePath, instruction);

  console.log(JSON.stringify(result, null, 2));
})();
