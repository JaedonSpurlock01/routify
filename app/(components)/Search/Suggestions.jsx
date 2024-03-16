import React from "react";

export const Suggestions = ({ suggestions, pickSuggestion }) => {
  return (
    <div>
      <ul className="w-[15rem] text-neutral-200 text-xs bg-neutral-800 p-2 flex flex-col rounded-lg overflow-hidden overflow-y-auto max-h-48">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="mb-2 hover:bg-neutral-900 rounded-lg p-1 hover:cursor-pointer"
            onClick={() => pickSuggestion(suggestion)}
          >
            <span>{suggestion.display_name}</span>
            <br />
            <small className="text-rose-500">({suggestion.type})</small>
          </li>
        ))}
      </ul>
    </div>
  );
};
