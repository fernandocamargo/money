import { shape, elementType, node, bool } from 'prop-types';
import React, { useMemo, memo } from 'react';

const MoneyDefaultFormatter = ({
  components: { container: Container },
  elements: { currency, value, symbol },
  reverse,
}) => {
  const children = useMemo(() => {
    switch (true) {
      case reverse:
        return [value, symbol, currency];
      default:
        return [symbol, currency, value];
    }
  }, [reverse, currency, value, symbol]);

  return <Container>{children}</Container>;
};

MoneyDefaultFormatter.propTypes = {
  components: shape({
    container: elementType.isRequired,
  }).isRequired,
  elements: shape({
    currency: node.isRequired,
    value: node.isRequired,
    symbol: node.isRequired,
  }).isRequired,
  reverse: bool.isRequired,
};

export default memo(MoneyDefaultFormatter);
