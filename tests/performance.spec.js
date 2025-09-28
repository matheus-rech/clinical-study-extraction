// tests/performance.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Performance Tests', () => {
  
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large form interactions efficiently', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    
    // Simulate rapid form interactions
    for (let i = 0; i < 50; i++) {
      await page.locator('#citation').fill(`Test citation ${i}`);
      await page.locator('#doi').fill(`10.1234/test.${i}`);
    }
    
    const interactionTime = Date.now() - startTime;
    
    // Should handle interactions within reasonable time
    expect(interactionTime).toBeLessThan(2000);
  });

  test('should maintain performance with many extractions', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    // Mock many extractions
    await page.evaluate(() => {
      if (window.extractionManager) {
        for (let i = 0; i < 100; i++) {
          window.extractionManager.addExtraction({
            fieldName: `field_${i}`,
            text: `Extraction ${i}`,
            page: Math.floor(i / 10) + 1,
            coordinates: { x: 100, y: 150 + i, width: 200, height: 20 },
            method: 'manual',
            documentName: 'test.pdf'
          });
        }
      }
    });
    
    const startTime = Date.now();
    
    // Test UI responsiveness
    await page.locator('#citation').fill('Performance test');
    
    const responseTime = Date.now() - startTime;
    
    // Should remain responsive
    expect(responseTime).toBeLessThan(500);
  });

  test('should handle localStorage efficiently', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    
    // Test localStorage operations
    await page.evaluate(() => {
      const testData = Array(1000).fill(0).map((_, i) => ({
        id: `test_${i}`,
        field: `field_${i}`,
        text: `Test data ${i}`,
        timestamp: new Date().toISOString()
      }));
      
      localStorage.setItem('performance_test', JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem('performance_test'));
      return retrieved.length;
    });
    
    const storageTime = Date.now() - startTime;
    
    // localStorage operations should be fast
    expect(storageTime).toBeLessThan(1000);
  });
});