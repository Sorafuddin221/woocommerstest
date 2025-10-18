"use client";
import React from 'react';

interface SearchInputProps {
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onChange, value }) => {
  return (
    <div className="relative w-full md:w-auto">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-custom-surface w-full md:w-64 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 text-black focus:ring-custom-accent text-sm"
        onChange={onChange}
        value={value}
      />
      <svg className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-custom-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
};

export default SearchInput;
