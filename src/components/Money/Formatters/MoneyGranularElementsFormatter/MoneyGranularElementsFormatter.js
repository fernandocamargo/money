import { shape } from 'prop-types';
import React, { useMemo, memo } from 'react';

import withStyle from './MoneyGranularElementsFormatter.style';

const SEPARATORS = /([.,])+/gi;

const getIntegerTypeFrom = ({ index }) => {
  switch (index / 2) {
    case 1:
      return 'hundred';
    case 2:
      return 'thousand';
    case 3:
      return 'million';
    case 4:
      return 'billion';
    case 5:
      return 'trillion';
    default:
      return 'unknown';
  }
};

const getTypeFrom = ({ fragment, index }) => {
  switch (true) {
    case !index:
      return { type: 'decimal' };
    case index === 1:
      return { type: 'separator-decimal' };
    case index % 2 === 0:
      return { type: 'integer', subtype: getIntegerTypeFrom({ index }) };
    default:
      return { type: 'separator-integer' };
  }
};

const MoneyGranularElementsFormatter = ({
  components: { container: Container, number: Number },
  elements: { operator, currency, symbol },
  classNames: { container: containerClassName },
  fragments: { number },
  className: customClassName,
  negative,
  reverse,
}) => {
  const className = useMemo(
    () => [containerClassName, customClassName].join(' '),
    [containerClassName, customClassName]
  );
  const granular = useMemo(() => {
    const fragments = number
      .split(SEPARATORS)
      .reverse()
      .reduce(
        (stack, fragment, index) =>
          [
            <span
              key={index}
              className="fragment"
              {...getTypeFrom({ fragment, index })}
            >
              {fragment}
            </span>,
          ].concat(stack),
        []
      );

    return <Number key="granular">{fragments}</Number>;
  }, [number]);
  const children = useMemo(() => {
    switch (true) {
      case reverse:
        return [negative && operator, granular, symbol, currency];
      default:
        return [negative && operator, symbol, currency, granular];
    }
  }, [reverse, negative, operator, currency, symbol, granular]);

  return <Container className={className}>{children}</Container>;
};

MoneyGranularElementsFormatter.propTypes = {
  fragments: shape({}),
};

export default memo(withStyle(MoneyGranularElementsFormatter));
