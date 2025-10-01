import React from "react";

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "10px",
        margin: "10px 0",
        width: "100%",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  );
};

export default SearchBar;
