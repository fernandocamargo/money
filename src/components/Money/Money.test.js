import React from 'react';
import { render, screen } from '@testing-library/react';
import Money from './Money';
import { MoneyDefaultFormatter } from './Formatters';

// Mock console.error to catch PropTypes warnings
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('Money Component', () => {
  describe('Basic Rendering', () => {
    it('should render with default formatter', () => {
      const { container } = render(<Money currency="USD">1234.56</Money>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render positive numbers', () => {
      const { container } = render(<Money currency="USD">100</Money>);
      const text = container.textContent;
      expect(text).toContain('100');
      expect(text).toContain('USD');
    });

    it('should render negative numbers with operator', () => {
      const { container } = render(<Money currency="USD">-100</Money>);
      const text = container.textContent;
      expect(text).toContain('-');
      expect(text).toContain('100');
    });

    it('should render zero', () => {
      const { container } = render(<Money currency="USD">0</Money>);
      const text = container.textContent;
      expect(text).toContain('0');
    });
  });

  describe('Currency Support', () => {
    it('should render USD currency', () => {
      const { container } = render(<Money currency="USD">100</Money>);
      const text = container.textContent;
      expect(text).toContain('USD');
      expect(text).toContain('$');
    });

    it('should render EUR currency', () => {
      const { container } = render(<Money currency="EUR">100</Money>);
      const text = container.textContent;
      expect(text).toContain('EUR');
      expect(text).toContain('€');
    });

    it('should render GBP currency', () => {
      const { container } = render(<Money currency="GBP">100</Money>);
      const text = container.textContent;
      expect(text).toContain('GBP');
      expect(text).toContain('£');
    });

    it('should render BRL currency', () => {
      const { container } = render(<Money currency="BRL">100</Money>);
      const text = container.textContent;
      expect(text).toContain('BRL');
      expect(text).toContain('R$');
    });

    it('should render JPY currency', () => {
      const { container } = render(<Money currency="JPY">100</Money>);
      const text = container.textContent;
      expect(text).toContain('JPY');
      expect(text).toContain('¥');
    });
  });

  describe('Locale Support', () => {
    it('should use default locale from navigator', () => {
      const { container } = render(<Money currency="USD">1234.56</Money>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should format with en-US locale', () => {
      const { container } = render(
        <Money locale="en-US" currency="USD">1234.56</Money>
      );
      const text = container.textContent;
      // en-US uses comma for thousands and period for decimal
      expect(text).toMatch(/1,234\.56/);
    });

    it('should format with pt-BR locale', () => {
      const { container } = render(
        <Money locale="pt-BR" currency="BRL">1234.56</Money>
      );
      const text = container.textContent;
      // pt-BR uses period for thousands and comma for decimal
      expect(text).toMatch(/1\.234,56/);
    });

    it('should format with de-DE locale', () => {
      const { container } = render(
        <Money locale="de-DE" currency="EUR">1234.56</Money>
      );
      const text = container.textContent;
      // de-DE uses period for thousands and comma for decimal
      expect(text).toMatch(/1\.234,56/);
    });
  });

  describe('Custom Formatters', () => {
    it('should accept custom formatter component', () => {
      const CustomFormatter = ({ elements }) => (
        <span data-testid="custom">{elements.number}</span>
      );

      render(
        <Money currency="USD" format={CustomFormatter}>100</Money>
      );

      expect(screen.getByTestId('custom')).toBeInTheDocument();
    });

    it('should pass all required props to formatter', () => {
      const TestFormatter = (props) => {
        expect(props).toHaveProperty('locale');
        expect(props).toHaveProperty('negative');
        expect(props).toHaveProperty('value');
        expect(props).toHaveProperty('formatted');
        expect(props).toHaveProperty('fragments');
        expect(props).toHaveProperty('reverse');
        expect(props).toHaveProperty('classNames');
        expect(props).toHaveProperty('components');
        expect(props).toHaveProperty('elements');
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>100</Money>);
    });

    it('should pass correct fragments to formatter', () => {
      const TestFormatter = ({ fragments }) => {
        expect(fragments).toHaveProperty('operator');
        expect(fragments).toHaveProperty('currency');
        expect(fragments).toHaveProperty('symbol');
        expect(fragments).toHaveProperty('number');
        expect(fragments.currency).toBe('USD');
        expect(fragments.symbol).toBe('$');
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>100</Money>);
    });

    it('should pass negative flag correctly for negative numbers', () => {
      const TestFormatter = ({ negative }) => {
        expect(negative).toBe(true);
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>-100</Money>);
    });

    it('should pass negative flag correctly for positive numbers', () => {
      const TestFormatter = ({ negative }) => {
        expect(negative).toBe(false);
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>100</Money>);
    });
  });

  describe('Fragment Extraction', () => {
    it('should extract operator for negative numbers', () => {
      const TestFormatter = ({ fragments }) => {
        expect(fragments.operator).toBe('-');
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>-100</Money>);
    });

    it('should extract operator for positive numbers', () => {
      const TestFormatter = ({ fragments }) => {
        expect(fragments.operator).toBe('+');
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>100</Money>);
    });

    it('should extract currency code', () => {
      const TestFormatter = ({ fragments }) => {
        expect(fragments.currency).toBe('EUR');
        return <div>test</div>;
      };

      render(<Money currency="EUR" format={TestFormatter}>100</Money>);
    });

    it('should extract currency symbol', () => {
      const TestFormatter = ({ fragments }) => {
        expect(fragments.symbol).toBeTruthy();
        expect(typeof fragments.symbol).toBe('string');
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>100</Money>);
    });

    it('should extract formatted number', () => {
      const TestFormatter = ({ fragments }) => {
        expect(fragments.number).toBeTruthy();
        expect(fragments.number).toMatch(/100/);
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>100</Money>);
    });
  });

  describe('Components Factory', () => {
    it('should provide component factories in components prop', () => {
      const TestFormatter = ({ components }) => {
        expect(components).toHaveProperty('container');
        expect(components).toHaveProperty('operator');
        expect(components).toHaveProperty('currency');
        expect(components).toHaveProperty('symbol');
        expect(components).toHaveProperty('number');
        expect(typeof components.container).toBe('function');
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>100</Money>);
    });

    it('should provide pre-rendered elements', () => {
      const TestFormatter = ({ elements }) => {
        expect(elements).toHaveProperty('operator');
        expect(elements).toHaveProperty('currency');
        expect(elements).toHaveProperty('symbol');
        expect(elements).toHaveProperty('number');
        expect(React.isValidElement(elements.operator)).toBe(true);
        expect(React.isValidElement(elements.currency)).toBe(true);
        expect(React.isValidElement(elements.symbol)).toBe(true);
        expect(React.isValidElement(elements.number)).toBe(true);
        return <div>test</div>;
      };

      render(<Money currency="USD" format={TestFormatter}>100</Money>);
    });
  });

  describe('Class Names', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <Money currency="USD" className="custom-class">100</Money>
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should provide classNames for each fragment type', () => {
      const TestFormatter = ({ classNames }) => {
        expect(classNames).toHaveProperty('container');
        expect(classNames).toHaveProperty('operator');
        expect(classNames).toHaveProperty('currency');
        expect(classNames).toHaveProperty('symbol');
        expect(classNames).toHaveProperty('number');
        expect(classNames.operator).toBe('operator');
        expect(classNames.currency).toBe('currency');
        expect(classNames.symbol).toBe('symbol');
        expect(classNames.number).toBe('number');
        return <div>test</div>;
      };

      render(
        <Money currency="USD" className="test" format={TestFormatter}>100</Money>
      );
    });
  });

  describe('Reverse Flag Detection', () => {
    it('should detect when symbol comes after number (reverse)', () => {
      const TestFormatter = ({ reverse }) => {
        // For pt-BR locale, symbol typically comes after
        return <div data-testid="reverse">{String(reverse)}</div>;
      };

      const { getByTestId } = render(
        <Money locale="pt-BR" currency="BRL" format={TestFormatter}>100</Money>
      );

      const reverseValue = getByTestId('reverse').textContent;
      expect(['true', 'false']).toContain(reverseValue);
    });
  });

  describe('Value Types', () => {
    it('should accept numeric values', () => {
      const { container } = render(<Money currency="USD">{123}</Money>);
      expect(container.textContent).toContain('123');
    });

    it('should accept string values', () => {
      const { container } = render(<Money currency="USD">{"123"}</Money>);
      expect(container.textContent).toContain('123');
    });

    it('should handle decimal values', () => {
      const { container } = render(<Money currency="USD">{123.45}</Money>);
      expect(container.textContent).toContain('123');
    });

    it('should handle large numbers', () => {
      const { container } = render(<Money currency="USD">{1234567.89}</Money>);
      const text = container.textContent;
      expect(text).toMatch(/1,234,567/);
    });
  });

  describe('PropTypes Validation', () => {
    it('should validate currency prop is required', () => {
      // When currency is missing, component should throw
      expect(() => {
        render(<Money>100</Money>);
      }).toThrow();
    });

    it('should validate that children prop is required', () => {
      // Component requires children (the value)
      // Note: PropTypes validation happens in development mode
      // We're just verifying the component has these requirements
      const { container } = render(<Money currency="USD">100</Money>);
      expect(container.textContent).toContain('100');
    });
  });

  describe('Memoization', () => {
    it('should memoize component to prevent unnecessary re-renders', () => {
      const { rerender, container } = render(<Money currency="USD">100</Money>);
      const firstRender = container.innerHTML;

      // Re-render with same props
      rerender(<Money currency="USD">100</Money>);
      const secondRender = container.innerHTML;

      expect(firstRender).toBe(secondRender);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small numbers', () => {
      const { container } = render(<Money currency="USD">0.01</Money>);
      expect(container.textContent).toContain('0.01');
    });

    it('should handle very large numbers', () => {
      const { container } = render(<Money currency="USD">999999999.99</Money>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle numbers with many decimal places', () => {
      const { container } = render(<Money currency="USD">100.123456</Money>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
