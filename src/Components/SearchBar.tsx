import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { characterNames } from "./selectOptions";

export default function SearchBar({ search, setSearch }) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  function handleChange(e) {
    const v = e.target.value;
    setSearch(v);
    if (v.length > 0) {
      setSuggestions(
        characterNames
          .map((o) => o.name)
          .filter((n) => n.toLowerCase().includes(v.toLowerCase()))
          .slice(0, 8),
      );
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  function handleSelect(name) {
    setSearch(name);
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-[300px]">
      <Input
        placeholder="Character Name"
        value={search}
        onChange={handleChange}
        onFocus={() => search.length > 0 && setOpen(true)}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover py-1 shadow-md">
          {suggestions.map((name) => (
            <li
              key={name}
              className="cursor-pointer px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              onMouseDown={() => handleSelect(name)}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
