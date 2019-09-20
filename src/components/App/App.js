import React, { memo } from "react";

import withStyle from "./App.style";

import Money, {
  MoneyGranularElementsFormatter,
  MoneyJustCurrencyFormatter,
  MoneyJustSymbolFormatter,
  MoneyJustNumbersFormatter,
  MoneyRoundedFormatter
} from "components/Money";

const numberAsString = "12";

const App = ({ className }) => (
  <div className={className}>
    <div>
      <h1>Default format</h1>
      <Money currency="EUR">1</Money>
      <Money currency="EUR">{numberAsString}</Money>
      <Money currency="BRL">123</Money>
      <Money locale="pt-BR" currency="BRL">
        1234
      </Money>
      <Money locale="en-US" currency="GBP">
        -12345
      </Money>
      <Money locale="de-DE" currency="MXN">
        123456
      </Money>
      <Money locale="de-DE" currency="CAD">
        -1234567
      </Money>
    </div>
    <div>
      <h1>Custom format (just currency)</h1>
      <Money currency="EUR" format={MoneyJustCurrencyFormatter}>
        1
      </Money>
      <Money currency="EUR" format={MoneyJustCurrencyFormatter}>
        {numberAsString}
      </Money>
      <Money currency="BRL" format={MoneyJustCurrencyFormatter}>
        12
      </Money>
      <Money locale="pt-BR" currency="BRL" format={MoneyJustCurrencyFormatter}>
        123
      </Money>
      <Money locale="en-US" currency="GBP" format={MoneyJustCurrencyFormatter}>
        -1234
      </Money>
      <Money locale="de-DE" currency="MXN" format={MoneyJustCurrencyFormatter}>
        12345
      </Money>
      <Money locale="de-DE" currency="CAD" format={MoneyJustCurrencyFormatter}>
        123456
      </Money>
      <Money locale="de-DE" currency="CAD" format={MoneyJustCurrencyFormatter}>
        -1234567
      </Money>
    </div>
    <div>
      <h1>Custom format (just symbol)</h1>
      <Money currency="EUR" format={MoneyJustSymbolFormatter}>
        1
      </Money>
      <Money currency="EUR" format={MoneyJustSymbolFormatter}>
        {numberAsString}
      </Money>
      <Money currency="BRL" format={MoneyJustSymbolFormatter}>
        12
      </Money>
      <Money locale="pt-BR" currency="BRL" format={MoneyJustSymbolFormatter}>
        123
      </Money>
      <Money locale="en-US" currency="GBP" format={MoneyJustSymbolFormatter}>
        -1234
      </Money>
      <Money locale="de-DE" currency="MXN" format={MoneyJustSymbolFormatter}>
        12345
      </Money>
      <Money locale="de-DE" currency="CAD" format={MoneyJustSymbolFormatter}>
        123456
      </Money>
      <Money locale="de-DE" currency="CAD" format={MoneyJustSymbolFormatter}>
        -1234567
      </Money>
    </div>
    <div>
      <h1>Custom format (just numbers)</h1>
      <Money currency="EUR" format={MoneyJustNumbersFormatter}>
        1
      </Money>
      <Money currency="EUR" format={MoneyJustNumbersFormatter}>
        {numberAsString}
      </Money>
      <Money currency="BRL" format={MoneyJustNumbersFormatter}>
        123
      </Money>
      <Money locale="pt-BR" currency="BRL" format={MoneyJustNumbersFormatter}>
        -1234
      </Money>
      <Money locale="en-US" currency="GBP" format={MoneyJustNumbersFormatter}>
        12345
      </Money>
      <Money locale="de-DE" currency="MXN" format={MoneyJustNumbersFormatter}>
        123456
      </Money>
      <Money locale="de-DE" currency="CAD" format={MoneyJustNumbersFormatter}>
        -1234567
      </Money>
    </div>
    <div>
      <h1>
        Custom format (rounded,{" "}
        <a
          href="https://www.npmjs.com/package/numeral"
          target="_blank"
          rel="noopener noreferrer"
        >
          using numeral
        </a>
        )
      </h1>
      <Money currency="EUR" format={MoneyRoundedFormatter}>
        1
      </Money>
      <Money currency="EUR" format={MoneyRoundedFormatter}>
        {numberAsString}
      </Money>
      <Money currency="BRL" format={MoneyRoundedFormatter}>
        123
      </Money>
      <Money locale="pt-BR" currency="BRL" format={MoneyRoundedFormatter}>
        -1234
      </Money>
      <Money locale="en-US" currency="GBP" format={MoneyRoundedFormatter}>
        12345
      </Money>
      <Money locale="de-DE" currency="MXN" format={MoneyRoundedFormatter}>
        123456
      </Money>
      <Money locale="de-DE" currency="CAD" format={MoneyRoundedFormatter}>
        -1234567
      </Money>
    </div>
    <div>
      <h1>Custom format (granular elements)</h1>
      <Money currency="EUR" format={MoneyGranularElementsFormatter}>
        1
      </Money>
      <Money currency="EUR" format={MoneyGranularElementsFormatter}>
        {numberAsString}
      </Money>
      <Money currency="BRL" format={MoneyGranularElementsFormatter}>
        123
      </Money>
      <Money
        locale="pt-BR"
        currency="BRL"
        format={MoneyGranularElementsFormatter}
      >
        -1234
      </Money>
      <Money
        locale="en-US"
        currency="GBP"
        format={MoneyGranularElementsFormatter}
      >
        12345
      </Money>
      <Money
        locale="de-DE"
        currency="MXN"
        format={MoneyGranularElementsFormatter}
      >
        123456
      </Money>
      <Money
        locale="de-DE"
        currency="CAD"
        format={MoneyGranularElementsFormatter}
      >
        -1234567890123
      </Money>
    </div>
  </div>
);

export default memo(withStyle(App));
