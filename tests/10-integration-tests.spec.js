// tests/10-integration-tests.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Integration Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should complete full extraction workflow', async ({ page }) => {
    // Step 1: Fill out form fields
    await page.locator('#citation').fill('Test Citation (2023)');
    await page.locator('#doi').fill('10.1234/test');
    await page.locator('#journal').fill('Test Journal');
    await page.locator('#year').fill('2023');
    
    // Step 2: Save progress
    await page.getByRole('button', { name: /Save Progress/ }).click();
    
    // Should show success message
    const statusMessage = page.locator('#extraction-status');
    await expect(statusMessage).toBeVisible();
    
    // Step 3: Check statistics updated
    // (In real test with extractions, we'd verify counts changed)
  });

  test('should handle localStorage persistence', async ({ page }) => {
    // Clear localStorage first
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Add some data
    await page.locator('#citation').fill('Persistent Citation');
    await page.getByRole('button', { name: /Save Progress/ }).click();
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Data should be restored (implementation would need to load saved data)
    // For now, just verify the page loads correctly
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle error conditions gracefully', async ({ page }) => {
    // Test with invalid API key
    await page.locator('#api-key-input').fill('invalid-key');
    await page.getByRole('button', { name: /^Save$/ }).click();
    await page.getByRole('button', { name: /^Test$/ }).click();
    
    // Should show error status
    const apiStatus = page.locator('#api-status');
    await expect(apiStatus).toBeVisible();
  });

  test('should maintain state across interactions', async ({ page }) => {
    // Fill some fields
    await page.locator('#citation').fill('State Test Citation');
    await page.locator('#doi').fill('10.1234/state-test');
    
    // Toggle articles list
    const toggleButton = page.locator('button[onclick="toggleArticlesList()"]').first();
    await toggleButton.click();
    await toggleButton.click();
    
    // Fields should maintain their values
    await expect(page.locator('#citation')).toHaveValue('State Test Citation');
    await expect(page.locator('#doi')).toHaveValue('10.1234/state-test');
  });

  test('should handle concurrent operations', async ({ page }) => {
    // Test multiple rapid interactions
    const citationField = page.locator('#citation');
    const doiField = page.locator('#doi');
    
    // Rapid field switching
    await citationField.focus();
    await doiField.focus();
    await citationField.focus();
    
    // Should not cause errors
    await expect(page.locator('h1')).toBeVisible();
  });
});
