"use client";

import Search from "@/components/ui/search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { FaChevronDown } from "react-icons/fa6";
import { GoFilter, GoXCircle } from "react-icons/go";
import { toast } from "sonner";

export default function Filters() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (params.get(name) === value) params.delete(name);
    else params.set(name, value);

    replace(`${pathname}?${params.toString()}`);
  };

  const removeParam = (name: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(name);
    replace(`${pathname}?${params.toString()}`);
  };

  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const [showStatusFilterOptions, setShowStatusFilterOptions] = useState(false);
  const [showPostionFilterOptions, setShowPositionFilterOptions] =
    useState(false);
  const [showPairFilterOptions, setShowPairFilterOptions] = useState(false);
  const [showDateFilterOptions, setShowDateFilterOptions] = useState(false);
  const [showPerformanceFilterOptions, setShowPerformanceFilterOptions] =
    useState(false);
  const [showCopierFilterOptions, setShowCopierFilterOptions] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="w-full max-w-3xl">
          <Search
            placeholder="Search for trades"
            className="bg-[#242324] py-3 px-4 h-[40px] rounded-[10px] border-0"
          />
        </div>

        <button
          className="border border-white/10 rounded-[15px] h-8 py-2 px-4 flex items-center justify-center gap-2.5 text-white/80 text-xs/3 font-normal"
          onClick={toggleFilterOptions}
        >
          <GoFilter className="stroke-white/70" width={14} /> Filters
        </button>
      </div>

      {showFilterOptions && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 relative">
          <div className="relative">
            <button
              className="w-full border border-white/10 rounded-[15px] h-8 py-2 px-4 flex items-center justify-between gap-2.5 text-white/70 text-xs/3 font-normal"
              onClick={() => {
                if (searchParams.get("status")) removeParam("status");
                else setShowStatusFilterOptions((prev) => !prev);
              }}
            >
              {searchParams.get("status") ? (
                <>
                  {searchParams.get("status")}

                  <GoXCircle color="#F8F5FF80" width={12} />
                </>
              ) : (
                <>
                  By status
                  <FaChevronDown color="#F8F5FF80" width={12} />
                </>
              )}
            </button>
            {showStatusFilterOptions && (
              <div className="absolute top-10 left-0 min-w-[150px] py-1 px-2.5 rounded-[10px] border border-white/10 bg-[#211F22] flex flex-col items-start [&>p]:w-full">
                <p
                  onClick={() => {
                    setParams("status", "published");
                    setShowStatusFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  Published
                </p>
                <p
                  onClick={() => {
                    setParams("status", "draft");
                    setShowStatusFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  Draft
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="w-full border border-white/10 rounded-[15px] h-8 py-2 px-4 flex items-center justify-between gap-2.5 text-white/70 text-xs/3 font-normal"
              onClick={() => {
                if (searchParams.get("position")) removeParam("position");
                else setShowPositionFilterOptions((prev) => !prev);
              }}
            >
              {searchParams.get("position") ? (
                <>
                  {searchParams.get("position")}

                  <GoXCircle color="#F8F5FF80" width={12} />
                </>
              ) : (
                <>
                  By position
                  <FaChevronDown color="#F8F5FF80" width={12} />
                </>
              )}
            </button>
            {showPostionFilterOptions && (
              <div className="absolute top-10 left-0 min-w-[150px] py-1 px-2.5 rounded-[10px] border border-white/10 bg-[#211F22] flex flex-col items-start [&>p]:w-full">
                <p
                  onClick={() => {
                    setParams("position", "long");
                    setShowPositionFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  Long
                </p>
                <p
                  onClick={() => {
                    setParams("position", "short");
                    setShowPositionFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  Short
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="w-full border border-white/10 rounded-[15px] h-8 py-2 px-4 flex items-center justify-between gap-2.5 text-white/70 text-xs/3 font-normal"
              onClick={() => {
                if (searchParams.get("pair")) removeParam("pair");
                else setShowPairFilterOptions((prev) => !prev);
              }}
            >
              {searchParams.get("pair") ? (
                <>
                  {searchParams.get("pair")}

                  <GoXCircle color="#F8F5FF80" width={12} />
                </>
              ) : (
                <>
                  By pair
                  <FaChevronDown color="#F8F5FF80" width={12} />
                </>
              )}
            </button>
            {showPairFilterOptions && (
              <div className="absolute top-10 left-0 min-w-[150px] py-1 px-2.5 rounded-[10px] border border-white/10 bg-[#211F22] flex flex-col items-start [&>p]:w-full">
                <p
                  onClick={() => {
                    setParams("pair", "BTC/USDT");
                    setShowPairFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  BTC/USDT
                </p>
                <p
                  onClick={() => {
                    setParams("pair", "ETH/USDT");
                    setShowPairFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  ETH/USDT
                </p>
                <p
                  onClick={() => {
                    setParams("pair", "BIN/USDT");
                    setShowPairFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  BIN/USDT
                </p>
                <p
                  onClick={() => {
                    setParams("pair", "SOL/USDT");
                    setShowPairFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  SOL/USDT
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="w-full border border-white/10 rounded-[15px] h-8 py-2 px-4 flex items-center justify-between gap-2.5 text-white/70 text-xs/3 font-normal overflow-hidden text-ellipsis whitespace-nowrap"
              onClick={() => {
                setShowDateFilterOptions((prev) => !prev);
              }}
            >
              {searchParams.get("startDate") ? (
                <>
                  {searchParams.get("startDate")} -{" "}
                  {searchParams.get("endDate")}
                  <GoXCircle color="#F8F5FF80" width={12} />
                </>
              ) : (
                <>
                  Select date range
                  <FaChevronDown color="#F8F5FF80" width={12} />
                </>
              )}
            </button>
            {showDateFilterOptions && (
              <div className="absolute top-10 left-0 min-w-[150px] py-1 px-2.5 rounded-[10px] border border-white/10 bg-[#211F22] flex flex-col items-start [&>p]:w-full">
                <DatePicker
                  placeholderText="Start date"
                  selected={
                    searchParams.get("startDate")
                      ? new Date(searchParams.get("startDate")!)
                      : null
                  }
                  onChange={(date) => {
                    if (date)
                      setParams("startDate", date.toISOString().split("T")[0]);
                    else removeParam("startDate");
                  }}
                  required
                  dateFormat="P"
                  locale="en-GB"
                  className="py-2 px-1 opacity-80 text-white/60 text-xs outline-0 ring-0  cursor-pointer hover:opacity-100"
                />

                <DatePicker
                  placeholderText="End date"
                  selected={
                    searchParams.get("endDate")
                      ? new Date(searchParams.get("endDate")!)
                      : null
                  }
                  onChange={(date) => {
                    if (!searchParams.get("startDate")) {
                      toast.error("Please select a start date first");
                      return;
                    }
                    if (date)
                      setParams("endDate", date.toISOString().split("T")[0]);
                    else removeParam("endDate");

                    setShowDateFilterOptions(false);
                  }}
                  required
                  dateFormat="P"
                  locale="en-GB"
                  className="py-2 px-1 opacity-80 text-white/60 text-xs outline-0 ring-0  cursor-pointer hover:opacity-100"
                />
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="w-full border border-white/10 rounded-[15px] h-8 py-2 px-4 flex items-center justify-between gap-2.5 text-white/70 text-xs/3 font-normal"
              onClick={() => {
                if (searchParams.get("performance")) removeParam("performance");
                else setShowPerformanceFilterOptions((prev) => !prev);
              }}
            >
              {searchParams.get("performance") ? (
                <>
                  {searchParams.get("performance")}

                  <GoXCircle color="#F8F5FF80" width={12} />
                </>
              ) : (
                <>
                  By performance
                  <FaChevronDown color="#F8F5FF80" width={12} />
                </>
              )}
            </button>
            {showPerformanceFilterOptions && (
              <div className="absolute top-10 left-0 min-w-[150px] py-1 px-2.5 rounded-[10px] border border-white/10 bg-[#211F22] flex flex-col items-start [&>p]:w-full">
                <p
                  onClick={() => {
                    setParams("performance", "profitable");
                    setShowPerformanceFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  Profitable
                </p>
                <p
                  onClick={() => {
                    setParams("performance", "loss making");
                    setShowPerformanceFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  Loss making
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="w-full border border-white/10 rounded-[15px] h-8 py-2 px-4 flex items-center justify-between gap-2.5 text-white/70 text-xs/3 font-normal"
              onClick={() => {
                if (searchParams.get("copiers")) removeParam("copiers");
                else setShowCopierFilterOptions((prev) => !prev);
              }}
            >
              {searchParams.get("copiers") ? (
                <>
                  {searchParams.get("copiers")}

                  <GoXCircle color="#F8F5FF80" width={12} />
                </>
              ) : (
                <>
                  By copiers
                  <FaChevronDown color="#F8F5FF80" width={12} />
                </>
              )}
            </button>
            {showCopierFilterOptions && (
              <div className="absolute top-10 left-0 min-w-[150px] py-1 px-2.5 rounded-[10px] border border-white/10 bg-[#211F22] flex flex-col items-start [&>p]:w-full">
                <p
                  onClick={() => {
                    setParams("copiers", "most copied");
                    setShowCopierFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  Most Copied
                </p>
                <p
                  onClick={() => {
                    setParams("copiers", "least copied");
                    setShowCopierFilterOptions(false);
                  }}
                  className="py-2 px-1 opacity-80 text-white/60 text-xs cursor-pointer hover:opacity-100"
                >
                  Least Copied
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
