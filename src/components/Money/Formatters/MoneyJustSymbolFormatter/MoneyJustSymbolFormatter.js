import { shape, elementType, node, bool } from 'prop-types';
import React, { useMemo, memo } from 'react';

const MoneyJustSymbolFormatter = ({
  components: { container: Container },
  elements: { operator, number, symbol },
  negative,
  reverse,
}) => {
  const children = useMemo(() => {
    switch (true) {
      case reverse:
        return [negative && operator, number, symbol];
      default:
        return [negative && operator, symbol, number];
    }
  }, [reverse, negative, operator, number, symbol]);

  return <Container>{children}</Container>;
};

MoneyJustSymbolFormatter.propTypes = {
  components: shape({
    container: elementType.isRequired,
  }).isRequired,
  elements: shape({
    operator: node.isRequired,
    number: node.isRequired,
    symbol: node.isRequired,
  }).isRequired,
  negative: bool.isRequired,
  reverse: bool.isRequired,
};

export default memo(MoneyJustSymbolFormatter);
