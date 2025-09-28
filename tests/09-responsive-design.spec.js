// tests/09-responsive-design.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Responsive Design', () => {
  
  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/index.html');
    
    // Check three-panel layout
    const formPanel = page.locator('.form-panel');
    const pdfPanel = page.locator('.pdf-panel');
    const tracePanel = page.locator('.trace-panel');
    
    await expect(formPanel).toBeVisible();
    await expect(pdfPanel).toBeVisible();
    await expect(tracePanel).toBeVisible();
    
    // Check panels are arranged horizontally
    const mainContainer = page.locator('.main-container');
    await expect(mainContainer).toHaveCSS('display', 'flex');
  });

  test('should handle medium screens', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/index.html');
    
    // Panels should still be visible but may be compressed
    await expect(page.locator('.form-panel')).toBeVisible();
    await expect(page.locator('.pdf-panel')).toBeVisible();
    await expect(page.locator('.trace-panel')).toBeVisible();
  });

  test('should handle small screens', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/index.html');
    
    // Application should still be functional
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.form-panel')).toBeVisible();
  });

  test('should handle mobile screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html');
    
    // Core functionality should be accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#citation')).toBeVisible();
  });
});