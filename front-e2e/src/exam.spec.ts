import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('h1').innerText()).toContain('examens');
});

test('displays the list of exams', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('app-exam-item').count()).toBeGreaterThan(0);
});

test('displays "no exams" message if the list is empty', async ({ page }) => {
  await page.route('**/api/exams', async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.goto('/');
  await page.waitForResponse('**/api/exams');

  await expect(page.locator('text=Aucun examen à afficher')).toBeVisible();
});

test('creates a new exam', async ({ page }) => {
  await page.goto('/');

  await page.click('text=Organiser un examen');

  await page.fill('input#firstName', 'Luffy');
  await page.fill('input#lastName', 'Monkey D.');
  await page.fill('input#meetingPoint', 'Grand Line');
  await page.fill('input#date', new Date().toISOString().slice(0, 16));
  await page.selectOption('select#status', 'Confirmé');

  await page.click('button[type="submit"]');

  await expect(page.locator('app-exam-item').last()).toContainText('Luffy');
});
