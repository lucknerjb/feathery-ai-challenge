/**
 * DO NOT MODIFY THIS FILE.
 *
 * This is the entry point of the application.
 * It will run the extraction process and print the results.
 *
 * The extraction process is defined in the `extract` function.
 * The results are printed to the console.
 */

import { extract } from './extraction.js';
import fs from 'fs';

const pdfBuffer = fs.readFileSync(new URL('input.pdf', import.meta.url));

(async () => {
  console.info('Starting extraction...');

  const startTime = new Date();
  const results = await extract(pdfBuffer);
  const endTime = new Date();

  console.info(`Extraction completed in ${(endTime.getTime() - startTime.getTime()) / 1000}s`, JSON.stringify(results, null, 2));
})();
