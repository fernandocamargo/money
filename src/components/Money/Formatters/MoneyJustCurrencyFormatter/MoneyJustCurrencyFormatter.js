import { shape, elementType, node, bool } from 'prop-types';
import React, { useMemo, memo } from 'react';

const MoneyJustCurrencyFormatter = ({
  components: { container: Container },
  elements: { operator, number, currency },
  negative,
  reverse,
}) => {
  const children = useMemo(() => {
    switch (true) {
      case reverse:
        return [negative && operator, number, currency];
      default:
        return [negative && operator, currency, number];
    }
  }, [reverse, negative, operator, number, currency]);

  return <Container>{children}</Container>;
};

MoneyJustCurrencyFormatter.propTypes = {
  components: shape({
    container: elementType.isRequired,
  }).isRequired,
  elements: shape({
    operator: node.isRequired,
    number: node.isRequired,
    currency: node.isRequired,
  }).isRequired,
  negative: bool.isRequired,
  reverse: bool.isRequired,
};

export default memo(MoneyJustCurrencyFormatter);
