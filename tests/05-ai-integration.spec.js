// tests/05-ai-integration.spec.js
const { test, expect } = require('@playwright/test');

test.describe('AI Integration', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should handle API key input', async ({ page }) => {
    const apiKeyInput = page.locator('#api-key-input');
    await expect(apiKeyInput).toBeVisible();
    await expect(apiKeyInput).toHaveAttribute('type', 'password');
    
    // Test input
    await apiKeyInput.fill('test-api-key');
    await expect(apiKeyInput).toHaveValue('test-api-key');
    
    // Test save button
    const saveButton = page.getByRole('button', { name: /^Save$/ });
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    
    // Should show status
    const status = page.locator('#api-status');
    await expect(status).toBeVisible();
  });

  test('should show test button for API key', async ({ page }) => {
    const testButton = page.getByRole('button', { name: /^Test$/ });
    await expect(testButton).toBeVisible();
  });

  test('should show AI modal on processing', async ({ page }) => {
    const modal = page.locator('#ai-modal');
    await expect(modal).toBeHidden();
    
    // The modal would be shown during AI processing
    // We can't easily test this without a real API key
  });

  test('should have AI extract functionality per step', async ({ page }) => {
    const aiExtractButton = page.getByRole('button', { name: /AI Extract/ }).first();
    await expect(aiExtractButton).toBeVisible();
    
    // Click should trigger AI extraction (would need API key)
    // For now, just verify the button exists and is clickable
    await expect(aiExtractButton).not.toBeDisabled();
  });
});
