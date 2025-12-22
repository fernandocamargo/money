# Money Component

> A revolutionary approach to React component design: **Composition over Configuration**

## The Problem

Traditional React components for complex UI elements often fall into the "prop hell" trap:

```jsx
// The old way: prop explosion
<DatePicker
  showClearDates={true}
  showDefaultInputIcon={true}
  customInputIcon={<Icon />}
  customArrowIcon={<Icon />}
  customCloseIcon={<Icon />}
  displayFormat="MM/DD/YYYY"
  monthFormat="MMMM YYYY"
  phrases={{
    closeDatePicker: 'Close',
    clearDates: 'Clear',
    // ... 20+ more phrases
  }}
  renderCalendarInfo={() => <div>Info</div>}
  renderDayContents={(day) => day.format('D')}
  renderMonthElement={({ month }) => month}
  // ... dozens more props
/>
```

This approach has critical flaws:

- **API Explosion**: Every customization requires a new prop
- **Maintenance Nightmare**: Component logic becomes a maze of conditionals
- **Poor Scalability**: Adding features means adding props and complexity
- **Limited Flexibility**: Only what props allow, nothing more
- **Testing Complexity**: Combinatorial explosion of prop permutations
- **Bundle Size**: All features shipped to all users, always

## The Solution

This project demonstrates a fundamentally different approach: **provide atomic building blocks, let consumers compose them**.

Instead of accepting dozens of formatting props, the `Money` component:

1. Decomposes money values into **atomic fragments** (operator, currency, symbol, number)
2. Provides **pre-rendered elements** and **component factories**
3. Delegates presentation to **lightweight formatter components**
4. Maintains a **minimal, stable API** that never grows

## Architecture

### Core Money Component

The `Money` component does one thing exceptionally well: **decomposition**.

```jsx
<Money currency="EUR" format={CustomFormatter}>1234.56</Money>
```

Internally, it:

1. Parses the value using `Intl.NumberFormat` (locale-aware)
2. Extracts atomic fragments:
   - `operator`: "+" or "-"
   - `currency`: "EUR"
   - `symbol`: "€"
   - `number`: "1,234.56"
3. Creates bound component factories for each fragment type
4. Generates pre-rendered React elements
5. Passes everything to the formatter

**Key insight**: The Money component contains **zero presentation logic**. It's purely a data transformation pipeline.

### Formatters: Simple Composition

Formatters receive all the building blocks and simply arrange them:

```jsx
// MoneyJustNumbersFormatter.js - 15 lines total
const MoneyJustNumbersFormatter = ({
  components: { container: Container },
  elements: { operator, number },
  negative,
}) => {
  const children = useMemo(
    () => [negative && operator, number],
    [negative, operator, number]
  );

  return <Container>{children}</Container>;
};
```

That's it. No prop parsing, no conditionals, no complexity. Just composition.

## Real-World Example

### Before (Traditional Approach)

```jsx
// Component implementation: 300+ lines
// Props needed: 25+
// Conditional branches: 15+
<MoneyDisplay
  value={1234.56}
  currency="EUR"
  locale="en-US"
  showSymbol={true}
  showCurrencyCode={true}
  symbolPosition="before"
  currencyPosition="after"
  showOperator={false}
  operatorPosition="before"
  abbreviateLargeNumbers={false}
  abbreviationThreshold={1000}
  abbreviationUnits={['k', 'M', 'B']}
  granularDigits={false}
  colorCodeMagnitudes={false}
  magnitudeColors={{ thousand: '#blue', million: '#green' }}
  decimalPlaces={2}
  thousandsSeparator=","
  decimalSeparator="."
  negativeFormat="minus"
  // ... and more
/>
```

### After (Composition Approach)

```jsx
// Six built-in formatters, each 15-40 lines
// Core component: 104 lines, zero presentation logic
// Props needed: 4 (value, currency, locale, format)

// Default format
<Money currency="EUR">1234.56</Money>
// Output: +€ EUR 1,234.56

// Just numbers
<Money currency="EUR" format={MoneyJustNumbersFormatter}>1234.56</Money>
// Output: +1,234.56

// Abbreviated
<Money currency="EUR" format={MoneyRoundedFormatter}>1234.56</Money>
// Output: +€ 1.2k

// Custom format (create your own in minutes)
const CustomFormatter = ({ elements: { symbol, number } }) => (
  <span className="price">{symbol}{number}</span>
);

<Money currency="EUR" format={CustomFormatter}>1234.56</Money>
// Output: €1,234.56
```

## Built-in Formatters

1. **MoneyDefaultFormatter** - Symbol + currency code
2. **MoneyJustCurrencyFormatter** - Currency code only
3. **MoneyJustSymbolFormatter** - Symbol only
4. **MoneyJustNumbersFormatter** - Numbers only
5. **MoneyRoundedFormatter** - Abbreviated (1.2k, 3.5M)
6. **MoneyGranularElementsFormatter** - Magnitude-based styling

Each formatter is **15-88 lines**. Each is **independently testable**. Each is **tree-shakeable**.

## Why This Matters

### Scalability

Adding a new format variant:

