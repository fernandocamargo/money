import styled from 'styled-components';

export default component => styled(component)`
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial,
    sans-serif;

  span {
    display: inline-block;

    &:not(:first-child) {
      margin-left: 2.5px;
    }
  }

  .currency,
  .symbol {
    color: #707d8b;
  }

  .value {
    color: #000;
  }
`;
