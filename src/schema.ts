import * as z from 'zod';

export const extractionSchema = z.object({
  statement_information: z.object({
    issuer_name: z.string().describe('Name of the company that issued the financial statement'),
    period_start: z.string().describe('Start date of the financial statement'),
    period_end: z.string().describe('End date of the financial statement'),
  }),
  portfolio_information: z.object({
    account_owner: z.object({
      first_name: z.string().describe('First name of the account owner'),
      last_name: z.string().describe('Last name of the account owner'),
      address: z.string().describe('Address of the account owner'),
    }),
  }),
  accounts: z.array(
    z.object({
      number: z.string().describe('Number of the account'),
      name: z.string().describe('Name of the account'),
      value: z.number().describe('Current value of the account in dollars'),
      assets: z
        .array(
          z.object({
            type: z.enum(['cash', 'stock', 'bond', 'mutual_fund', 'etf', 'other']),
            name: z.string().describe('Name of the asset, for example: "Apple Inc. (AAPL)"'),
            value: z.number().describe('Current dollar value of the asset'),
          }),
        )
        .describe('List of assets currently held in the account'),
    }),
  ),
});
