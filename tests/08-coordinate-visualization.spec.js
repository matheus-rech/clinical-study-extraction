// tests/08-coordinate-visualization.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Coordinate Visualization', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should show interactive coordinate map button', async ({ page }) => {
    const mapButton = page.getByRole('button', { name: /Interactive Coordinate Map/ });
    await expect(mapButton).toBeVisible();
  });

  test('should show export interactive map button', async ({ page }) => {
    const exportMapButton = page.getByRole('button', { name: /Export Interactive Map/ });
    await expect(exportMapButton).toBeVisible();
  });

  test('should open coordinate visualizer modal', async ({ page }) => {
    const mapButton = page.getByRole('button', { name: /Interactive Coordinate Map/ });
    await mapButton.click();
    
    const modal = page.locator('#coordinate-visualizer');
    await expect(modal).toBeVisible();
    
    // Check modal content
    await expect(page.getByText('Interactive Extraction Coordinate Map')).toBeVisible();
    await expect(page.locator('#viz-article-select')).toBeVisible();
  });

  test('should close coordinate visualizer', async ({ page }) => {
    // Open modal first
    await page.getByRole('button', { name: /Interactive Coordinate Map/ }).click();
    
    const modal = page.locator('#coordinate-visualizer');
    await expect(modal).toBeVisible();
    
    // Close modal
    const closeButton = page.getByRole('button', { name: /Close/ });
    await closeButton.click();
    
    await expect(modal).toBeHidden();
  });

  test('should show visualizer controls', async ({ page }) => {
    await page.getByRole('button', { name: /Interactive Coordinate Map/ }).click();
    
    // Check for visualizer controls
    await expect(page.locator('#viz-field-list')).toBeAttached();
    await expect(page.locator('#viz-pdf-container')).toBeAttached();
    await expect(page.locator('#viz-coordinate-details')).toBeAttached();
  });
});
