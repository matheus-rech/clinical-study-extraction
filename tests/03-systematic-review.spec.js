// tests/03-systematic-review.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Systematic Review Workflow', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should display articles list when toggled', async ({ page }) => {
    const toggleButton = page.locator('button[onclick="toggleArticlesList()"]').first();
    await expect(toggleButton).toBeVisible();
    
    // Initially hidden
    const articlesList = page.locator('#articles-list');
    await expect(articlesList).toHaveAttribute('style', /display:\s*none/);
    
    // Click to show
    await toggleButton.click();
    await expect(articlesList).not.toHaveAttribute('style', /display:\s*none/);
    
    // Button text should change
    await expect(toggleButton).toContainText(/Hide Queue Status/);
  });

  test('should show save and complete buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Save Progress/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Complete Article/ })).toBeVisible();
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
    
    const saveButton = page.getByRole('button', { name: /Save Progress/ });
    await saveButton.click();
    
    // Should show status message
    const statusMessage = page.locator('#extraction-status');
    await expect(statusMessage).toBeVisible();
  });

  test('should show export database options', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Main Data CSV/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Trace Data CSV/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Complete SR Export/ })).toBeVisible();
  });
});
