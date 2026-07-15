// src/components/Lore/TransparentDropdown.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type TransparentDropdownItem = {
  label: string;
  value?: string;
  href?: string;
  disabled?: boolean;
};

type TransparentDropdownProps = {
  label: string;
  items: TransparentDropdownItem[];
  selectedValue?: string;
  onSelect?: (item: TransparentDropdownItem) => void;
  className?: string;
  variant?: "large" | "compact";
};

export default function TransparentDropdown({
  label,
  items,
  selectedValue,
  onSelect,
  className = "",
  variant = "large",
}: TransparentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedItem = useMemo(() => {
    return items.find((item) => getItemValue(item) === selectedValue);
  }, [items, selectedValue]);

  const displayLabel = selectedItem?.label ?? label;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (item: TransparentDropdownItem) => {
    if (item.disabled) return;

    onSelect?.(item);
    setIsOpen(false);
  };

  const isCompact = variant === "compact";

  return (
    <div
      ref={dropdownRef}
      className={`relative max-w-full font-[Spectral_SC] ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={[
          "flex w-full flex-col items-center justify-center rounded-2xl",
          "border !border-white/10 !bg-[#252642]/5 text-white shadow-lg backdrop-blur-sm",
          "transition duration-200 !hover:bg-[#2d2d4d]/70 !hover:shadow-[#fff48e]/10",
          "focus:outline-none focus:ring-2 focus:ring-[#fff48e]",
          isCompact ? "min-h-[66px] px-5 py-3" : "min-h-[130px] px-8 py-6",
          isOpen ? "border-[#fff48e]/70 bg-[#2d2d4d]/95" : "",
        ].join(" ")}
      >
        <span
          className={[
            "font-['Spectral_SC'] font-bold uppercase tracking-[0.12em] text-white",
            isCompact ? "text-2xl" : "text-4xl",
          ].join(" ")}
        >
          {displayLabel}
        </span>

        <span
          aria-hidden="true"
          className={[
            "leading-none text-white transition-transform duration-200",
            isCompact ? "mt-0 text-lg" : "mt-2 text-2xl",
            isOpen ? "rotate-180 text-[#fff48e]" : "rotate-0",
          ].join(" ")}
        >
          ▾
        </span>
      </button>

      <div
        className={[
          "absolute left-0 top-full z-50 w-full overflow-hidden rounded-xl",
          " bg-[#111120]/90 shadow-xl backdrop-blur-md",
          "transition-all duration-200",
          isOpen
            ? "pointer-events-auto max-h-96 translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <ul className="py-3">
          {items.map((item) => {
            const value = getItemValue(item);
            const isSelected = selectedValue === value;

            const itemClassName = [
              "flex min-h-10 w-full items-center justify-center px-5 py-2",
              "font-['Spectral_SC'] text-sm font-bold uppercase tracking-wider",
              "transition duration-150",
              isSelected
                ? "bg-[#fff48e]/15 text-[#fff48e]"
                : "text-white/80 hover:bg-white/10 hover:text-[#fff48e]",
              item.disabled
                ? "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-white/80"
                : "cursor-pointer",
            ].join(" ");

            return (
              <li key={value}>
                {item.href && !item.disabled ? (
                  <Link
                    href={item.href}
                    onClick={() => handleSelect(item)}
                    className={itemClassName}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={item.disabled}
                    onClick={() => handleSelect(item)}
                    className={itemClassName}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function getItemValue(item: TransparentDropdownItem) {
  return item.value ?? item.label;
}