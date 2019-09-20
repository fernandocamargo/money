import styled from "styled-components";

export default component => styled(component)`
  & > {
    div {
      margin-top: 1rem;
    }
  }

  h1 {
    font-size: 1.5rem;
  }
`;