- **Traditional approach**: Add 3-5 props, add conditional logic, update tests, increase bundle size
- **This approach**: Create a 20-line formatter component

### Flexibility

Want to color each digit differently based on magnitude? Want to animate the transition between values? Want to add tooltips to specific parts?

- **Traditional approach**: Request new props from maintainer, wait for release
- **This approach**: Write a custom formatter, takes 10 minutes

### Maintainability

- **Traditional approach**: Core component grows with every feature request
- **This approach**: Core component never changes, formatters are isolated

### Bundle Size

- **Traditional approach**: All features shipped always, ~50kb+
- **This approach**: Import only what you need, ~5kb + chosen formatters

### Testing

- **Traditional approach**: Test all prop combinations (exponential complexity)
- **This approach**: Test core component once, test each formatter in isolation

## Technical Highlights

### Performance Optimization

Every computation is memoized with `useMemo`:

```jsx
const fragments = useMemo(() => {
  // Parse once, reuse until currency/locale/value changes
}, [currency, locale, value]);
```

### Locale Awareness

Built on `Intl.NumberFormat` - handles all locale formatting automatically:

```jsx
<Money locale="pt-BR" currency="BRL">1234.56</Money>
// Output: +R$ BRL 1.234,56 (locale-aware separators)
```

### Type Safety

PropTypes with ISO currency code validation:

```jsx
Money.propTypes = {
  currency: oneOf(ISOCurrency.codes()).isRequired, // Validates against ISO 4217
  // ...
};
```

### Component Factory Pattern

Creates bound component functions for each fragment type:

```jsx
const getBoundComponentWith = useCallback(
  defaultProps => props =>
    createElement("span", { ...defaultProps, ...extraProps, ...props }),
  [extraProps]
);
```

This enables formatters to render fragments with custom props while maintaining defaults.

## Key Learnings

This project demonstrates mastery of:

1. **React Composition Patterns** - Render props, component factories, element composition
2. **API Design** - Minimal surface area, maximum flexibility
3. **Separation of Concerns** - Data transformation vs. presentation logic
4. **Performance** - Aggressive memoization, tree-shaking
5. **Internationalization** - Locale-aware formatting with Intl API
6. **Extensibility** - Open/closed principle in practice
7. **Problem Recognition** - Identifying and solving architectural anti-patterns

## The Inspiration

After wrestling with [airbnb/react-dates](https://github.com/react-dates/react-dates) and its [200+ props](https://github.com/react-dates/react-dates#singledatepicker), I realized: **we're solving the wrong problem**.

The question isn't "how do we expose all customization through props?"

The question is "how do we give developers the primitives to build exactly what they need?"

This component is the answer.

## Running the Demo

```bash
yarn install
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to see all formatters in action.

## Project Structure

```
src/
├── components/
│   └── Money/
│       ├── Money.js              # Core component (104 lines)
│       ├── Money.style.js        # Styled-components wrapper
│       └── Formatters/
│           ├── MoneyDefaultFormatter/
│           ├── MoneyJustCurrencyFormatter/
│           ├── MoneyJustSymbolFormatter/
│           ├── MoneyJustNumbersFormatter/
│           ├── MoneyRoundedFormatter/
│           └── MoneyGranularElementsFormatter/
```

## Tech Stack

- React 16.9+ (Hooks)
- styled-components
- Intl.NumberFormat API
- currency-codes (ISO 4217 validation)
- numeral (number abbreviation)

## Creating Custom Formatters

Formatters receive this shape:

```typescript
{
  locale: string,           // e.g., "en-US"
  negative: boolean,        // Is value negative?
  value: number,            // Absolute value
  formatted: string,        // Full formatted string from Intl
  reverse: boolean,         // Does symbol come after number?

  fragments: {              // Raw string values
    operator: string,       // "+" or "-"
    currency: string,       // "EUR"
    symbol: string,         // "€"
    number: string,         // "1,234.56"
  },

  classNames: {             // CSS class names
    container: string,
    operator: string,
    currency: string,
    symbol: string,
    number: string,
  },

  components: {             // Bound component factories
    container: Component,
    operator: Component,
    currency: Component,
    symbol: Component,
    number: Component,
  },

  elements: {               // Pre-rendered React elements
    operator: ReactElement,
    currency: ReactElement,
    symbol: ReactElement,
    number: ReactElement,
  }
}
```

Example custom formatter:

```jsx
const MoneyBoldSymbol = ({
  components: { container: Container },
  elements: { symbol, number },
  negative,
  reverse
}) => (
  <Container>
    {!reverse && <strong>{symbol}</strong>}
    {negative && "-"}
    {number}
    {reverse && <strong>{symbol}</strong>}
  </Container>
);
```

## Conclusion

This isn't just a money formatting component. It's a demonstration of **architectural thinking**:

- Recognizing anti-patterns (prop explosion)
- Applying React's core philosophy (composition)
- Designing for the pit of success (easy to extend, hard to break)
- Prioritizing developer experience (simple, powerful, predictable)

The result: a component that's **more flexible** and **less complex** than traditional approaches.

**That's the paradox worth showcasing**.

---

Built by [Your Name] as a demonstration of component architecture mastery.
