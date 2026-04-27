import { test, expect } from '@playwright/test';

test('student can submit definitions', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('spongebob@foo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('changeme');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Submit Definition' }).nth(2).click();
  await page.getByRole('textbox', { name: 'Definition: *' }).click();
  await page.getByRole('textbox', { name: 'Definition: *' }).fill('A function that calls itself');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('RecursionICS 111BasicPending').click();
});

test('instructors can review student definitions and select them as winners', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('dumbledore@hogwarts.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('changeme');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'ICS 111 — Introduction to' }).click();
  await page.getByRole('link', { name: 'Review' }).nth(4).click();
  await page.getByRole('button', { name: 'Mark Reviewed' }).click();
  await page.getByRole('button', { name: 'Set as Winner' }).click();
});

test('student can view winning definitions', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('spongebob@foo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('changeme');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Winner').nth(1).click();
});