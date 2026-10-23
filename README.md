# Playwright E2E and API Testing Assignment

This repository contains the homework assignment featuring manual test cases and bug report, along with automated End-to-End (E2E) UI and REST API test suites created with **Playwright** and **TypeScript**.

- Task 1: manual test cases and bug report - ManualTestCases.xlsx 
- Task 2: E2E UI login tests - in Login folder
- Task 3: API tests - in API folder, test cases with expected results summarized in API_tests.xlsx
- Task 4: Answers to Bonus questions - BonusQuestions.docx


## Prerequisites

Make sure you have the following installed on your machine:
* **Node.js** (v18 or higher recommended)
* **npm** (comes bundled with Node.js)

## Project Setup & Installation

Follow these steps to set up the project locally:

1. **Create and navigate to the project folder:**
   ```bash
   cd ~/Documents/playwright-homework

2. Initialize the Playwright project:
   ```bash
   npm init playwright@latest

3. Install dotenv for secure credential management:
   ```bash
   npm install dotenv --save-dev

   Note: Environment variables are stored in a .env file to ensure sensitive data (like passwords) is not hardcoded into test files.

4. Create a .env file in the root directory
    ```bash
   touch .env

    Add test account credentials
   (Ensure .env is listed in .gitignore so credentials are not pushed to GitHub.)

5. Install Playwright browser binaries:
    ```bash
   npx playwright install

Running the Tests
You can execute the tests using the following commands:

1. Run all tests in headless mode:
   ```bash
   npx playwright test

2. Run tests in headed mode (visible browser):
   ```bash
   npx playwright test --headed

3. Run tests using Playwright Interactive UI Mode:
   ```bash
   npx playwright test --ui

4. View HTML test report:
   ```bash
   npx playwright show-report

