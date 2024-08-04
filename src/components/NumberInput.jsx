import React, { useState, useEffect } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
function NumberInput({ initialValue, step, onChange }) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    onChange(value);
  }, [value]);
  const handleIncrement = () => {
    setValue((prevValue) => prevValue + step);
  };

  const handleDecrement = () => {
    setValue((prevValue) => {
      const newValue =
        prevValue - step >= initialValue ? prevValue - step : prevValue;

      return newValue;
    });
  };

  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <button
        onClick={handleDecrement}
        className="px-2 py-1 bg-gray-200 rounded text-gray-700"
      >
        -
      </button>
      <StyledInput
        type="number"
        value={value}
        onChange={handleChange}
        className="w-16 text-center border rounded"
        min="1"
      />
      <button
        onClick={handleIncrement}
        className="px-2 py-1 bg-gray-200 rounded text-gray-700"
      >
        +
      </button>
    </div>
  );
}

export default NumberInput;
