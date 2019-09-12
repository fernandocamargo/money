import { shape, elementType, node, bool } from 'prop-types';
import React, { useMemo, memo } from 'react';

const MoneyJustSymbolFormatter = ({
  components: { container: Container },
  elements: { value, symbol },
  reverse,
}) => {
  const children = useMemo(() => {
    switch (true) {
      case reverse:
        return [value, symbol];
      default:
        return [symbol, value];
    }
  }, [reverse, value, symbol]);

  return <Container>{children}</Container>;
};

MoneyJustSymbolFormatter.propTypes = {
  components: shape({
    container: elementType.isRequired,
  }).isRequired,
  elements: shape({
    value: node.isRequired,
    symbol: node.isRequired,
  }).isRequired,
  reverse: bool.isRequired,
};

export default memo(MoneyJustSymbolFormatter);
