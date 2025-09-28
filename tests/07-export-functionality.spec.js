// tests/07-export-functionality.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Export Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should show all export buttons', async ({ page }) => {
    const buttonSelectors = [
      'button[onclick="exportJSON()"]',
      'button[onclick="exportCSV()"]',
      'button[onclick="exportAuditHTML()"]',
      'button[onclick="exportAnnotatedPDF()"]',
      'button[onclick="exportMainDatabase()"]',
      'button[onclick="exportTraceDatabase()"]',
      'button[onclick="exportCompleteSRData()"]'
    ];
    
    for (const selector of buttonSelectors) {
      await expect(page.locator(selector)).toBeVisible();
    }
  });

  test('should handle JSON export', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button[onclick="exportJSON()"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/extraction_\d+\.json/);
  });

  test('should handle CSV export', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button[onclick="exportCSV()"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/extraction_\d+\.csv/);
  });

  test('should handle systematic review exports', async ({ page }) => {
    await page.locator('button[onclick="exportMainDatabase()"]').click();
    await expect(page.locator('#status-message')).toContainText(/No completed articles/i);
  });

  test('should open audit report in new tab', async ({ page }) => {
    let openedUrl = null;
    await page.evaluate(() => {
      window.open = (url) => {
        window.lastOpenedUrl = url;
        return { focus: () => {} };
      };
    });
    await page.locator('button[onclick="exportAuditHTML()"]').click();
    const openedUrl2 = await page.evaluate(() => window.lastOpenedUrl);
    expect(openedUrl2).toBeTruthy();
  });
});
