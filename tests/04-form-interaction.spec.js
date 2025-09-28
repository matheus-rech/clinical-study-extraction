// tests/04-form-interaction.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Form Interaction', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should highlight active field on focus', async ({ page }) => {
    const citationField = page.locator('#citation');
    
    // Focus on field
    await citationField.focus();
    
    // Check if parent form-group gets active class
    const formGroup = page.locator('#citation').locator('..');
    await expect(formGroup).toHaveClass(/active-extraction/);
  });

  test('should show validation status indicators', async ({ page }) => {
    const validationIndicators = page.locator('.validation-status');
    await expect(validationIndicators).toHaveCount(9); // Step 1 has 9 fields
  });

  test('should handle form field input', async ({ page }) => {
    const doiField = page.locator('#doi');
    await doiField.fill('10.1234/example');
    await expect(doiField).toHaveValue('10.1234/example');
    
    const yearField = page.locator('#year');
    await yearField.fill('2023');
    await expect(yearField).toHaveValue('2023');
  });

  test('should show AI extract buttons', async ({ page }) => {
    const aiButton = page.getByText('AI Extract');
    await expect(aiButton).toBeVisible();
    await expect(aiButton).toHaveClass(/ai-btn/);
  });

  test('should handle required field validation', async ({ page }) => {
    const citationField = page.locator('#citation');
    await expect(citationField).toHaveAttribute('required');
  });
});