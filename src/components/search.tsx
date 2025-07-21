"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { useDebouncedCallback } from "use-debounce";

export default function Search(props: React.ComponentPropsWithoutRef<"input">) {
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
    <div className="w-full relative flex shrink-0 max-w-[400px]">
      <input
        {...props}
        name="search"
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString() || ""}
        className={`h-[50px] w-full text-base font-normal py-5 px-4 rounded-[15px] border border-white/10 gap-4 leading-4 tracking-normal placeholder:text-xs placeholder:text-white/60 outline-0 ring-0 caret-[#B39FF0]`}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
        <IoSearch size={20} color="#FFFFFF99" />
      </span>
    </div>
  );
}
