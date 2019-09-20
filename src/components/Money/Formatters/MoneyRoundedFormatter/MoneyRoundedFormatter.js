import numeral from 'numeral';
import { shape, elementType, node, number, bool } from 'prop-types';
import React, { useMemo, memo } from 'react';

const MoneyRoundedFormatter = ({
  components: { container: Container, number: Number },
  elements: { operator, symbol },
  value,
  negative,
  reverse,
}) => {
  const rounded = useMemo(() => numeral(value).format('0a'), [value]);
  const number = useMemo(() => <Number key="number">{rounded}</Number>, [
    rounded,
  ]);
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

MoneyRoundedFormatter.propTypes = {
  components: shape({
    container: elementType.isRequired,
    number: elementType.isRequired,
  }).isRequired,
  elements: shape({ operator: node.isRequired, symbol: node.isRequired })
    .isRequired,
  value: number.isRequired,
  negative: bool.isRequired,
  reverse: bool.isRequired,
};

export default memo(MoneyRoundedFormatter);
