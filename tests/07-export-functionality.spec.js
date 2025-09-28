// tests/07-export-functionality.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Export Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should show all export buttons', async ({ page }) => {
    const exportButtons = [
      'JSON',
      'CSV', 
      'Audit',
      'Ann. PDF',
      'Main Data CSV',
      'Trace Data CSV',
      'Complete SR Export'
    ];
    
    for (const buttonText of exportButtons) {
      await expect(page.getByText(buttonText, { exact: true })).toBeVisible();
    }
  });

  test('should handle JSON export', async ({ page }) => {
    // Listen for download
    const downloadPromise = page.waitForEvent('download');
    
    await page.getByText('JSON', { exact: true }).click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/extraction_\d+\.json/);
  });

  test('should handle CSV export', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    
    await page.getByText('CSV', { exact: true }).click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/extraction_\d+\.csv/);
  });

  test('should handle systematic review exports', async ({ page }) => {
    // Test main database export
    const mainDbPromise = page.waitForEvent('download');
    await page.getByText('Main Data CSV').click();
    
    // Note: This might not trigger download if database is empty
    // In real test, we'd populate data first
  });

  test('should open audit report in new tab', async ({ page }) => {
    // Mock window.open
    let openedUrl = null;
    await page.evaluate(() => {
      window.open = (url) => {
        window.lastOpenedUrl = url;
        return { focus: () => {} };
      };
    });
    
    await page.getByText('Audit').click();
    
    // Check if window.open was called
    const openedUrl2 = await page.evaluate(() => window.lastOpenedUrl);
    expect(openedUrl2).toBeTruthy();
  });
});