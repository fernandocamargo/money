import ISOCurrency from "currency-codes";
import { oneOf, oneOfType, string, number, elementType } from "prop-types";
import { useCallback, useMemo, createElement, memo } from "react";

import { MoneyDefaultFormatter } from "./Formatters";
import withStyle from "./Money.style";

const NUMBER_WITH_SEPARATORS = /(\d+[.,]*)+/gi;

const Money = ({
  className: containerClassName,
  children: raw,
  locale,
  currency,
  format,
  ...extraProps
}) => {
  const getBoundComponentWith = useCallback(
    defaultProps => props =>
      createElement("span", { ...defaultProps, ...extraProps, ...props }),
    [extraProps]
  );
  const negative = useMemo(() => raw < 0, [raw]);
  const value = useMemo(() => Math.abs(raw), [raw]);
  const operator = useMemo(() => (negative ? "-" : "+"), [negative]);
  const formatted = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency
      }).format(value),
    [locale, currency, value]
  );
  const { fragments, reverse } = useMemo(() => {
    const [number] = formatted.match(NUMBER_WITH_SEPARATORS);
    const symbol = formatted.replace(NUMBER_WITH_SEPARATORS, "");

    return {
      fragments: { operator, currency, symbol, number },
      reverse: !!formatted.indexOf(symbol)
    };
  }, [operator, formatted, currency]);
  const classNames = useMemo(
    () =>
      Object.entries(fragments).reduce(
        (stack, [type]) => Object.assign(stack, { [type]: type }),
        { container: containerClassName }
      ),
    [fragments, containerClassName]
  );
  const components = useMemo(
    () =>
      Object.entries(classNames).reduce(
        (stack, [type, className]) =>
          Object.assign(stack, {
            [type]: getBoundComponentWith({ className })
          }),
        {}
      ),
    [getBoundComponentWith, classNames]
  );
  const elements = useMemo(
    () =>
      Object.entries(fragments).reduce(
        (stack, [type, content]) =>
          Object.assign(stack, {
            [type]: createElement(components[type], {
              key: type,
              children: content
            })
          }),
        {}
      ),
    [fragments, components]
  );

  return createElement(format, {
    locale,
    negative,
    value,
    formatted,
    fragments,
    reverse,
    classNames,
    components,
    elements
  });
};

Money.propTypes = {
  locale: string,
  currency: oneOf(ISOCurrency.codes()).isRequired,
  children: oneOfType([string, number]).isRequired,
  format: elementType,
  className: string.isRequired
};

Money.defaultProps = {
  locale: window.navigator.language,
  format: MoneyDefaultFormatter
};

export default memo(withStyle(Money));
