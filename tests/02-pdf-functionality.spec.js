// tests/02-pdf-functionality.spec.js
const { test, expect } = require('@playwright/test');

test.describe('PDF Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should show PDF controls', async ({ page }) => {
    const toolbar = page.locator('.pdf-toolbar');
    await expect(toolbar).toBeVisible();
    
    // Check toolbar buttons
    await expect(page.getByRole('button', { name: /Load PDF/ })).toBeVisible();
    await expect(page.locator('#pdf-prev-page')).toBeVisible();
    await expect(page.locator('#pdf-next-page')).toBeVisible();
    await expect(page.locator('#zoom-level')).toBeVisible();
    await expect(page.getByRole('button', { name: /Fit Width/ })).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    const searchBox = page.locator('#pdf-search-input');
    await expect(searchBox).toBeVisible();
    await expect(searchBox).toHaveAttribute('placeholder', 'Search PDF...');
    
    const searchButton = page.locator('#pdf-search-input + button');
    await expect(searchButton).toBeVisible();
  });

  test('should show page navigation controls', async ({ page }) => {
    await expect(page.locator('#page-num')).toHaveValue('1');
    await expect(page.locator('#total-pages')).toContainText('0');
  });

  test('should handle zoom controls', async ({ page }) => {
    const zoomSelect = page.locator('#zoom-level');
    await expect(zoomSelect).toHaveValue('1');
    
    // Test zoom change
    await zoomSelect.selectOption('1.5');
    await expect(zoomSelect).toHaveValue('1.5');
  });

  // Note: PDF loading tests would require actual PDF files and more complex setup
  test('should handle PDF container', async ({ page }) => {
    const container = page.locator('#pdf-container');
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/pdf-container/);
  });
});
