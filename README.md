# Money Component

> A revolutionary approach to React component design: **[Composition over Configuration](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)**

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

1. Parses the value using [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) (locale-aware)
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
  const children = useMemo(  // Memoized for performance
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
6. **MoneyGranularElementsFormatter** - Fine-grained per-digit styling (see advanced example below)

Each formatter is **15-88 lines**. Each is **independently testable**. Each is **[tree-shakeable](https://webpack.js.org/guides/tree-shaking/)**.

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

## Advanced Example: Granular Per-Digit Styling

The `MoneyGranularElementsFormatter` demonstrates the true power of this compositional approach. It does something that would be **nearly impossible** with traditional props: style each digit group independently based on magnitude.

### The Problem It Solves

Want to:
- Make cents smaller and underlined?
- Color-code digits by magnitude (thousands gray, millions blue, billions yellow)?
- Add hover effects to specific digit groups?
- Animate transitions between magnitude levels?
- Add tooltips explaining each group?

**Traditional approach**: You'd need dozens of props like `centsStyle`, `hundredsStyle`, `thousandsStyle`, `millionsStyle`, `centsClassName`, `thousandsClassName`, `onHundredsHover`, etc. The combinatorial explosion makes this impractical.

**This approach**: One formatter component that semantically marks up the structure, then style with CSS.

### How It Works

The formatter decomposes the number into atomic fragments and tags each with semantic attributes:

```jsx
<Money currency="USD" format={MoneyGranularElementsFormatter}>
  1234567.89
</Money>
```

**Generates this HTML:**

```html
<span class="container">
  <span class="symbol">$</span>
  <span class="currency">USD</span>
  <span class="number">
    <span class="fragment" type="integer" subtype="million">1</span>
    <span class="fragment" type="separator-integer">,</span>
    <span class="fragment" type="integer" subtype="thousand">234</span>
    <span class="fragment" type="separator-integer">,</span>
    <span class="fragment" type="integer" subtype="hundred">567</span>
    <span class="fragment" type="separator-decimal">.</span>
    <span class="fragment" type="decimal">89</span>
  </span>
</span>
```

### Semantic Attributes

Each fragment receives:

**`type` attribute:**
- `decimal` - The fractional part (cents)
- `separator-decimal` - The decimal point
- `integer` - Integer digit groups
- `separator-integer` - Thousands separators

**`subtype` attribute** (for integers):
- `hundred` - 1-999
- `thousand` - 1,000-999,999
- `million` - 1,000,000-999,999,999
- `billion` - 1,000,000,000-999,999,999,999
- `trillion` - 1,000,000,000,000+

### Styling Example

With this semantic structure, styling becomes trivial using [CSS attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors):

```css
/* Make cents smaller and underlined */
.fragment[type="decimal"] {
  font-size: 50%;
  text-decoration: underline;
  vertical-align: super;
}

/* Color-code by magnitude */
.fragment[subtype="hundred"] {
  background-color: #f4f4f8;
  color: #1f2d3d;
}

.fragment[subtype="thousand"] {
  background-color: #e6e6ea;
  color: #1f2d3d;
}

.fragment[subtype="million"] {
  background-color: #009fb7;
  color: white;
}

.fragment[subtype="billion"] {
  background-color: #fed766;
  color: #1f2d3d;
}

.fragment[subtype="trillion"] {
  background-color: #fe4a49;
  color: white;
}

/* Add hover effects */
.fragment[type="integer"]:hover {
  transform: scale(1.1);
  cursor: pointer;
}

/* Animate magnitude changes */
.fragment[type="integer"] {
  transition: background-color 0.3s ease;
}
```

### The Result

**$1,234,567.89** renders with:
- Millions (1) in blue background
- Thousands (234) in light gray background
- Hundreds (567) in lighter gray background
- Cents (89) smaller, underlined, superscripted

### Why This Is Revolutionary

**What traditional props would need:**

```jsx
<Money
  value={1234567.89}
  currency="USD"
  // Styling props
  centsStyle={{ fontSize: '50%', textDecoration: 'underline' }}
  hundredsStyle={{ backgroundColor: '#f4f4f8' }}
  thousandsStyle={{ backgroundColor: '#e6e6ea' }}
  millionsStyle={{ backgroundColor: '#009fb7', color: 'white' }}
  billionsStyle={{ backgroundColor: '#fed766' }}
  trillionsStyle={{ backgroundColor: '#fe4a49', color: 'white' }}
  // Event handlers
  onCentsHover={handleHover}
  onHundredsHover={handleHover}
  onThousandsHover={handleHover}
  // Animation props
  enableMagnitudeAnimations={true}
  animationDuration={300}
  // ... and it gets worse
/>
```

Problems:
- Component must handle all styling logic internally
- Can't use CSS pseudo-selectors (`:hover`, `:focus`, etc.)
- Can't use CSS transitions/animations
- Can't use media queries for responsive styling
- Can't leverage CSS cascade or inheritance
- Component bundle includes all this logic whether you use it or not

**What this approach requires:**

```jsx
<Money currency="USD" format={MoneyGranularElementsFormatter}>
  1234567.89
</Money>
```

Plus a CSS file. That's it.

### Implementation Simplicity

The entire formatter is ~88 lines:

```jsx
const MoneyGranularElementsFormatter = ({
  components: { container: Container, number: Number },
  elements: { operator, currency, symbol },
  fragments: { number },
  negative,
  reverse,
}) => {
  // Split number by separators (. and ,)
  const granular = useMemo(() => {
    const fragments = number
      .split(/([.,])+/gi)
      .reverse()
      .reduce((stack, fragment, index) => {
        // Determine type and subtype based on position
        const attrs = getTypeFrom({ fragment, index });

        return [
          <span key={index} className="fragment" {...attrs}>
            {fragment}
          </span>,
        ].concat(stack);
      }, []);

    return <Number>{fragments}</Number>;
  }, [number]);

  const children = useMemo(() => {
    switch (true) {
      case reverse:
        return [negative && operator, granular, symbol, currency];
      default:
        return [negative && operator, symbol, currency, granular];
    }
  }, [reverse, negative, operator, currency, symbol, granular]);

  return <Container>{children}</Container>;
};
```

No styling logic. No prop parsing. Just semantic markup.

### Real-World Use Cases

This pattern enables:

1. **Financial dashboards** - Color-code by magnitude for quick scanning
2. **Accounting software** - Highlight cents differently from dollars
3. **Data visualization** - Animate value changes with magnitude transitions
4. **Accessibility** - Add [ARIA labels](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) to each magnitude group
5. **Educational apps** - Interactive tooltips explaining place values
6. **Mobile responsive** - Hide certain digit groups on small screens via CSS
7. **Theming** - Different color schemes per client via CSS variables

All without touching the component code.

### The Key Insight

By providing **semantic structure** instead of **style props**, formatters enable use cases the component author never imagined.

The component's job is to **describe what things are** (decimal, thousands, millions).

The consumer's job is to **decide how things look**.

Perfect separation of concerns.

## Technical Highlights

### Performance Optimization

Every computation is [memoized](https://react.dev/reference/react/useMemo) with [`useMemo`](https://react.dev/reference/react/useMemo):

```jsx
const fragments = useMemo(() => {
  // Parse once, reuse until currency/locale/value changes
}, [currency, locale, value]);
```

### Locale Awareness

Built on [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) - handles all [locale formatting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) automatically:

```jsx
<Money locale="pt-BR" currency="BRL">1234.56</Money>
// Output: +R$ BRL 1.234,56 (locale-aware separators)
```

### Type Safety

[PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html) with [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code validation:

```jsx
Money.propTypes = {
  currency: oneOf(ISOCurrency.codes()).isRequired, // Validates against ISO 4217
  // ...
};
```

### Component Factory Pattern

Creates bound component functions for each fragment type using [higher-order functions](https://eloquentjavascript.net/05_higher_order.html) and [`useCallback`](https://react.dev/reference/react/useCallback):

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

1. **[React Composition Patterns](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)** - [Render props](https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop), component factories, element composition
2. **API Design** - Minimal surface area, maximum flexibility
3. **[Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)** - Data transformation vs. presentation logic
4. **Performance** - Aggressive [memoization](https://react.dev/reference/react/useMemo), [tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
5. **[Internationalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)** - Locale-aware formatting with Intl API
6. **Extensibility** - [Open/closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle) in practice
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

- [React](https://react.dev/) 16.9+ ([Hooks](https://react.dev/reference/react))
- [styled-components](https://styled-components.com/)
- [Intl.NumberFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [currency-codes](https://www.npmjs.com/package/currency-codes) ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) validation)
- [numeral](https://www.npmjs.com/package/numeral) (number abbreviation)
- [prop-types](https://www.npmjs.com/package/prop-types) (Runtime type checking)

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
- Applying [React's core philosophy](https://react.dev/learn/thinking-in-react) (composition)
- Designing for the [pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/) (easy to extend, hard to break)
- Prioritizing developer experience (simple, powerful, predictable)

The result: a component that's **more flexible** and **less complex** than traditional approaches.

**That's the paradox worth showcasing**.
