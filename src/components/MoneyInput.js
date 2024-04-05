import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";

export default function MoneyInput() {
  const prefix = "€ ";
  const [value, setValue] = useState(0);

  const handleChange = (e) => {
    e.preventDefault();
    const { value = "" } = e.target;
    const parsedValue = value.replace(/[^\d.]/gi, "");
    setValue(parsedValue);
  };

  const handleOnBlur = () => setValue(Number(value).toFixed(2));

  return (
    <div className="App">
      <CurrencyInput
        style={{width: '100%', height: '38px', borderRadius: '7px'}}
        prefix={prefix}
        name="currencyInput"
        id="currencyInput"
        data-number-to-fixed="2"
        data-number-stepfactor="100"
        value={value}
        placeholder=""
        onChange={handleChange}
        onBlur={handleOnBlur}
        allowDecimals
        decimalsLimit="2"
        disableAbbreviations
      />
    </div>
  );
}
