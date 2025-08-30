"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { useDebouncedCallback } from "use-debounce";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";

const searchInputVariants = cva(
  "h-[50px] w-full text-base font-normal py-5 px-4 rounded-[15px] border border-white/10 gap-4 leading-4 tracking-normal placeholder:text-xs placeholder:text-white/60 outline-0 ring-0 caret-[#B39FF0]",
  {
    variants: {},
    defaultVariants: {},
  }
);

export interface SearchProps
  extends React.ComponentPropsWithoutRef<"input">,
    VariantProps<typeof searchInputVariants> {}

export default function Search({ className, ...props }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);

    if (term) params.set("query", term);
    else params.delete("query");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="w-full relative flex shrink-0">
      <input
        {...props}
        title={props.placeholder}
        name="search"
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString() || ""}
        className={cn(searchInputVariants(), className)}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
        <IoSearch size={20} color="#FFFFFF99" />
      </span>
    </div>
  );
}
