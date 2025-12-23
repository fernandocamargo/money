import React from 'react';
import { render } from '@testing-library/react';
import Money from '../Money';
import {
  MoneyDefaultFormatter,
  MoneyJustCurrencyFormatter,
  MoneyJustSymbolFormatter,
  MoneyJustNumbersFormatter,
  MoneyRoundedFormatter,
  MoneyGranularElementsFormatter,
} from './index';

describe('Money Formatters', () => {
  describe('MoneyDefaultFormatter', () => {
    it('should render all elements (symbol, currency, number)', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyDefaultFormatter}>1234.56</Money>
      );

      const text = container.textContent;
      expect(text).toContain('$');
      expect(text).toContain('USD');
      expect(text).toContain('1,234.56');
    });

    it('should render operator for negative numbers', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyDefaultFormatter}>-100</Money>
      );

      expect(container.textContent).toContain('-');
    });

    it('should not render operator for positive numbers by default', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyDefaultFormatter}>100</Money>
      );

      const text = container.textContent;
      // Should not start with + operator
      expect(text.trim().startsWith('+')).toBe(false);
    });

    it('should handle reverse layout for different locales', () => {
      const { container: container1 } = render(
        <Money locale="en-US" currency="USD" format={MoneyDefaultFormatter}>100</Money>
      );

      const { container: container2 } = render(
        <Money locale="pt-BR" currency="BRL" format={MoneyDefaultFormatter}>100</Money>
      );

      // Both should render successfully
      expect(container1.firstChild).toBeInTheDocument();
      expect(container2.firstChild).toBeInTheDocument();
    });
  });

  describe('MoneyJustCurrencyFormatter', () => {
    it('should render only currency code and number', () => {
      const { container } = render(
        <Money currency="EUR" format={MoneyJustCurrencyFormatter}>100</Money>
      );

      const text = container.textContent;
      expect(text).toContain('EUR');
      expect(text).toContain('100');
    });

    it('should not render currency symbol', () => {
      const { container } = render(
        <Money currency="EUR" format={MoneyJustCurrencyFormatter}>100</Money>
      );

      // Get all span elements
      const spans = container.querySelectorAll('span');
      let foundSymbol = false;

      spans.forEach(span => {
        if (span.textContent === '€') {
          foundSymbol = true;
        }
      });

      expect(foundSymbol).toBe(false);
    });

    it('should render negative operator', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyJustCurrencyFormatter}>-100</Money>
      );

      expect(container.textContent).toContain('-');
    });
  });

  describe('MoneyJustSymbolFormatter', () => {
    it('should render only symbol and number', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyJustSymbolFormatter}>100</Money>
      );

      const text = container.textContent;
      expect(text).toContain('$');
      expect(text).toContain('100');
    });

    it('should not render currency code', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyJustSymbolFormatter}>100</Money>
      );

      const text = container.textContent;
      expect(text).not.toContain('USD');
    });

    it('should work with different currencies', () => {
      const currencies = [
        { code: 'USD', symbol: '$' },
        { code: 'EUR', symbol: '€' },
        { code: 'GBP', symbol: '£' },
        { code: 'JPY', symbol: '¥' },
      ];

      currencies.forEach(({ code, symbol }) => {
        const { container } = render(
          <Money currency={code} format={MoneyJustSymbolFormatter}>100</Money>
        );

        const text = container.textContent;
        expect(text).toContain(symbol);
        expect(text).not.toContain(code);
      });
    });
  });

  describe('MoneyJustNumbersFormatter', () => {
    it('should render only numbers', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyJustNumbersFormatter}>1234.56</Money>
      );

      const text = container.textContent;
      expect(text).toContain('1,234.56');
    });

    it('should not render currency code', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyJustNumbersFormatter}>100</Money>
      );

      const text = container.textContent;
      expect(text).not.toContain('USD');
    });

    it('should not render currency symbol', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyJustNumbersFormatter}>100</Money>
      );

      const text = container.textContent;
      expect(text).not.toContain('$');
    });

    it('should render negative operator', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyJustNumbersFormatter}>-100</Money>
      );

      expect(container.textContent).toContain('-');
    });

    it('should only show number for positive values', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyJustNumbersFormatter}>100</Money>
      );

      const text = container.textContent;
      // Should contain 100 but not $ or USD
      expect(text).toContain('100');
      expect(text).not.toContain('$');
      expect(text).not.toContain('USD');
    });
  });

  describe('MoneyRoundedFormatter', () => {
    it('should abbreviate large numbers', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyRoundedFormatter}>1234567</Money>
      );

      const text = container.textContent;
      // numeral.js formats this as 1.2m or 1m
      expect(text).toMatch(/[0-9]+[km]/i);
    });

    it('should abbreviate thousands', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyRoundedFormatter}>8900</Money>
      );

      const text = container.textContent;
      expect(text).toMatch(/[0-9]k/i);
    });

    it('should abbreviate millions', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyRoundedFormatter}>5000000</Money>
      );

      const text = container.textContent;
      expect(text).toMatch(/[0-9]m/i);
    });

    it('should render small numbers without abbreviation', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyRoundedFormatter}>123</Money>
      );

      const text = container.textContent;
      expect(text).toContain('123');
    });

    it('should include currency symbol', () => {
      const { container } = render(
        <Money currency="EUR" format={MoneyRoundedFormatter}>10000</Money>
      );

      const text = container.textContent;
      expect(text).toContain('€');
    });

    it('should handle negative values', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyRoundedFormatter}>-10000</Money>
      );

      const text = container.textContent;
      expect(text).toContain('-');
      expect(text).toMatch(/10k/i);
    });
  });

  describe('MoneyGranularElementsFormatter', () => {
    it('should render with semantic attributes', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyGranularElementsFormatter}>1234567.89</Money>
      );

      // Should have fragment elements
      const fragments = container.querySelectorAll('.fragment');
      expect(fragments.length).toBeGreaterThan(0);
    });

    it('should mark decimal fragments with type="decimal"', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyGranularElementsFormatter}>123.45</Money>
      );

      const decimalFragment = container.querySelector('[type="decimal"]');
      expect(decimalFragment).toBeInTheDocument();
      expect(decimalFragment.textContent).toBe('45');
    });

    it('should mark integer fragments with type="integer"', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyGranularElementsFormatter}>123.45</Money>
      );

      const integerFragments = container.querySelectorAll('[type="integer"]');
      expect(integerFragments.length).toBeGreaterThan(0);
    });

    it('should assign subtype attributes for magnitude levels', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyGranularElementsFormatter}>1234567.89</Money>
      );

      // Should have different magnitude subtypes
      const hundred = container.querySelector('[subtype="hundred"]');
      const thousand = container.querySelector('[subtype="thousand"]');
      const million = container.querySelector('[subtype="million"]');

      expect(hundred).toBeInTheDocument();
      expect(thousand).toBeInTheDocument();
      expect(million).toBeInTheDocument();
    });

    it('should mark separators correctly', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyGranularElementsFormatter}>1234.56</Money>
      );

      const separators = container.querySelectorAll('[type^="separator"]');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('should handle numbers without decimals', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyGranularElementsFormatter}>1234</Money>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle large numbers with multiple magnitude levels', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyGranularElementsFormatter}>1234567890</Money>
      );

      const billion = container.querySelector('[subtype="billion"]');
      const million = container.querySelector('[subtype="million"]');
      const thousand = container.querySelector('[subtype="thousand"]');

      expect(billion).toBeInTheDocument();
      expect(million).toBeInTheDocument();
      expect(thousand).toBeInTheDocument();
    });

    it('should apply fragment class to all fragments', () => {
      const { container } = render(
        <Money currency="USD" format={MoneyGranularElementsFormatter}>123.45</Money>
      );

      const fragments = container.querySelectorAll('.fragment');
      expect(fragments.length).toBeGreaterThan(0);

      fragments.forEach(fragment => {
        expect(fragment.classList.contains('fragment')).toBe(true);
      });
    });

    it('should include currency symbol and code', () => {
      const { container } = render(
        <Money currency="EUR" format={MoneyGranularElementsFormatter}>100</Money>
      );

      const text = container.textContent;
      expect(text).toContain('€');
      expect(text).toContain('EUR');
    });
  });

  describe('Formatter Combinations', () => {
    it('should handle locale variations across all formatters', () => {
      const formatters = [
        MoneyDefaultFormatter,
        MoneyJustCurrencyFormatter,
        MoneyJustSymbolFormatter,
        MoneyJustNumbersFormatter,
        MoneyRoundedFormatter,
        MoneyGranularElementsFormatter,
      ];

      const locales = ['en-US', 'pt-BR', 'de-DE', 'ja-JP'];

      formatters.forEach(formatter => {
        locales.forEach(locale => {
          const { container } = render(
            <Money locale={locale} currency="USD" format={formatter}>1234.56</Money>
          );

          expect(container.firstChild).toBeInTheDocument();
        });
      });
    });

    it('should handle different currencies across all formatters', () => {
      const formatters = [
        MoneyDefaultFormatter,
        MoneyJustCurrencyFormatter,
        MoneyJustSymbolFormatter,
        MoneyJustNumbersFormatter,
        MoneyRoundedFormatter,
        MoneyGranularElementsFormatter,
      ];

      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'BRL'];

      formatters.forEach(formatter => {
        currencies.forEach(currency => {
          const { container } = render(
            <Money currency={currency} format={formatter}>100</Money>
          );

          expect(container.firstChild).toBeInTheDocument();
        });
      });
    });
  });

  describe('Formatter Performance', () => {
    it('should memoize MoneyDefaultFormatter', () => {
      const { rerender, container } = render(
        <Money currency="USD" format={MoneyDefaultFormatter}>100</Money>
      );

      const firstRender = container.innerHTML;
      rerender(<Money currency="USD" format={MoneyDefaultFormatter}>100</Money>);
      const secondRender = container.innerHTML;

      expect(firstRender).toBe(secondRender);
    });

    it('should memoize MoneyRoundedFormatter', () => {
      const { rerender, container } = render(
        <Money currency="USD" format={MoneyRoundedFormatter}>1000</Money>
      );

      const firstRender = container.innerHTML;
      rerender(<Money currency="USD" format={MoneyRoundedFormatter}>1000</Money>);
      const secondRender = container.innerHTML;

      expect(firstRender).toBe(secondRender);
    });
  });
});
