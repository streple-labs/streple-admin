import { anton } from "@/app/fonts";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import Loader from "../loader";

export default function PublishTradeForm({
  isOpen,
  close,
  formData,
  setFormData,
  isLoading,
}: {
  isOpen: boolean;
  close: () => void;
  formData: CopyTradeFormData;
  setFormData: Dispatch<SetStateAction<CopyTradeFormData>>;
  isLoading: boolean;
}) {
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [showTradeTypeDropdown, setShowTradeTypeDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showTradeDurationDropdown, setShowTradeDurationDropdown] =
    useState(false);
  const [showRiskLevelDropdown, setShowRiskLevelDropdown] = useState(false);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 p-[10%] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={close} />

      <form
        onClick={(e) => {
          e.preventDefault();
          if (isLoading) return;

          console.log(formData);
          close();
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
            <div className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Asset to be used
              </p>
              <div
                title="Select asset"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowAssetDropdown((prev) => !prev);
                }}
              >
                <p>
                  {formData.assetPair ? formData.assetPair : "Select asset"}
                </p>
                <FaChevronDown className="w-3 stroke-white/50" />
                {showAssetDropdown && (
                  <div className="absolute z-10 top-14 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col gap-3 bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          assetPair: "BTC/USDT",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.assetPair === "BTC/USDT" && "bg-white/5"
                      }`}
                    >
                      BTC/USDT
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          assetPair: "ETH/USDT",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.assetPair === "ETH/USDT" && "bg-white/5"
                      }`}
                    >
                      ETH/USDT
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          assetPair: "SOL/USDT",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.assetPair === "SOL/USDT" && "bg-white/5"
                      }`}
                    >
                      SOL/USDT
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          assetPair: "XRP/USDT",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.assetPair === "XRP/USDT" && "bg-white/5"
                      }`}
                    >
                      XRP/USDT
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          assetPair: "BNB/USDT",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.assetPair === "BNB/USDT" && "bg-white/5"
                      }`}
                    >
                      BNB/USDT
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Trade type
              </p>
              <div
                title="Trade type"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowTradeTypeDropdown((prev) => !prev);
                }}
              >
                <p>
                  {formData.tradeType
                    ? formData.tradeType
                    : "Select trade type"}
                </p>
                <FaChevronDown className="w-3 stroke-white/50" />
                {showTradeTypeDropdown && (
                  <div className="absolute z-10 top-14 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col gap-3 bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tradeType: "Buy",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.tradeType === "Buy" && "bg-white/5"
                      }`}
                    >
                      Buy
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tradeType: "Sell",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.tradeType === "Sell" && "bg-white/5"
                      }`}
                    >
                      Sell
                    </p>
                  </div>
                )}
              </div>
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
                    leverage: Number(e.target.value.replace(/[^0-9.]/g, "")),
                  }))
                }
                title="Add leverage"
                type="text"
                placeholder="Add leverage"
                className={`h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
              />
            </label>
            <div className="space-y-3">
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
                  value={formData.positionSizeValue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      positionSizeValue: Number(
                        e.target.value.replace(/[^0-9.]/g, "")
                      ),
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
                  <span>{formData.positionSizeCurrency}</span>
                  <FaChevronDown className="w-3 stroke-white/50" />
                </span>
                {showPositionDropdown && (
                  <div className="absolute z-10 top-10 right-0 w-[130px] rounded-[10px] flex flex-col bg-[#252326] overflow-hidden">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          positionSizeCurrency: "BTC",
                        }));
                      }}
                      className={`p-2 h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.positionSizeCurrency === "BTC" && "bg-white/5"
                      }`}
                    >
                      BTC
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          positionSizeCurrency: "USDT",
                        }));
                      }}
                      className={`p-2 h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.positionSizeCurrency === "USDT" && "bg-white/5"
                      }`}
                    >
                      Medium
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Trade duration
              </p>
              <div
                title="Trade duration"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowTradeDurationDropdown((prev) => !prev);
                }}
              >
                <p>
                  {formData.tradeDuration !== undefined &&
                  typeof formData.tradeDuration === "string"
                    ? formData.tradeDuration
                    : "Select trade duration"}
                </p>
                <FaChevronDown className="w-3 stroke-white/50" />
                {showTradeDurationDropdown && (
                  <div className="absolute z-10 top-14 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col gap-3 bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tradeDuration: "Scalp",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.tradeDuration === "Scalp" && "bg-white/5"
                      }`}
                    >
                      Scalp
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tradeDuration: "Intraday",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.tradeDuration === "Intraday" && "bg-white/5"
                      }`}
                    >
                      Intraday
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tradeDuration: "Swing",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.tradeDuration === "Swing" && "bg-white/5"
                      }`}
                    >
                      Swing
                    </p>
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tradeDuration: "Position",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.tradeDuration === "Position" && "bg-white/5"
                      }`}
                    >
                      Position
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Risk Level
              </p>
              <div
                title="Risk Level"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isLoading) return;
                  setShowRiskLevelDropdown((prev) => !prev);
                }}
              >
                <p>
                  {formData.riskLevel
                    ? formData.riskLevel
                    : "Select risk level"}
                </p>
                <FaChevronDown className="w-3 stroke-white/50" />
                {showRiskLevelDropdown && (
                  <div className="absolute z-10 top-14 left-0 w-full rounded-[20px] border border-white/10 p-3 flex flex-col gap-3 bg-[#2F2E2F]">
                    <p
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          riskLevel: "Low",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
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
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
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
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal hover:bg-white/5 text-white/60 cursor-pointer ${
                        formData.riskLevel === "High" && "bg-white/5"
                      }`}
                    >
                      High
                    </p>
                  </div>
                )}
              </div>
            </div>
            <label htmlFor="reason" className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Reason for trade
              </p>
              <textarea
                id="reason"
                name="reason"
                readOnly={isLoading}
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                required
                title="Add reason"
                placeholder="Add a detailed reason for trade"
                className={`h-[160px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
              />
            </label>
          </div>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          title="upload trade"
          className="flex items-center justify-center gap-2.5 bg-[#B39FF0] rounded-[20px] p-3 mx-auto h-[50px] w-[188px] text-sm leading-[150%] tracking-[2px] font-bold text-[#2C2C26]"
        >
          {isLoading ? <Loader /> : "Publish"}
        </button>
      </form>
    </div>
  );
}
