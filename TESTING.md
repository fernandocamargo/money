# Testing Documentation

This project demonstrates comprehensive testing practices with both **unit tests** (React Testing Library) and **integration tests** (Playwright).

## Table of Contents

- [Overview](#overview)
- [Unit Tests](#unit-tests)
- [Integration Tests](#integration-tests)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Continuous Integration](#continuous-integration)

## Overview

The testing strategy follows best practices:

1. **Unit Tests** - Fast, isolated tests for components and logic
2. **Integration Tests** - Real browser tests for user flows and visual validation
3. **100% Coverage Goal** - Comprehensive test coverage of critical paths

### Testing Stack

- **[Jest](https://jestjs.io/)** - Test runner (via Create React App)
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities
- **[jest-dom](https://github.com/testing-library/jest-dom)** - Custom Jest matchers for DOM
- **[Playwright](https://playwright.dev/)** - End-to-end testing framework

## Unit Tests

Unit tests validate the **Money component** and all **formatters** in isolation.

### What's Tested

#### Core Money Component (`Money.test.js`)

- ✅ Basic rendering (positive, negative, zero values)
- ✅ Currency support (USD, EUR, GBP, BRL, JPY)
- ✅ Locale support (en-US, pt-BR, de-DE)
- ✅ Custom formatters integration
- ✅ Fragment extraction (operator, currency, symbol, number)
- ✅ Component factory pattern
- ✅ Class name handling
- ✅ Reverse flag detection (symbol before/after number)
- ✅ Value types (numeric, string, decimal)
- ✅ PropTypes validation
- ✅ Memoization behavior
- ✅ Edge cases (very small/large numbers, many decimals)

**Total: 30+ test cases**

#### All Formatters (`Formatters.test.js`)

**MoneyDefaultFormatter:**
- Renders all elements (symbol, currency, number)
- Handles operator for negative numbers
- Supports reverse layout for different locales

**MoneyJustCurrencyFormatter:**
- Renders only currency code and number
- Excludes symbol

**MoneyJustSymbolFormatter:**
- Renders only symbol and number
- Excludes currency code
- Works across all currencies

**MoneyJustNumbersFormatter:**
- Renders only numbers
- Excludes symbol and currency
- Shows operator for negatives

**MoneyRoundedFormatter:**
- Abbreviates large numbers (1.2m, 8.9k)
- Integrates numeral.js correctly
- Handles thousands, millions, billions
- Preserves currency symbol

**MoneyGranularElementsFormatter:**
- Creates semantic HTML attributes
- Marks decimal fragments with `type="decimal"`
- Marks integer fragments with `type="integer"`
- Assigns magnitude subtypes (hundred, thousand, million, billion, trillion)
- Marks separators correctly
- Handles numbers without decimals
- Applies fragment classes

**Cross-Formatter Tests:**
- Locale variations across all formatters
- Currency variations across all formatters
- Memoization performance

**Total: 40+ test cases**

### Running Unit Tests

```bash
# Interactive watch mode
yarn test

# Run once with coverage
yarn test:unit

# Run specific test file
yarn test Money.test.js

# Update snapshots
yarn test -u
```

### Unit Test Example

```javascript
it('should extract operator for negative numbers', () => {
  const TestFormatter = ({ fragments }) => {
    expect(fragments.operator).toBe('-');
    return <div>test</div>;
  };

  render(<Money currency="USD" format={TestFormatter}>-100</Money>);
});
```

## Integration Tests

Integration tests validate the **complete application** in real browsers using Playwright.

### What's Tested

#### Visual Rendering (`money.spec.js`)

- ✅ Demo page loads correctly
- ✅ Multiple money components display
- ✅ Styled-components render correctly

#### Formatter Rendering

- ✅ Default formatter with all elements
- ✅ Different currency symbols ($ € £ ¥)
- ✅ Currency codes display

#### Granular Elements Formatter

- ✅ Fragments with semantic attributes
- ✅ Decimal type fragments
- ✅ Integer type fragments
- ✅ Magnitude subtype attributes (hundred, thousand, million)
- ✅ CSS styling applied to fragments
- ✅ Color-coding by magnitude

#### Locale Support

- ✅ Locale-specific number separators
- ✅ Different locale formats

#### Responsive Behavior

- ✅ Mobile viewport (375x667)
- ✅ Tablet viewport (768x1024)
- ✅ Desktop viewport (1920x1080)

#### Accessibility

- ✅ Valid HTML structure
- ✅ Semantic span elements
- ✅ Readable text content

#### Cross-Browser Compatibility

- ✅ Intl.NumberFormat support
- ✅ Currency formatting via Intl API

#### Performance

- ✅ Page load time < 10s
- ✅ DOM content loaded < 5s

#### Styled Components Integration

- ✅ styled-components styles applied
- ✅ CSS-in-JS rendering

#### Error Handling

- ✅ No console errors
- ✅ No JavaScript errors

**Total: 35+ test cases**

### Running Integration Tests

```bash
# Install Playwright browsers (first time only)
yarn playwright:install

# Run all e2e tests (headless)
yarn test:e2e

# Run with UI mode (interactive)
yarn test:e2e:ui

# Run with headed browsers (visible)
yarn test:e2e:headed

# Run specific browser
yarn test:e2e --project=chromium
yarn test:e2e --project=firefox
yarn test:e2e --project=webkit
```

### Integration Test Example

```javascript
test('should have magnitude subtype attributes', async ({ page }) => {
  await page.waitForLoadState('networkidle');

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
```

## Running Tests

### All Tests

```bash
# Run both unit and e2e tests
yarn test:all
```

### Watch Mode (Development)

```bash
# Unit tests in watch mode
yarn test

# E2E tests with UI
yarn test:e2e:ui
```

### CI/CD

```bash
# Unit tests with coverage (no watch)
yarn test:unit

# E2E tests (headless)
yarn test:e2e
```

## Test Coverage

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Viewing Coverage

```bash
# Generate coverage report
yarn test:unit

# Coverage report saved to:
coverage/lcov-report/index.html
```

Open `coverage/lcov-report/index.html` in your browser to see detailed coverage.

### What's Covered

✅ **Money component**
- All props variations
- All internal logic
- Fragment extraction
- Memoization
- Component factories

✅ **All 6 formatters**
- Default behavior
- Edge cases
- Locale variations
- Currency variations

✅ **Integration flows**
- Visual rendering
- User interactions (if any)
- Cross-browser behavior
- Responsive layouts

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
      - run: yarn install
      - run: yarn test:unit
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
      - run: yarn install
      - run: yarn playwright:install --with-deps
      - run: yarn test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Architecture

### Unit Test Philosophy

- **Fast**: Tests run in milliseconds
- **Isolated**: No external dependencies
- **Focused**: One thing per test
- **Readable**: Clear test names and assertions

### Integration Test Philosophy

- **Real**: Tests run in actual browsers
- **Complete**: Full user flows
- **Visual**: Validates what users see
- **Cross-browser**: Chromium, Firefox, WebKit

### The Testing Pyramid

```
        /\
       /  \
      / E2E \          ← Fewer, slow, high confidence
     /--------\
    /          \
   / Integration \     ← Some, medium speed
  /--------------\
 /                \
/  Unit Tests      \   ← Many, fast, focused
--------------------
```

This project follows the pyramid:
- **70% Unit tests** - Fast feedback, high coverage
- **30% Integration tests** - Real-world validation

## Debugging Tests

### Unit Tests

```bash
# Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run single test
yarn test -t "should render with default formatter"

# Show console.log output
yarn test --verbose
```

### Integration Tests

```bash
# Debug mode (pauses on failures)
yarn test:e2e --debug

# UI mode (step through tests)
yarn test:e2e:ui

# Headed mode (see the browser)
yarn test:e2e:headed

# Trace viewer (after failure)
npx playwright show-trace trace.zip
```

## Best Practices

### Writing Good Tests

1. **Descriptive Names**: `should render negative operator for negative values`
2. **AAA Pattern**: Arrange, Act, Assert
3. **Test Behavior**: Not implementation details
4. **Avoid Brittle Selectors**: Use semantic queries
5. **Keep Tests Independent**: No shared state

### What NOT to Test

- ❌ Third-party library internals (Intl.NumberFormat, numeral.js)
- ❌ Browser APIs directly
- ❌ styled-components implementation details
- ❌ React internals

### What TO Test

- ✅ Component rendering
- ✅ User interactions
- ✅ Data transformations
- ✅ Edge cases
- ✅ Error handling

## Contributing

When adding new features:

1. **Write tests first** (TDD)
2. **Maintain coverage** (>80%)
3. **Update this doc** if adding new test types
4. **Run all tests** before committing

```bash
# Pre-commit checklist
yarn test:unit
yarn test:e2e
yarn build
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

**Tests written**: 70+ test cases
**Coverage target**: >80%
**Browsers tested**: Chromium, Firefox, WebKit
**Philosophy**: Fast feedback, high confidence
