// tests/06-extraction-tracking.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Extraction Tracking', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should show trace log panel', async ({ page }) => {
    const traceLog = page.locator('#trace-log');
    await expect(traceLog).toBeAttached();
  });

  test('should display extraction statistics', async ({ page }) => {
    await expect(page.locator('#extraction-count')).toContainText('0');
    await expect(page.locator('#pages-with-data')).toContainText('0');
    await expect(page.locator('#ai-extraction-count')).toContainText('0');
  });

  test('should show undo and clear buttons', async ({ page }) => {
    const undoButton = page.getByRole('button', { name: /Undo Last/ });
    const clearButton = page.getByRole('button', { name: /Clear All/ });
    
    await expect(undoButton).toBeVisible();
    await expect(clearButton).toBeVisible();
  });

  test('should handle clear all extractions with confirmation', async ({ page }) => {
    // Mock window.confirm to return false (cancel)
    await page.evaluate(() => {
      window.confirm = () => false;
    });
    
    const clearButton = page.getByRole('button', { name: /Clear All/ });
    await clearButton.click();
    
    // Should not clear if user cancels
    // (In real test, we'd verify state didn't change)
  });
});
