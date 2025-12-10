import * as fs from 'fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const { PDFParse } = require('pdf-parse');

async function run() {
	const parser = new PDFParse({ data: fs.readFileSync('src/input.pdf') });

	const result = await parser.getText();
	console.log(result.text);
}

run();


// const pdfParse = pdfParseModule as unknown as (buffer: Buffer) => Promise<{ text: string }>;

// async function extractText(filename: string) {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = dirname(__filename);

//     const pdfPath = join(__dirname, filename);

//     if (!fs.existsSync(pdfPath)) {
//         throw new Error(`File not found: ${pdfPath}`);
//     }

//     const dataBuffer = fs.readFileSync(pdfPath);

//     const data = await pdfParse(dataBuffer); // works in ES module

//     console.log(data.text);
// }

// extractText('input.pdf');


// // // const pdf2html = require('pdf2html');
// // import * as pdf2html from 'pdf2html';

// // async function convertPdfToHtml(filename) {
// //     const __filename = fileURLToPath(import.meta.url);
// //     const __dirname = dirname(__filename);

// //     const pdfFilePath = join(__dirname, filename);
// //     try {
// //     const htmlContent = await pdf2html.html(pdfFilePath);
// //     console.log('HTML extracted successfully:');
// //     console.log(htmlContent);
// //     } catch (error) {
// //     console.error('Error converting PDF to HTML:', error);
// //     }
// // }

// // convertPdfToHtml('./input.pdf');

// // v1
// // const pdf = require('pdf-parse');
// // pdf(buffer).then(result => console.log(result.text));

// // v2
// // const { PDFParse } = require('pdf-parse');
// // import { pdf, PDFParse } from 'pdf-parse';

// // const pageTexts: string[] = [];
// // const options = {
// //     pagerender: async (pageData: any) => {
// //       const textContent = await pageData.getTextContent();
// //       const pageText = textContent.items
// //         .map((item: any) => item.str)
// //         .join(' ')
// //         .replace(/\s+/g, ' ')
// //         .trim();

// //       pageTexts.push(pageText);
// //       // Return something (pdf-parse ignores it for our use case)
// //       return pageText;
// //     },
// //   };
// // const pdfBuffer = fs.readFileSync(new URL('input.pdf', import.meta.url));

// // const pdfData = await pdf(pdfBuffer, options);
// // console.log(pdfData.text);

// // async function run() {
// // 	const parser = new PDFParse({data: pdfBuffer});

// // 	const result = await parser.getText();
// // 	console.log(result.text);
// // }

// // run();

// import {pdfToPages, pdfToText} from 'pdf-ts';
// const pdf = await fs.readFileSync('src/input.pdf');
// const pages = await pdfToPages(pdf);

// // pages.map(page => {
// //   return {
// //     page: page.page,
// //     text: page.text.join(' ').replace(/\s+/g, ' ').trim(),
// //   };
// // });

// console.log(pages); // [{page: 1, text: '...'}, {page: 2, text: '...'}, ...]


/**
 * Decide whether a given page is "interesting" enough to keep.
 * Adjust patterns to match your statement types.
 */
// function isInterestingPage(pageText: string): boolean {
//   const patterns = [
//     /portfolio summary/i,
//     /accounts included in this report/i,
//     /account\s+\d{3}-\d{6,}/i,             // Account 111-111111 etc.
//     /holdings/i,
//     /securities bought & sold/i,
//     /dividends,? interest/i,
//     /income summary/i,
//     /cash flow/i,
//     /core account/i,
//   ];

//   return patterns.some((re) => re.test(pageText));
// }

// /**
//  * Optional: strip obvious boilerplate lines to save tokens.
//  */
// function stripBoilerplate(pageText: string): string {
//   const lines = pageText.split('\n');

//   const filtered = lines.filter((line) => {
//     const trimmed = line.trim();

//     if (!trimmed) return false;

//     // Common junk to drop; tweak for your statements
//     if (/Additional Information and Endnotes/i.test(trimmed)) return false;
//     if (/Information About Your Fidelity Statement/i.test(trimmed)) return false;
//     // if (/for informational purposes only/i.test(trimmed)) return false;
//     // if (/member nyse,? sipc/i.test(trimmed)) return false;
//     // if (/fidelity brokerage services/i.test(trimmed)) return false;
//     // if (/investment report/i.test(trimmed) && trimmed.length < 40) return false;
//     // if (/page \d+ of \d+/i.test(trimmed)) return false;
//     // if (/^john w\.? doe/i.test(trimmed)) return false;       // address block
//     // if (/^100 main st/i.test(trimmed)) return false;

//     return true;
//   });

//   return filtered.join('\n').trim();
// }


// import { PDFExtract } from 'pdf.js-extract';


// export async function extractRelevantTextFromPdf(): Promise<string> {
//     const pdfExtract = new PDFExtract();
//     // const options = { firstPage: 1, lastPage: 1 }; // narrow scope if you like
//     const options = {}; // default options
//     let joined = '';
//     const pages: { pageNumber: number; content: string }[] = [];

//     const data = await pdfExtract.extract('src/input.pdf', options);
//     data.pages.forEach((page, index) => {
//         const newContent = page.content.map(item => item.str).join(' ').replace(/\s+/g, ' ').trim();

//         joined += newContent;

//         // const cleanedContent = stripBoilerplate(newContent);
//         // if (isInterestingPage(cleanedContent)) {
//         //     pages.push({ pageNumber: index + 1, content: cleanedContent });
//         //     console.log(index + 1);
//         //     joined += cleanedContent + '\n';
//         // }
//     });

//     return joined;
// }