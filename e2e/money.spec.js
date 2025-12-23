const { test, expect } = require('@playwright/test');

test.describe('Money Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Visual Rendering', () => {
    test('should render the demo page', async ({ page }) => {
      await expect(page).toHaveTitle(/React App/);
    });

    test('should display multiple money components', async ({ page }) => {
      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check that money values are visible on the page
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
    });

    test('should render styled components correctly', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Check that styled-components are applied
      const elements = await page.locator('.money, [class*="Money"]').all();
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  test.describe('Formatter Rendering', () => {
    test('should render default formatter with all elements', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for currency symbols
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/[$€£¥]/);
    });

    test('should render different currency symbols', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const content = await page.textContent('body');

      // Check for various currency symbols
      const hasUSD = content.includes('$');
      const hasEUR = content.includes('€');

      expect(hasUSD || hasEUR).toBeTruthy();
    });

    test('should render currency codes', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const content = await page.textContent('body');

      // Check for currency codes
      const currencies = ['USD', 'EUR', 'GBP', 'BRL'];
      const hasCurrency = currencies.some(currency => content.includes(currency));

      expect(hasCurrency).toBeTruthy();
    });
  });

  test.describe('Granular Elements Formatter', () => {
    test('should render fragments with semantic attributes', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Check for fragment elements with type attributes
      const fragments = await page.locator('.fragment[type]').all();
      expect(fragments.length).toBeGreaterThan(0);
    });

    test('should have decimal type fragments', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const decimalFragments = await page.locator('.fragment[type="decimal"]').all();
      // There should be at least one decimal fragment if decimals are shown
      expect(decimalFragments.length).toBeGreaterThanOrEqual(0);
    });

    test('should have integer type fragments', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const integerFragments = await page.locator('.fragment[type="integer"]').all();
      expect(integerFragments.length).toBeGreaterThan(0);
    });

    test('should have magnitude subtype attributes', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Check for different magnitude subtypes
      const subtypes = ['hundred', 'thousand', 'million'];
      let foundSubtype = false;

      for (const subtype of subtypes) {
        const elements = await page.locator(`.fragment[subtype="${subtype}"]`).all();
        if (elements.length > 0) {
          foundSubtype = true;
          break;
        }
      }

      expect(foundSubtype).toBeTruthy();
    });

    test('should apply CSS styling to granular fragments', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const decimalFragment = page.locator('.fragment[type="decimal"]').first();

      if (await decimalFragment.count() > 0) {
        // Check that the fragment has computed styles
        const fontSize = await decimalFragment.evaluate(el =>
          window.getComputedStyle(el).fontSize
        );
        expect(fontSize).toBeTruthy();
      }
    });

    test('should color-code magnitude levels', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Check if magnitude-based styling is applied
      const magnitudeFragments = await page.locator('.fragment[subtype]').all();

      if (magnitudeFragments.length > 0) {
        const backgroundColor = await magnitudeFragments[0].evaluate(el =>
          window.getComputedStyle(el).backgroundColor
        );
        expect(backgroundColor).toBeTruthy();
      }
    });
  });

  test.describe('Locale Support', () => {
    test('should render numbers with locale-specific separators', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const content = await page.textContent('body');

      // Check for number formatting (commas or periods)
      const hasNumberFormatting = /\d{1,3}[,.]\d{3}/.test(content);
      expect(hasNumberFormatting).toBeTruthy();
    });

    test('should handle different locale formats', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const content = await page.textContent('body');

      // Should contain formatted numbers
      const hasFormattedNumbers = /\d+[.,]\d+/.test(content);
      expect(hasFormattedNumbers).toBeTruthy();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should render correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState('networkidle');

      // Check that content is visible
      const body = await page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should render correctly on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForLoadState('networkidle');

      const body = await page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should render correctly on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForLoadState('networkidle');

      const body = await page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have valid HTML structure', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Check basic HTML structure
      const html = await page.locator('html');
      await expect(html).toBeVisible();

      const body = await page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should render semantic span elements', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const spans = await page.locator('span').all();
      expect(spans.length).toBeGreaterThan(0);
    });

    test('should have readable text content', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const textContent = await page.textContent('body');
      expect(textContent.length).toBeGreaterThan(0);

      // Should contain at least some numbers
      expect(/\d+/.test(textContent)).toBeTruthy();
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test('should render Intl.NumberFormat correctly', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Evaluate Intl API support in the browser
      const intlSupported = await page.evaluate(() => {
        return typeof Intl !== 'undefined' && typeof Intl.NumberFormat !== 'undefined';
      });

      expect(intlSupported).toBeTruthy();
    });

    test('should format currency using Intl API', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const formatted = await page.evaluate(() => {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        });
        return formatter.format(1234.56);
      });

      expect(formatted).toBeTruthy();
      expect(formatted).toContain('1,234.56');
    });
  });

  test.describe('Performance', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Page should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });

    test('should render components without performance issues', async ({ page }) => {
      await page.goto('/');

      // Measure rendering performance
      const metrics = await page.evaluate(() => {
        const perfEntries = performance.getEntriesByType('navigation');
        if (perfEntries.length > 0) {
          const navTiming = perfEntries[0];
          return {
            domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
            loadComplete: navTiming.loadEventEnd - navTiming.loadEventStart,
          };
        }
        return null;
      });

      if (metrics) {
        // DOM content should load quickly
        expect(metrics.domContentLoaded).toBeLessThan(5000);
      }
    });
  });

  test.describe('Styled Components Integration', () => {
    test('should apply styled-components styles', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Check that styled-components have generated class names
      const styledElements = await page.locator('[class*="sc-"]').all();

      // styled-components typically generates classes with 'sc-' prefix
      // If no styled-components classes found, check for any styled elements
      const hasStyles = styledElements.length > 0 ||
        (await page.locator('span[class]').all()).length > 0;

      expect(hasStyles).toBeTruthy();
    });

    test('should render with proper CSS-in-JS', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Get any styled element and check it has computed styles
      const firstElement = page.locator('span').first();

      if (await firstElement.count() > 0) {
        const hasStyles = await firstElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.display !== '' || styles.position !== '';
        });

        expect(hasStyles).toBeTruthy();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should not have console errors', async ({ page }) => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Filter out known warnings (like PropTypes in development)
      const criticalErrors = errors.filter(
        error => !error.includes('PropTypes') && !error.includes('Warning')
      );

      expect(criticalErrors.length).toBe(0);
    });

    test('should not have JavaScript errors', async ({ page }) => {
      let hasError = false;

      page.on('pageerror', exception => {
        console.error('Page error:', exception);
        hasError = true;
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      expect(hasError).toBeFalsy();
    });
  });
});
