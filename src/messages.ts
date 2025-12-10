export const INITIAL_PROMPT = (rawText: string) => `
Here is the raw statement text.

RAW STATEMENT TEXT:

${rawText}
`;

export const EXTRACTION_MESSAGE = (schema: string) => `
Your task is to analyze a text converted from a PDF and extract the required information accurately and efficiently.

First, carefully study the JSON schema that defines the structure and requirements for the data you need to extract:

<json_schema>
${schema}
</json_schema>

Extract general portfolio information as well as per-account details from the following financial statement PDF.
Ensure you are capturing all of the holdings within an account (cash, stocks, bonds, mutual funds, etc.) and associating them with the correct account. Assume account information is related to the previously identified account name/number until you reach a new account name/number.

Assume account information is related to the previously identified account name/number until you reach a new account name/number.

RULES:
- Only use information explicitly shown in the Markdown.
- Do NOT infer values that are not clearly present.
- All currency values must be converted to a number (no symbols or commas).
- If information cannot be found, do not return the field
- Assets must be associated with the correct account only and should only be included once per account.
- Ignore percentages, cost basis, unrealized gains, footnotes, and pending settlements.
- For accounts, use the Ending Account Value as the account "ending" value.

OUTPUT FORMAT:
Return ONLY valid JSON according to the provided schema.

MAPPING HINTS:
- Assets: holdings tables under each account section titled "Account Holdings", "Holdings — Stocks", "Holdings", etc.
- Account Name: If there is an account type prefix, exclude it. For example, "Core Account - John Doe" should yield "John Doe".
- Addresses: Should follow the format "123 Main St, City, ST ZIP".
- First Name: Include the middle initial if there is one


Your final response should be a JSON object containing the extracted values for the fields that exist in the document.
`;
