
import React from 'react';
import { UserAnswer } from '../types';

interface FractionInputProps {
  value: UserAnswer;
  onChange: (value: UserAnswer) => void;
  disabled: boolean;
}

const FractionInput: React.FC<FractionInputProps> = ({ value, onChange, disabled }) => {
  const handleNumeratorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    onChange({ ...value, numerator: num });
  };

  const handleDenominatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const den = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    onChange({ ...value, denominator: den });
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <input
        type="number"
        value={value?.numerator ?? ''}
        onChange={handleNumeratorChange}
        disabled={disabled}
        className="w-16 p-2 text-center border-2 border-slate-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 transition disabled:bg-slate-100 disabled:text-slate-500 bg-white text-slate-800"
        aria-label="Numerator"
      />
      <span className="text-2xl font-bold text-slate-500">/</span>
      <input
        type="number"
        value={value?.denominator ?? ''}
        onChange={handleDenominatorChange}
        disabled={disabled}
        className="w-16 p-2 text-center border-2 border-slate-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 transition disabled:bg-slate-100 disabled:text-slate-500 bg-white text-slate-800"
        aria-label="Denominator"
      />
    </div>
  );
};

export default FractionInput;