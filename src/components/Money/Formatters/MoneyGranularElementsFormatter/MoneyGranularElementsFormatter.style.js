import styled from 'styled-components';

export default component => styled(component)`
  .number {
    display: inline-flex;

    .fragment {
      display: inline-block;
      margin: 0;
      position: relative;

      &[type='decimal'] {
        font-size: 50%;
        text-decoration: underline;
      }

      &[type='integer'] {
        padding: 0 0.5rem;
      }

      &[subtype='hundred'] {
        background-color: #f4f4f8;
        color: rgba(31, 45, 61, 0.3);
      }

      &[subtype='thousand'] {
        background-color: #e6e6ea;
        color: rgba(31, 45, 61, 0.3);
      }

      &[subtype='million'] {
        background-color: #009fb7;
        color: rgba(255, 255, 255, 0.3);
      }

      &[subtype='billion'] {
        background-color: #fed766;
        color: rgba(31, 45, 61, 0.3);
      }

      &[subtype='trillion'] {
        background-color: #fe4a49;
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }
`;
