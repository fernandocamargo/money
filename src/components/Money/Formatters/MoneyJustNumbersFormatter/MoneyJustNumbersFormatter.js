import { shape, elementType, node } from 'prop-types';
import React, { useMemo, memo } from 'react';

const MoneyJustNumbersFormatter = ({
  components: { container: Container },
  elements: { operator, number },
  negative,
}) => {
  const children = useMemo(() => [negative && operator, number], [
    negative,
    operator,
    number,
  ]);

  return <Container>{children}</Container>;
};

MoneyJustNumbersFormatter.propTypes = {
  components: shape({
    container: elementType.isRequired,
  }).isRequired,
  elements: shape({ operator: node.isRequired, number: node.isRequired })
    .isRequired,
};

export default memo(MoneyJustNumbersFormatter);
