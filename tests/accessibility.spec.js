// tests/accessibility.spec.js
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Tests', () => {
  
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    // Test tab navigation through form fields
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Continue tabbing through interactive elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check for proper form labels
    const formFields = await page.locator('input, textarea, select').all();
    
    for (const field of formFields) {
      const id = await field.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check for proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/Clinical Study Master Extraction/);
    
    // Check for descriptive button text
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });
});