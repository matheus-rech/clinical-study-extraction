// tests/accessibility.spec.js
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Tests', () => {
  
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();
    
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
    await page.waitForLoadState('networkidle');
    
    const formFields = await page.locator('input, textarea, select').all();
    
    for (const field of formFields) {
      const info = await field.evaluate((el) => ({
        id: el.id || null,
        ariaLabel: el.getAttribute('aria-label'),
        placeholder: el.getAttribute('placeholder')
      }));
      if (!info.id) continue;
      const labelText = await page.locator(`label[for="${info.id}"]`).textContent().catch(() => null);
      const hasAccessibleName = Boolean(labelText && labelText.trim()) || Boolean(info.ariaLabel) || Boolean(info.placeholder);
      expect(hasAccessibleName).toBe(true);
    }
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/Clinical Study Master Extraction/);
    
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });
});
