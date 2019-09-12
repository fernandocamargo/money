import { shape, elementType, node } from 'prop-types';
import React, { memo } from 'react';

const MoneyJustNumbersFormatter = ({
  components: { container: Container },
  elements: { value },
}) => <Container>{value}</Container>;

MoneyJustNumbersFormatter.propTypes = {
  components: shape({
    container: elementType.isRequired,
  }).isRequired,
  elements: shape({ value: node.isRequired }).isRequired,
};

export default memo(MoneyJustNumbersFormatter);
