import { anton } from "@/app/fonts";
import { Dispatch, SetStateAction, useState } from "react";
import DatePicker from "react-datepicker";
import { FaChevronDown } from "react-icons/fa6";
import { toast } from "sonner";
import Loader from "../ui/loader";

export default function PublishTradeForm({
  isOpen,
  close,
  formData,
  setFormData,
  isLoading,
  handlePublishTrade,
}: {
  isOpen: boolean;
  close: () => void;
  formData: CopyTradeFormData;
  setFormData: Dispatch<SetStateAction<CopyTradeFormData>>;
  isLoading: boolean;
  handlePublishTrade: () => void;
}) {
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [showTradeTypeDropdown, setShowTradeTypeDropdown] = useState(false);
  const [showTradeDirectionDropdown, setShowTradeDirectionDropdown] =
    useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showTradeDurationDropdown, setShowTradeDurationDropdown] =
    useState(false);
  const [showRiskLevelDropdown, setShowRiskLevelDropdown] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showOrderTypeDropdown, setShowOrderTypeDropdown] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 p-[10%] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={close} />

      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (isLoading) return;

          handlePublishTrade();
        }}
        className="bg-[#242324] w-full max-w-3xl overflow-y-auto h-[90vh] rounded-[20px] px-8 py-14 space-y-[60px] relative hide-scrollbar"
      >
        <div className="flex flex-col gap-8 w-full">
          <h4
            className={`${anton.className} text-2xl/[150%] text-center w-full font-normal tracking-[2px]`}
          >
            Publish trade
          </h4>

          <div className="flex flex-col gap-4 w-full">
            <div className="space-y-3 relative">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Asset to be used
              </p>
              <div
                title="Select asset"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowAssetDropdown(true);
                }}
              >
                <p>{formData.asset ? formData.asset : "Select asset"}</p>
                <FaChevronDown className="w-3 stroke-white/50" />
              </div>
              {showAssetDropdown && (
                <>
                  <div
                    className="fixed inset-0 bg-transparent cursor-pointer"
                    onClick={() => {
                      setShowAssetDropdown(false);
                    }}
                  />
                  <div className="absolute z-10 top-24 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          asset: "BTC/USDT",
                        }));
                        setShowAssetDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.asset === "BTC/USDT" && "bg-white/5"
                      }`}
                    >
                      BTC/USDT
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          asset: "ETH/USDT",
                        }));
                        setShowAssetDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.asset === "ETH/USDT" && "bg-white/5"
                      }`}
                    >
                      ETH/USDT
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          asset: "SOL/USDT",
                        }));
                        setShowAssetDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.asset === "SOL/USDT" && "bg-white/5"
                      }`}
                    >
                      SOL/USDT
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          asset: "XRP/USDT",
                        }));
                        setShowAssetDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.asset === "XRP/USDT" && "bg-white/5"
                      }`}
                    >
                      XRP/USDT
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          asset: "BNB/USDT",
                        }));
                        setShowAssetDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.asset === "BNB/USDT" && "bg-white/5"
                      }`}
                    >
                      BNB/USDT
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-3 relative">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Trade type
              </p>
              <div
                title="Trade type"
                className={`h-[55px] cursor-pointer capitalize w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowTradeTypeDropdown(true);
                }}
              >
                <p>{formData.action ? formData.action : "Select trade type"}</p>
                <FaChevronDown className="w-3 stroke-white/50" />
              </div>
              {showTradeTypeDropdown && (
                <>
                  <div
                    className="fixed inset-0 bg-transparent cursor-pointer"
                    onClick={() => {
                      setShowTradeTypeDropdown(false);
                    }}
                  />
                  <div className="absolute z-10 top-24 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          action: "buy",
                        }));
                        setShowTradeTypeDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.action === "buy" && "bg-white/5"
                      }`}
                    >
                      Buy
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          action: "sell",
                        }));
                        setShowTradeTypeDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.action === "sell" && "bg-white/5"
                      }`}
                    >
                      Sell
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-3 relative">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Trade direction
              </p>
              <div
                title="Trade direction"
                className={`h-[55px] cursor-pointer capitalize w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowTradeDirectionDropdown(true);
                }}
              >
                <p>
                  {formData.direction
                    ? formData.direction
                    : "Select trade direction"}
                </p>
                <FaChevronDown className="w-3 stroke-white/50" />
              </div>
              {showTradeDirectionDropdown && (
                <>
                  <div
                    className="fixed inset-0 bg-transparent cursor-pointer"
                    onClick={() => {
                      setShowTradeDirectionDropdown(false);
                    }}
                  />
                  <div className="absolute z-10 top-24 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          direction: "long",
                        }));
                        setShowTradeDirectionDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.direction === "long" && "bg-white/5"
                      }`}
                    >
                      Long
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          direction: "short",
                        }));
                        setShowTradeDirectionDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.direction === "short" && "bg-white/5"
                      }`}
                    >
                      Short
                    </p>
                  </div>
                </>
              )}
            </div>
            <label htmlFor="entryPrice" className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Entry Price
              </p>
              <input
                id="entryPrice"
                name="entryPrice"
                readOnly={isLoading}
                required
                value={formData.entryPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    entryPrice: Number(e.target.value.replace(/[^0-9.]/g, "")),
                  }))
                }
                title="Input entry price"
                type="text"
                placeholder="Input entry price"
                className={`h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
              />
            </label>
            <label htmlFor="stopLoss" className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Stop loss
              </p>
              <input
                id="stopLoss"
                name="stopLoss"
                readOnly={isLoading}
                required
                value={formData.stopLoss}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stopLoss: Number(e.target.value.replace(/[^0-9.]/g, "")),
                  }))
                }
                title="Input stop loss"
                type="text"
                placeholder="Input stop loss"
                className={`h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
              />
            </label>
            <label htmlFor="takeProfit" className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Take profit
              </p>
              <input
                id="takeProfit"
                name="takeProfit"
                readOnly={isLoading}
                required
                value={formData.takeProfit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    takeProfit: Number(e.target.value.replace(/[^0-9.]/g, "")),
                  }))
                }
                title="Input take profit"
                type="text"
                placeholder="Input take profit"
                className={`h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
              />
            </label>
            <label htmlFor="leverage" className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Leverage
              </p>
              <input
                id="leverage"
                name="leverage"
                readOnly={isLoading}
                required
                value={formData.leverage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    leverage: e.target.value.replace(/[^0-9.]/g, ""),
                  }))
                }
                title="Add leverage"
                type="text"
                placeholder="Add leverage"
                className={`h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
              />
            </label>
            <div className="space-y-3 relative">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Position Size
              </p>
              <div
                title="Position SIze"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
              >
                <input
                  id="positionSizeValue"
                  name="positionSizeValue"
                  readOnly={isLoading}
                  required
                  value={formData.positionSize.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      positionSize: {
                        ...prev.positionSize,
                        amount: e.target.value.replace(/[^0-9.]/g, ""),
                      },
                    }))
                  }
                  title="Add position size"
                  type="text"
                  placeholder="Add position size"
                  className={`size-full text-base font-normal gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-transparent`}
                />
                <span
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (isLoading) return;
                    setShowPositionDropdown((prev) => !prev);
                  }}
                >
                  <span>{formData.positionSize.currency}</span>
                  <FaChevronDown className="w-3 stroke-white/50" />
                </span>
              </div>
              {showPositionDropdown && (
                <>
                  <div
                    className="fixed inset-0 bg-transparent cursor-pointer"
                    onClick={() => {
                      setShowPositionDropdown(false);
                    }}
                  />
                  <div className="absolute z-10 top-20 right-0 w-[130px] rounded-[10px] flex flex-col bg-[#252326] overflow-hidden">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          positionSize: {
                            ...prev.positionSize,
                            currency: "BTC",
                          },
                        }));
                        setShowPositionDropdown(false);
                      }}
                      className={`p-2 h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.positionSize.currency === "BTC" && "bg-white/5"
                      }`}
                    >
                      BTC
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          positionSize: {
                            ...prev.positionSize,
                            currency: "USDT",
                          },
                        }));
                        setShowPositionDropdown(false);
                      }}
                      className={`p-2 h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.positionSize.currency === "USDT" &&
                        "bg-white/5"
                      }`}
                    >
                      USDT
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-3 relative">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Trade duration
              </p>
              <div
                title="Trade duration"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowTradeDurationDropdown(true);
                }}
              >
                <p>
                  {formData.duration
                    ? typeof formData.duration === "string"
                      ? formData.duration
                      : typeof formData.duration === "object" &&
                        formData.duration !== null &&
                        formData.duration.startDate &&
                        formData.duration.endDate
                      ? (() => {
                          const start = new Date(formData.duration.startDate);
                          const end = new Date(formData.duration.endDate);
                          const diffMs = end.getTime() - start.getTime();
                          const diffDays = Math.floor(
                            diffMs / (1000 * 60 * 60 * 24)
                          );
                          const diffHours = Math.floor(
                            (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                          );
                          const diffMinutes = Math.floor(
                            (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                          );
                          let result = "";
                          if (diffDays > 0) result += `${diffDays}d `;
                          if (diffHours > 0) result += `${diffHours}h `;
                          if (diffMinutes > 0) result += `${diffMinutes}m`;
                          return result.trim() || "0m";
                        })()
                      : ""
                    : "Select trade duration"}
                </p>
                <FaChevronDown className="w-3 stroke-white/50" />
              </div>
              {showTradeDurationDropdown && (
                <>
                  <div
                    className="fixed inset-0 bg-transparent cursor-pointer"
                    onClick={() => {
                      setShowTradeDurationDropdown(false);
                    }}
                  />

                  <div className="absolute z-10 top-24 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          duration: "Scalp",
                        }));
                        setShowTradeDurationDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.duration === "Scalp" && "bg-white/5"
                      }`}
                    >
                      Scalp
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          duration: "Intraday",
                        }));
                        setShowTradeDurationDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.duration === "Intraday" && "bg-white/5"
                      }`}
                    >
                      Intraday
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          duration: "Swing",
                        }));
                        setShowTradeDurationDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.duration === "Swing" && "bg-white/5"
                      }`}
                    >
                      Swing
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          duration: "Position",
                        }));
                        setShowTradeDurationDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.duration === "Position" && "bg-white/5"
                      }`}
                    >
                      Position
                    </p>
                    <div className="flex flex-col gap-4 px-2 py-3 w-full opacity-80">
                      <div
                        className="flex items-center justify-between gap-4 cursor-pointer"
                        onClick={() => {
                          setShowCustomDatePicker((prev) => !prev);
                          setFormData((prev) => ({
                            ...prev,
                            duration: undefined,
                          }));
                        }}
                      >
                        <p className="text-sm text-white/60">
                          Add custom date and time
                        </p>
                        <FaChevronDown
                          className={`${
                            showCustomDatePicker && "rotate-180"
                          } w-3 stroke-white/50`}
                        />
                      </div>

                      {showCustomDatePicker && (
                        <>
                          <div className="space-y-3 relative w-full">
                            <p className="text-sm text-white/60">
                              Start date and time
                            </p>

                            <span className="h-[43px] flex items-center w-full px-4 rounded-[10px] gap-4 border border-white/15">
                              <DatePicker
                                placeholderText="Select date"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                required
                                minDate={new Date()}
                                dateFormat="P"
                                locale="en-GB"
                                className={`size-full text-base font-normal leading-6 tracking-[1px] text-white/60 outline-0 ring-0 caret-[#B39FF0]`}
                              />
                            </span>

                            <span className="h-[43px] flex items-center w-full px-4 rounded-[10px] gap-4 border border-white/15">
                              <DatePicker
                                placeholderText="Select time"
                                selected={startTime}
                                onChange={(date) => {
                                  if (!startDate) {
                                    toast.error("Select start date first");
                                    return;
                                  }

                                  if (!date) {
                                    toast.error("Select a valid time");
                                    return;
                                  }

                                  const combined = new Date(
                                    startDate.getFullYear(),
                                    startDate.getMonth(),
                                    startDate.getDate(),
                                    date.getHours(),
                                    date.getMinutes()
                                  );
                                  if (combined.getTime() < Date.now()) {
                                    toast.error(
                                      "Please select a valid future date and time to schedule."
                                    );
                                    return;
                                  }

                                  setStartTime(date);
                                }}
                                required
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                className={`size-full text-base font-normal leading-6 tracking-[1px] text-white/60 outline-0 ring-0 caret-[#B39FF0]`}
                              />
                            </span>
                          </div>

                          <div className="space-y-3 relative w-full">
                            <p className="text-sm text-white/60">
                              End date and time
                            </p>

                            <span className="h-[43px] flex items-center w-full px-4 rounded-[10px] gap-4 border border-white/15">
                              <DatePicker
                                placeholderText="Select date"
                                selected={endDate}
                                onChange={(date) => {
                                  if (!startDate || !startTime) {
                                    toast.error("Select start date first");
                                    return;
                                  }

                                  setEndDate(date);
                                }}
                                required
                                minDate={startDate || new Date()}
                                dateFormat="P"
                                locale="en-GB"
                                className={`size-full text-base font-normal leading-6 tracking-[1px] text-white/60 outline-0 ring-0 caret-[#B39FF0]`}
                              />
                            </span>

                            <span className="h-[43px] flex items-center w-full px-4 rounded-[10px] gap-4 border border-white/15">
                              <DatePicker
                                placeholderText="Select time"
                                selected={endTime}
                                onChange={(date) => {
                                  if (!startDate || !startTime) {
                                    toast.error("Select start date first");
                                    return;
                                  }
                                  if (!endDate) {
                                    toast.error("Select end date first");
                                    return;
                                  }
                                  if (!date) {
                                    toast.error("Select a valid time");
                                    return;
                                  }

                                  const startDateCombined = new Date(
                                    startDate.getFullYear(),
                                    startDate.getMonth(),
                                    startDate.getDate(),
                                    startTime.getHours(),
                                    startTime.getMinutes()
                                  );

                                  const endDateCombined = new Date(
                                    endDate.getFullYear(),
                                    endDate.getMonth(),
                                    endDate.getDate(),
                                    date.getHours(),
                                    date.getMinutes()
                                  );

                                  if (
                                    endDateCombined.getTime() <=
                                    startDateCombined.getTime()
                                  ) {
                                    toast.error(
                                      "End date and time must be after start date and time."
                                    );
                                    return;
                                  }

                                  setFormData((prev) => ({
                                    ...prev,
                                    tradeDuration: {
                                      startDate: startDateCombined,
                                      endDate: endDateCombined,
                                    },
                                  }));

                                  setEndTime(date);
                                  setShowTradeDurationDropdown(false);
                                }}
                                required
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                className={`size-full text-base font-normal leading-6 tracking-[1px] text-white/60 outline-0 ring-0 caret-[#B39FF0]`}
                              />
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-3 relative">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Risk Level
              </p>
              <div
                title="Risk Level"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowRiskLevelDropdown(true);
                }}
              >
                <p>
                  {formData.riskLevel
                    ? formData.riskLevel
                    : "Select risk level"}
                </p>
                <FaChevronDown className="w-3 stroke-white/50" />
              </div>
              {showRiskLevelDropdown && (
                <>
                  <div
                    className="fixed inset-0 bg-transparent cursor-pointer"
                    onClick={() => {
                      setShowRiskLevelDropdown(false);
                    }}
                  />
                  <div className="absolute z-10 top-24 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          riskLevel: "Low",
                        }));
                        setShowRiskLevelDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.riskLevel === "Low" && "bg-white/5"
                      }`}
                    >
                      Low
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          riskLevel: "Medium",
                        }));
                        setShowRiskLevelDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.riskLevel === "Medium" && "bg-white/5"
                      }`}
                    >
                      Medium
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          riskLevel: "High",
                        }));
                        setShowRiskLevelDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.riskLevel === "High" && "bg-white/5"
                      }`}
                    >
                      High
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-3 relative">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Order type
              </p>
              <div
                title="Order type"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowOrderTypeDropdown(true);
                }}
              >
                <p>
                  {formData.orderType
                    ? formData.orderType
                    : "Select order type"}
                </p>
                <FaChevronDown className="w-3 stroke-white/50" />
              </div>
              {showOrderTypeDropdown && (
                <>
                  <div
                    className="fixed inset-0 bg-transparent cursor-pointer"
                    onClick={() => {
                      setShowOrderTypeDropdown(false);
                    }}
                  />
                  <div className="absolute z-10 top-24 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          orderType: "Market Order",
                        }));
                        setShowOrderTypeDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.orderType === "Market Order" && "bg-white/5"
                      }`}
                    >
                      Market Order
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          orderType: "Limit Order",
                        }));
                        setShowOrderTypeDropdown(false);
                      }}
                      className={`px-2 py-3 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.orderType === "Limit Order" && "bg-white/5"
                      }`}
                    >
                      Limit Order
                    </p>
                  </div>
                </>
              )}
            </div>
            <label htmlFor="reason" className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Reason for trade
              </p>
              <textarea
                id="reason"
                name="reason"
                readOnly={isLoading}
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                required
                title="Add reason"
                placeholder="Add a detailed reason for trade"
                className={`h-[160px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
              />
            </label>
            <label className="flex items-center gap-6 text-white/80">
              <p
                onClick={() => {
                  if (isLoading) return;
                  setFormData((prev) => ({
                    ...prev,
                    isDraft: false,
                  }));
                }}
                className="flex gap-3 items-center text-base leading-6 tracking-[1px] cursor-pointer"
              >
                <span
                  className={`size-4 rounded-full ${
                    !formData.isDraft
                      ? "bg-[#B39FF0]"
                      : "border border-white/50"
                  }`}
                />
                Publish now
              </p>
              <p
                onClick={() => {
                  if (isLoading) return;
                  setFormData((prev) => ({
                    ...prev,
                    isDraft: true,
                  }));
                }}
                className="flex gap-3 items-center text-base leading-6 tracking-[1px] cursor-pointer"
              >
                <span
                  className={`size-4 rounded-full ${
                    formData.isDraft ? "bg-[#B39FF0]" : "border border-white/50"
                  }`}
                />
                Save as draft
              </p>
            </label>
          </div>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          title="upload trade"
          className="flex items-center justify-center gap-2.5 bg-[#B39FF0] rounded-[20px] p-3 mx-auto h-[50px] w-[188px] text-sm leading-[150%] tracking-[2px] font-bold text-[#2C2C26]"
        >
          {isLoading ? <Loader /> : "Done"}
        </button>
      </form>
    </div>
  );
}
