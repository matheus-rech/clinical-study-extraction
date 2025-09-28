# End-to-End Testing

This directory contains comprehensive end-to-end tests for the Clinical Study Extraction System using Playwright.

## 🎯 Test Coverage

### Core Functionality Tests
- **01-basic-functionality.spec.js**: Application loading, UI components, basic interactions
- **02-pdf-functionality.spec.js**: PDF viewer controls, navigation, search functionality  
- **03-systematic-review.spec.js**: Sequential workflow, progress tracking, database management
- **04-form-interaction.spec.js**: Form field handling, validation, active state management
- **05-ai-integration.spec.js**: API key management, AI extraction triggers, error handling
- **06-extraction-tracking.spec.js**: Trace logging, statistics, undo/clear operations
- **07-export-functionality.spec.js**: All export formats, download handling, data integrity
- **08-coordinate-visualization.spec.js**: Interactive mapping, modal behavior, navigation
- **09-responsive-design.spec.js**: Multi-viewport testing, mobile compatibility
- **10-integration-tests.spec.js**: Full workflow testing, state persistence, error handling

### Specialized Tests
- **accessibility.spec.js**: WCAG compliance, keyboard navigation, screen reader support
- **performance.spec.js**: Load times, interaction responsiveness, memory usage

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Playwright browsers**:
   ```bash
   npm run install:browsers
   ```

### Running Tests

**All tests**:
```bash
npm test
```

**With browser UI visible**:
```bash
npm run test:headed
```

**Interactive debugging**:
```bash
npm run test:debug
```

**UI mode for test development**:
```bash
npm run test:ui
```

**View test reports**:
```bash
npm run test:report
```

### Test Configuration

Tests are configured in `playwright.config.js` with:
- **Multiple browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Automatic screenshots** on failure
- **Video recording** for failed tests
- **Trace collection** for debugging
- **HTML reports** with detailed results

## 📊 Test Structure

### Test Organization
```
tests/
├── 01-basic-functionality.spec.js     # Core app functionality
├── 02-pdf-functionality.spec.js       # PDF viewer features
├── 03-systematic-review.spec.js       # SR workflow
├── 04-form-interaction.spec.js        # Form handling
├── 05-ai-integration.spec.js          # AI features
├── 06-extraction-tracking.spec.js     # Data tracking
├── 07-export-functionality.spec.js    # Export features
├── 08-coordinate-visualization.spec.js # Interactive mapping
├── 09-responsive-design.spec.js       # UI responsiveness
├── 10-integration-tests.spec.js       # End-to-end workflows
├── accessibility.spec.js              # WCAG compliance
├── performance.spec.js                # Performance metrics
├── fixtures/
│   └── test-data.js                   # Test data sets
└── helpers/
    └── test-helpers.js                # Utility functions
```

### Helper Classes

**TestHelpers** class provides:
- Form field filling utilities
- localStorage mocking
- Status message verification
- Download testing helpers
- PDF simulation functions
- Extraction data creation

## 🔧 Writing New Tests

### Basic Test Structure
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

### Using Test Helpers
```javascript
const { TestHelpers } = require('./helpers/test-helpers');

test('should handle form data', async ({ page }) => {
  const helpers = new TestHelpers(page);
  
  await helpers.fillFormFields({
    citation: 'Test Citation',
    doi: '10.1234/test'
  });
  
  await helpers.waitForStatusMessage('Success');
});
```

## 🚨 CI/CD Integration

Tests run automatically on:
- **Push to main/develop branches**
- **Pull requests**
- **Multiple browser matrix** (Chrome, Firefox, Safari)
- **Accessibility testing**
- **Performance benchmarking**

### GitHub Actions Workflow
- Installs dependencies and browsers
- Runs tests in parallel across browsers
- Uploads artifacts (reports, screenshots, videos)
- Reports results in PR checks

## 📈 Test Reports

After running tests, view detailed reports:
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results.json`
- **JUnit XML**: `test-results.xml`

Reports include:
- Test execution timeline
- Screenshots of failures
- Video recordings
- Network activity logs
- Console output
- Performance metrics

## 🐛 Debugging Tests

### Local Debugging
```bash
# Run specific test in debug mode
npx playwright test tests/01-basic-functionality.spec.js --debug

# Record new test actions
npx playwright codegen localhost:8080/index.html
```

### Common Issues
- **Timeouts**: Increase timeout for slow operations
- **Flaky tests**: Add proper wait conditions
- **Element not found**: Use better selectors
- **Download tests**: Handle browser download permissions

## 📝 Best Practices

### Test Writing
- Use descriptive test names
- Add proper wait conditions
- Mock external dependencies
- Test both success and error cases
- Keep tests independent

### Selectors
- Prefer accessible selectors (role, label)
- Use data-testid for stable automation
- Avoid CSS selectors when possible

### Assertions
- Use specific assertions (toHaveText vs toBeVisible)
- Test user-facing behavior, not implementation
- Verify both positive and negative cases

## 🔍 Maintenance

### Regular Tasks
- Update test data for new features
- Review and update selectors
- Monitor test execution times
- Update browser versions
- Review accessibility compliance

### Performance Monitoring
- Track test execution time trends
- Monitor application load times
- Check memory usage patterns
- Verify mobile performance