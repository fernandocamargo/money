import numeral from 'numeral';
import { shape, elementType, node, number, bool } from 'prop-types';
import React, { useMemo, memo } from 'react';

const MoneyRoundedFormatter = ({
  components: { container: Container, value: Value },
  elements: { symbol },
  value: something,
  reverse,
}) => {
  const rounded = useMemo(() => numeral(something).format('0a'), [something]);
  const value = useMemo(() => <Value key="value">{rounded}</Value>, [rounded]);
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

MoneyRoundedFormatter.propTypes = {
  components: shape({
    container: elementType.isRequired,
    value: elementType.isRequired,
  }).isRequired,
  elements: shape({ symbol: node.isRequired }).isRequired,
  value: number.isRequired,
  reverse: bool.isRequired,
};

export default memo(MoneyRoundedFormatter);
