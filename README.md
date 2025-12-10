# AI Backend Challenge

This project provides you with the foundation to extract data from a financial statement.

## Challenge

The goal of this challenge is to optimize the current extraction logic to improve the speed of the extraction at scale. The current extraction completes in an average time of just over 30 seconds for a document that has ~30 pages. Assuming we were to give it a larger document, 100+ pages, we need to ensure that it runs quickly and accurately.

There are many ways to approach this challenge. We are looking to see how you navigate the challenge and showcase your problem solving skills.

Once you've completed the challenge, invite Andy ([@ondrosh](https://github.com/ondrosh)) and Peter ([@bo-dun-1](https://github.com/bo-dun-1)) as collaborators to your Github fork so we can review it. Please email us a link to the repository as well once you're finished!

## Requirements

1. Node v22.4.1 (`.nvmrc` included in project)
2. Yarn v1.22.x

## Getting Started

1. Create a new **private** repository using this one as a template (Click the "Use this template" button on the repository's page)
2. Clone your new repository
3. Install the dependencies by running `yarn`
4. Copy the `.env.template` to a new file named `.env` in the root of the project. Copy your OpenAI API key into the new `.env` file.

You can run the extraction via the command:

```
yarn extract
```

## Notes

1. Do not modify the `src/index.ts` file.
2. The current extraction code can be found in `src/extraction.ts`.
3. The time and usage are logged each time you run `yarn extract`.

## OpenAI Usage

We will reimburse you for the OpenAI usage that was needed to complete this challenge.

## Luckner Notes
I kept all my POC work in the `poc-work` directory just to show the various approaches that I tried.

After getting an idea of the issues with parsing PDFs with AI, I set out to try a couple of things. I obviously don't have time to build a full RAG setup but that would be ideal in a production environment.

My initial testing work was done directly in ChatGPT to understand what it was able to do given various directives and content formats as this was faster than coding all my experiments.

### Things I tried
- Converting the PDF to text
- Converting the PDF to HTML
- Converting the PDF to Markdown
- Adjusting the prompts
- Combination of adjusting prompts and different input formats

### What didn't work
Ultimately, working with PDFs directly is just so much simpler than any other format unless you put in quite a bit of initial work.

Simply converting the PDF just didn't do the job. Often, assets would be missed, the data would be misformatted, etc...

There's also issues with the size of the content since the `create-files` API for OpenAI only allows PDFs and images. So HTML was a no-go due to all the extra text that was added - plus the fact that it did a terrible job of preserving structure, which is critical to the parsing step.

Simple text converting also didn't work out of the box because of the lack of structure

### What did work
Eventually, I started to gain momentum once I revisited the text approach. I asked ChatGPT to help me craft a solution where I would be able to reproduce what we had worked on together.

Eventually, I settled on the following approach:
- Convert the PDF to text using `pdf-parse`
- Rework the prompts, starting with the most simple of instructions and adding to it
- I was able to provide the entire PDF text content within the prompt, negating the need for the `create-files` API
- I ended up using the `gpt-4o` model as it was faster and with the reworked prompts, was able to do a pretty good job at parsing

### Where the work stands
- We're not quite at parity with the initial parsing process
- Things like dates are not quite formatted properly
- I had a phase during my experiments where I was able to add some prompt helper text to instruct the AI on how to handle the parsing - include middle initials, format the address in a certain way, etc... but I didn't have time to bring that back into this version

### What I'd do going forward
To truly be able to handle scale, this would likely need to:
- Pre-split the PDF content into sections: general portfolio info + accounts
- Building cleansing rules for each type of statement to remove the boilerplate code would be useful as well to remove all the useless context information
- Instruct the AI to build out the output json step by step starting with the portfolio information and moving on to each account

Ultimately, this work is not perfect but with enough pre-work done on the statement, there is definitely a way to get the AI to parse out the information correctly in a decent amount of time. I was able to get it down to 15-17 seconds with imperfect parsing and with some more work, I think I could maintain the same timing with better parsing quality.