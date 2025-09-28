// tests/03-systematic-review.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Systematic Review Workflow', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should display articles list when toggled', async ({ page }) => {
    const toggleButton = page.getByText('Show Queue Status');
    await expect(toggleButton).toBeVisible();
    
    // Initially hidden
    const articlesList = page.locator('#articles-list');
    await expect(articlesList).toHaveAttribute('style', /display:\s*none/);
    
    // Click to show
    await toggleButton.click();
    await expect(articlesList).not.toHaveAttribute('style', /display:\s*none/);
    
    // Button text should change
    await expect(page.getByText('Hide Queue Status')).toBeVisible();
  });

  test('should show save and complete buttons', async ({ page }) => {
    await expect(page.getByText('Save Progress')).toBeVisible();
    await expect(page.getByText('Complete Article')).toBeVisible();
  });

  test('should track progress stats', async ({ page }) => {
    const stats = {
      completed: page.locator('#completed-count'),
      inProgress: page.locator('#in-progress-count'),
      total: page.locator('#total-articles')
    };
    
    await expect(stats.completed).toContainText('0');
    await expect(stats.inProgress).toContainText('0');
    await expect(stats.total).toContainText('21');
  });

  test('should handle save progress functionality', async ({ page }) => {
    // Mock localStorage
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
    
    const saveButton = page.getByText('Save Progress');
    await saveButton.click();
    
    // Should show status message
    const statusMessage = page.locator('#extraction-status');
    await expect(statusMessage).toBeVisible();
  });

  test('should show export database options', async ({ page }) => {
    await expect(page.getByText('Main Data CSV')).toBeVisible();
    await expect(page.getByText('Trace Data CSV')).toBeVisible();
    await expect(page.getByText('Complete SR Export')).toBeVisible();
  });
});