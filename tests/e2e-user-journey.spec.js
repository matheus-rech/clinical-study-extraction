// tests/e2e-user-journey.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const fsp = fs.promises;
const ARTICLES_DIR = path.resolve(__dirname, '..', 'Articles');

function resolveArticlePath(requestedName) {
  const directPath = path.join(ARTICLES_DIR, requestedName);
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  const normalized = fs.readdirSync(ARTICLES_DIR).find((file) => file.trim() === requestedName.trim());
  if (normalized) {
    return path.join(ARTICLES_DIR, normalized);
  }

  throw new Error(`Unable to find article file for "${requestedName}" in ${ARTICLES_DIR}`);
}

test.describe('Clinical researcher journey', () => {
  test('processes a queued article end-to-end', async ({ page }, testInfo) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');

    await page.waitForFunction(() => typeof initializeRandomizedQueue === 'function');
    await page.evaluate(() => {
      if (typeof initializeRandomizedQueue === 'function') {
        initializeRandomizedQueue();
      }
      if (typeof updateSystematicReviewUI === 'function') {
        updateSystematicReviewUI();
      }
    });

    const initialQueueToggle = page.locator('button[onclick="toggleArticlesList()"]').first();
    await initialQueueToggle.click();

    const currentArticleHandle = await page.waitForFunction(() => {
      const firstItem = document.querySelector('#articles-container .article-item');
      if (!firstItem) {
        return null;
      }
      const label = firstItem.querySelector('div');
      if (!label) {
        return null;
      }
      const text = label.textContent || '';
      const match = text.match(/\d+\.\s*(.*?)\s*(?:\(|$)/);
      return match ? match[1] : null;
    });
    const articleName = await currentArticleHandle.jsonValue();
    expect(articleName, 'expected a current article listed in the queue').toBeTruthy();

    const articlePath = resolveArticlePath(articleName);

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('#articles-container .article-item').first().click(),
    ]);
    await fileChooser.setFiles(articlePath);

    await expect(page.locator('#status-message')).toContainText(/PDF loaded successfully/i, { timeout: 10000 });
    await expect(page.locator('#total-pages')).not.toHaveText('0', { timeout: 10000 });

    const citationField = page.locator('#citation');
    await citationField.click();

    const targetSpan = page.locator('.textLayer span').filter({ hasText: /[A-Za-z]{4,}/ }).first();
    await targetSpan.waitFor({ state: 'visible', timeout: 10000 });

    const extractedText = (await targetSpan.textContent() || '').trim();
    expect(extractedText.length, 'extracted text should not be empty').toBeGreaterThan(0);

    await targetSpan.click();

    await expect(citationField).toHaveValue(extractedText, { timeout: 5000 });
    await expect(citationField).toHaveClass(/has-extraction/);
    await expect(page.locator('#trace-log .trace-entry').first()).toContainText(extractedText.slice(0, Math.min(40, extractedText.length)));

    await page.getByRole('button', { name: /Save Progress/ }).click();
    await expect(page.locator('#status-message')).toContainText(/Progress saved successfully/i, { timeout: 5000 });
    await expect(page.locator('#in-progress-count')).toHaveText('1');

    const firstArticleRow = page.locator('#articles-container .article-item').first();
    await expect(firstArticleRow).toContainText(/1 fields completed/);

    const jsonButton = page.getByRole('button', { name: /JSON/ });
    await expect(jsonButton).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await jsonButton.click();
    const download = await downloadPromise;
    const downloadPath = testInfo.outputPath('extraction.json');
    await download.saveAs(downloadPath);

    const jsonContent = JSON.parse(await fsp.readFile(downloadPath, 'utf-8'));
    expect(jsonContent.formData.citation).toBe(extractedText);
    expect(jsonContent.extractions.length).toBeGreaterThanOrEqual(1);
    expect(jsonContent.extractions[0].fieldName).toBe('citation');

    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#extraction-count')).toHaveText('1', { timeout: 5000 });

    const queueButton = page.getByRole('button', { name: /Queue/ });
    await queueButton.click();

    const [fileChooser2] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('#articles-container .article-item').first().click(),
    ]);
    await fileChooser2.setFiles(articlePath);

    await expect(citationField).toHaveValue(extractedText, { timeout: 10000 });
    await expect(page.locator('#status-message')).toContainText(/Previous progress restored/i, { timeout: 10000 });
  });
});
