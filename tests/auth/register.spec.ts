import { test, expect } from '@playwright/test';

test('user can register as student', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.locator('div').filter({ hasText: /^Student$/ }).nth(1).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Stewart Dents');
  await page.getByRole('textbox', { name: 'Email' }).click();
  const uniqueEmail = `test-${Date.now()}@example.com`;;
  await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
  await page.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('changeme');
  await page.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('changeme');
  await page.getByRole('button', { name: 'Register' }).click();
});

test('user can register as instructor', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.locator('div').filter({ hasText: /^Instructor$/ }).nth(1).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Tee Char');
  await page.getByRole('textbox', { name: 'Email' }).click();
  const uniqueEmail = `test-${Date.now()}@example.com`;;
  await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
  await page.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('changeme');
  await page.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('changeme');
  await page.getByRole('button', { name: 'Register' }).click();
});