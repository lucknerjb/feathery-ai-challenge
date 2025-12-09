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
