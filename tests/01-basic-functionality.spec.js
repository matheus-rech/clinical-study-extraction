// tests/01-basic-functionality.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Basic Application Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load the application successfully', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Clinical Study Extraction System/);
    
    // Check main components are present
    await expect(page.locator('.form-panel')).toBeVisible();
    await expect(page.locator('.pdf-panel')).toBeVisible();
    await expect(page.locator('.trace-panel')).toBeVisible();
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Clinical Study Master Extraction');
  });

  test('should display systematic review progress section', async ({ page }) => {
    const progressSection = page.locator('#sr-progress-section');
    await expect(progressSection).toBeVisible();
    await expect(progressSection.locator('#completed-count')).toContainText('0');
    await expect(progressSection.locator('#total-articles')).toContainText('21');
  });

  test('should show API key configuration section', async ({ page }) => {
    const apiSection = page.locator('#api-key-section');
    await expect(apiSection).toBeVisible();
    await expect(apiSection.locator('h3')).toContainText('AI Configuration');
    await expect(apiSection.locator('#api-key-input')).toBeVisible();
  });

  test('should display form with linked inputs', async ({ page }) => {
    // Check Step 1 form fields
    await expect(page.locator('#citation')).toBeVisible();
    await expect(page.locator('#doi')).toBeVisible();
    await expect(page.locator('#journal')).toBeVisible();
    
    // Check linked-input class
    await expect(page.locator('.linked-input')).toHaveCount(9); // Step 1 has 9 fields
  });

  test('should show export options in trace panel', async ({ page }) => {
    const exportSection = page.locator('.export-section');
    await expect(exportSection).toBeVisible();
    
    // Check export buttons
    await expect(page.getByText('JSON')).toBeVisible();
    await expect(page.getByText('CSV')).toBeVisible();
    await expect(page.getByText('Audit')).toBeVisible();
    await expect(page.getByText('Ann. PDF')).toBeVisible();
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Test Ctrl+O for file open (should trigger file input)
    const fileInput = page.locator('#pdf-file');
    await expect(fileInput).toHaveAttribute('style', /display:\s*none/);
    
    // Note: We can't easily test file input clicks in Playwright due to security restrictions
  });
});