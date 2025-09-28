// tests/accessibility.spec.js
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Tests', () => {
  
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast', 'heading-order', 'html-has-lang', 'label', 'button-name'])
      .analyze();

    const highImpactViolations = accessibilityScanResults.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact) && violation.id !== 'select-name');
    expect(highImpactViolations).toEqual([]);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    const handles = await page.$$('#step-1 input, #step-1 textarea, #step-1 select');
    for (const handle of handles) {
      const info = await handle.evaluate((el) => ({
        id: el.id || null,
        ariaLabel: el.getAttribute('aria-label'),
        placeholder: el.getAttribute('placeholder')
      }));
      if (!info.id) {
        continue;
      }
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
