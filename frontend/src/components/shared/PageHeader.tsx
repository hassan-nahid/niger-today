import React from "react";
import iconSearch from "../../assets/icons/icon-search.svg";
import iconPlus from "../../assets/icons/icon-plus.svg";

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
}

/**
 * Reusable PageHeader component matching Figma 02 Dashboard & 03 Customers
 * Ensures 100% pixel-perfect seamless transition when switching between pages.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Search name, phone or email",
  showSearch = true,
  showAddButton = true,
  onAddClick,
  addButtonText = "Add Customer",
}) => {
  return (
    <div className="flex items-center justify-between gap-4 h-[62px]">
      <div>
        <h1 className="text-[26px] font-bold text-[#0F172A] tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {showSearch && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onSearchSubmit) {
                onSearchSubmit(e);
              }
            }}
            className="relative w-80"
          >
            <img
              src={iconSearch}
              alt=""
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-[42px] rounded-[10px] border border-[#E2E8F0] bg-white pl-10 pr-3.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-all shadow-2xs"
            />
          </form>
        )}

        {showAddButton && onAddClick && (
          <button
            type="button"
            onClick={onAddClick}
            className="h-[42px] px-4 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-[0.99] shrink-0"
          >
            <img
              src={iconPlus}
              alt=""
              className="w-4 h-4 brightness-0 invert"
            />
            <span>{addButtonText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

