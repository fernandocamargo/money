import { shape, elementType, node, bool } from 'prop-types';
import React, { useMemo, memo } from 'react';

const MoneyDefaultFormatter = ({
  components: { container: Container },
  elements: { operator, currency, number, symbol },
  negative,
  reverse,
}) => {
  const children = useMemo(() => {
    switch (true) {
      case reverse:
        return [negative && operator, number, symbol, currency];
      default:
        return [negative && operator, symbol, currency, number];
    }
  }, [reverse, negative, operator, currency, number, symbol]);

  return <Container>{children}</Container>;
};

MoneyDefaultFormatter.propTypes = {
  components: shape({
    container: elementType.isRequired,
  }).isRequired,
  elements: shape({
    operator: node.isRequired,
    currency: node.isRequired,
    number: node.isRequired,
    symbol: node.isRequired,
  }).isRequired,
  negative: bool.isRequired,
  reverse: bool.isRequired,
};

export default memo(MoneyDefaultFormatter);
