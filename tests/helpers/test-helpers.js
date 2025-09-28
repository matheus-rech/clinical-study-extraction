/**
 * Helper functions for Playwright tests
 */

class TestHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Fill form fields with test data
   */
  async fillFormFields(data) {
    for (const [fieldId, value] of Object.entries(data)) {
      const field = this.page.locator(`#${fieldId}`);
      await field.fill(value);
    }
  }

  /**
   * Mock localStorage with test data
   */
  async mockLocalStorage(data) {
    await this.page.addInitScript((testData) => {
      Object.entries(testData).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
    }, data);
  }

  /**
   * Wait for status message to appear
   */
  async waitForStatusMessage(expectedText, timeout = 5000) {
    const statusMessage = this.page.locator('#extraction-status');
    await statusMessage.waitFor({ state: 'visible', timeout });
    
    if (expectedText) {
      await expect(statusMessage).toContainText(expectedText);
    }
    
    return statusMessage;
  }

  /**
   * Check if download was triggered
   */
  async expectDownload(action) {
    const downloadPromise = this.page.waitForEvent('download');
    await action();
    const download = await downloadPromise;
    return download;
  }

  /**
   * Mock window.confirm dialog
   */
  async mockConfirmDialog(returnValue = true) {
    await this.page.evaluate((value) => {
      window.confirm = () => value;
    }, returnValue);
  }

  /**
   * Mock window.alert dialog
   */
  async mockAlertDialog() {
    const alerts = [];
    this.page.on('dialog', async (dialog) => {
      alerts.push(dialog.message());
      await dialog.accept();
    });
    return alerts;
  }

  /**
   * Simulate PDF loading (without actual file)
   */
  async simulatePDFLoad() {
    await this.page.evaluate(() => {
      // Mock PDF.js globals
      window.pdfjsLib = {
        getDocument: () => ({
          promise: Promise.resolve({
            numPages: 5,
            getPage: (pageNum) => Promise.resolve({
              getViewport: () => ({ width: 800, height: 1000 }),
              render: () => ({ promise: Promise.resolve() }),
              getTextContent: () => Promise.resolve({
                items: [
                  { str: 'Sample PDF text', transform: [1, 0, 0, 1, 100, 100] }
                ]
              })
            })
          })
        }),
        GlobalWorkerOptions: { workerSrc: '' }
      };
      
      // Mock file loading
      if (window.AppState) {
        window.AppState.totalPages = 5;
        window.AppState.documentName = 'test-document.pdf';
      }
    });
  }

  /**
   * Create test extraction data
   */
  async createTestExtractions(count = 3) {
    await this.page.evaluate((extractionCount) => {
      if (window.extractionManager) {
        for (let i = 0; i < extractionCount; i++) {
          window.extractionManager.addExtraction({
            fieldName: `field_${i}`,
            text: `Test extraction ${i}`,
            page: Math.floor(i / 2) + 1,
            coordinates: { x: 100 + i * 50, y: 150 + i * 30, width: 200, height: 20 },
            method: i % 2 === 0 ? 'manual' : 'ai',
            documentName: 'test-document.pdf'
          });
        }
      }
    }, count);
  }

  /**
   * Verify extraction statistics
   */
  async verifyExtractionStats(expectedStats) {
    const { total = 0, manual = 0, ai = 0, pages = 0 } = expectedStats;
    
    await expect(this.page.locator('#extraction-count')).toContainText(total.toString());
    await expect(this.page.locator('#ai-extraction-count')).toContainText(ai.toString());
    await expect(this.page.locator('#pages-with-data')).toContainText(pages.toString());
  }

  /**
   * Check if elements are properly styled
   */
  async verifyElementStyling(selector, expectedStyles) {
    const element = this.page.locator(selector);
    
    for (const [property, value] of Object.entries(expectedStyles)) {
      await expect(element).toHaveCSS(property, value);
    }
  }
}

module.exports = { TestHelpers };