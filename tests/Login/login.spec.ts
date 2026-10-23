import { test, expect } from '@playwright/test';
import 'dotenv/config';

test('login successful', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');

    // Get credentials from .env file
    await page.getByLabel('Username').fill(process.env.TEST_USER_NAME!);
    await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD!);
    // Click on login
    await page.getByRole('button', { name: 'Submit' }).click();
    //Login was successful
    await expect(page).toHaveURL(/\logged-in-successfully/);
    await expect(page.getByText('Logged In Successfully')).toBeVisible();
});

test('wrong password', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');

    // Get credentials from .env file
    await page.getByLabel('Username').fill(process.env.TEST_USER_NAME!);
    await page.getByLabel('Password').fill(process.env.INVALID_USER_PASSWORD!);
    // Click on login
    await page.getByRole('button', { name: 'Submit' }).click();
    //Error message appears
    await expect(page.locator('#error')).toBeVisible();

});


test('wrong user name', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');

    // Get credentials from .env file
    await page.getByLabel('Username').fill(process.env.INVALID_USER_NAME!);
    await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD!);
    // Click on login
    await page.getByRole('button', { name: 'Submit' }).click();
    //Error message appears
    await expect(page.locator('#error')).toBeVisible();
});