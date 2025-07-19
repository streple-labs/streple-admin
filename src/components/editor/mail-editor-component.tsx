import cn from "classnames";
import { useState } from "react";
import { FaArrowLeft, FaChevronDown, FaPlus } from "react-icons/fa6";
import { GoCheckCircle, GoLink } from "react-icons/go";
import { IoImageOutline } from "react-icons/io5";
import { MdOutlineTouchApp } from "react-icons/md";
import { RxTextAlignCenter } from "react-icons/rx";
import ColorPicker from "./color-picker";
import {
  BLOCK_LABELS,
  BlockType,
  HEADING_BLOCK_LABELS,
  InlineStyle,
  InlineStyle_LABELS,
} from "./config";
import { useEditorApi } from "./context";
import TextEditor from "./text-editor";

export default function MailEditorComponent({
  close,
  setText,
}: {
  close: () => void;
  setText: (text: string) => void;
}) {
  const {
    toHtml,
    addLink,
    addImg,
    addButton,
    toggleBlockType,
    currentBlockType,
    toggleInlineStyle,
    hasInlineStyle,
    openLinkForm,
    setOpenLinkForm,
  } = useEditorApi();

  const [showHeadingOptions, setShowHeadingOptions] = useState(false);

  const [url, setUrl] = useState("");

  const [openButtonForm, setOpenButtonForm] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonLink, setButtonLink] = useState("");

  const [showDraftMsg, setShowDraftMsg] = useState(false);

  return (
    <div>
      <div className="pb-[18px] border-b border-b-white/5 flex items-center justify-between">
        <div className="shrink-0 flex items-center gap-6">
          <span className="cursor-pointer" onClick={close}>
            <FaArrowLeft className="w-5 stroke-white/80" />
          </span>
          <h4 className="text-xl font-semibold text-white/80">New Email</h4>
        </div>

        <div className="shrink-0 flex items-center gap-6">
          <div
            className="flex items-center gap-3 cursor-pointer relative"
            onClick={() => setShowHeadingOptions(!showHeadingOptions)}
          >
            <p className="text-xs leading-4 text-white/70">
              {BLOCK_LABELS[currentBlockType]}
            </p>

            <FaChevronDown className="w-3 stroke-white/50" />

            {showHeadingOptions && (
              <div className="absolute top-6 left-0 bg-white/10 backdrop-blur-md rounded-lg p-2 flex flex-col gap-1 w-40">
                {Object.entries(HEADING_BLOCK_LABELS).map(([type, label]) => (
                  <button
                    key={type}
                    className={cn(
                      "w-full text-left p-2 rounded text-xs",
                      currentBlockType === type && "text-[#A082F9]"
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      toggleBlockType(type as BlockType);
                      setShowHeadingOptions(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {Object.values(InlineStyle)
            .filter(
              (style) =>
                !style.startsWith("COLOR_") && !style.startsWith("ALIGN_")
            )
            .map((v) => (
              <button
                key={v}
                className={cn(
                  "shrink-0 my-2.5 mr-1.5",
                  hasInlineStyle(v) ? "text-[#A082F9]" : "text-[#FFFFFF99]"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleInlineStyle(v);
                }}
              >
                {InlineStyle_LABELS[v]}
              </button>
            ))}

          <ColorPicker />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="text-xs font-normal text-[#CFCFD3] flex items-center justify-center gap-2.5"
            onClick={() => {
              setShowDraftMsg(true);
              setTimeout(() => {
                setShowDraftMsg(false);
              }, 5000);
            }}
          >
            Save as draft
          </button>
          <button className="text-xs font-normal text-[#CFCFD3] border-[#FAF2F24D] border rounded-[10px] h-10 p-3 flex items-center justify-center gap-2.5">
            Schedule for later
          </button>
          <button
            onClick={() => {
              console.log(toHtml());
              setText(toHtml());
            }}
            title="publish article"
            aria-label="publish article"
            className="text-xs text-[#2B2B37] font-normal bg-[#A082F9] min-w-[83px] rounded-[10px] h-10 p-3 flex items-center justify-center gap-2.5"
          >
            Send
          </button>
        </div>
      </div>
      <div className="flex relative overflow-y-hidden hide-scrollbar">
        <div
          className={`absolute z-50 rounded-[20px] text-nowrap ${
            showDraftMsg ? "translate-y-4" : " -translate-y-20"
          } left-1/2 -translate-x-1/2 border border-white/[8%] bg-white/20 px-2.5 py-1 flex items-center gap-2.5 text-xs leading-5 font-normal text-[#A082F9] tracking-[1px]`}
        >
          <GoCheckCircle color="A082F9" size={12} />
          <p>
            Draft saved. You can finish it anytime.{" "}
            <span
              onClick={close}
              className="cursor-pointer font-semibold underline"
            >
              Back to Email centre
            </span>
          </p>
        </div>

        <div className="border-r border-r-white/5 py-6 pr-6 space-y-6 w-1/5">
          <p className="text-[12px] font-semibold">Basic formatting</p>
          <div className="w-full grid grid-cols-2 gap-y-6 gap-x-3">
            <label
              htmlFor="image-input"
              className="h-[60px] p-2 rounded-[5px] border border-white/15 flex flex-col gap-2.5 items-center justify-center cursor-pointer"
            >
              <IoImageOutline color="#FFFFFFB2" width={14} />
              <span className="text-white/70 text-[11px]">Image</span>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    addImg(imageUrl);
                    e.target.value = "";
                  }
                }}
              />
            </label>
            <div className="h-[60px] relative">
              <span
                onClick={() => {
                  setOpenLinkForm(true);
                }}
                style={{
                  backgroundColor: openLinkForm ? "#2B2B37" : "transparent",
                }}
                className="flex flex-col gap-2.5 items-center justify-center cursor-pointer size-full p-2 rounded-[5px] border border-white/15"
              >
                <GoLink color="#FFFFFFB2" width={14} />
                <span className="text-white/70 text-[11px]">Link</span>
              </span>

              {openLinkForm && (
                <>
                  <div
                    className="fixed inset-0 z-10 cursor-pointer"
                    onClick={() => {
                      setOpenLinkForm(false);
                    }}
                  />
                  <div className="absolute z-20 top-16 left-0 w-[300px] rounded-[15px] p-3 flex flex-col gap-3 bg-[#252326]">
                    <input
                      type="text"
                      placeholder="Add link"
                      className="w-full bg-transparent outline-none rounded-[10px] ring-0 border border-white/10 h-[45px] px-4 py-3 text-xs text-white/50"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                      className="w-full text-xs font-bold leading-4 tracking-[1px] text-end text-[#A082F9CC]"
                      onClick={() => {
                        if (url) addLink(url);
                        setUrl("");
                        setOpenLinkForm(false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </>
              )}
            </div>
            <div
              onClick={() => {
                toggleBlockType(BlockType.divider);
              }}
              className="h-[60px] p-2 rounded-[5px] border border-white/15 flex flex-col gap-2.5 items-center justify-center cursor-pointer"
            >
              <RxTextAlignCenter color="#FFFFFFB2" width={14} />
              <span className="text-white/70 text-[11px]">Divider</span>
            </div>

            <div className="h-[60px] relative">
              <span
                onClick={() => {
                  setOpenButtonForm(true);
                }}
                style={{
                  backgroundColor: openButtonForm ? "#2B2B37" : "transparent",
                }}
                className="flex flex-col gap-2.5 items-center justify-center cursor-pointer size-full p-2 rounded-[5px] border border-white/15"
              >
                <MdOutlineTouchApp color="#FFFFFFB2" width={14} />
                <span className="text-white/70 text-[11px]">Button</span>
              </span>

              {openButtonForm && (
                <>
                  <div
                    className="fixed inset-0 z-10 cursor-pointer"
                    onClick={() => {
                      setOpenButtonForm(false);
                    }}
                  />
                  <div className="absolute z-20 top-16 left-0 w-[300px] rounded-[15px] p-3 flex flex-col gap-3 bg-[#252326]">
                    <input
                      type="text"
                      placeholder="Button Label"
                      className="w-full bg-transparent outline-none rounded-[10px] ring-0 border border-white/10 h-[45px] px-4 py-3 text-xs text-white/40"
                      value={buttonLabel}
                      onChange={(e) => setButtonLabel(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Button URL"
                      className="w-full bg-transparent outline-none rounded-[10px] ring-0 border border-white/10 h-[45px] px-4 py-3 text-xs text-white/40"
                      value={buttonLink}
                      onChange={(e) => setButtonLink(e.target.value)}
                    />
                    <button
                      className="w-full text-xs font-bold leading-4 tracking-[1px] text-end text-[#A082F9CC]"
                      onClick={() => {
                        if (buttonLabel && buttonLink)
                          addButton(buttonLabel, buttonLink);
                        setOpenButtonForm(false);
                        setButtonLabel("");
                        setButtonLink("");
                      }}
                    >
                      Add button
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 w-[60%]">
          <div className="bg-white/[3%] rounded-[20px] p-5">
            <TextEditor className="min-h-80" />
          </div>
        </div>
        <div className="border-l border-l-white/5 py-6 pl-6 space-y-3 w-1/5">
          <div className="w-full space-y-6">
            <p className="text-[12px] font-semibold">Basic formatting</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Add subject line"
                className="w-full bg-transparent outline-none rounded-[10px] ring-0 border border-white/10 h-10 px-3 py-5 text-xs text-white/50"
              />
              <div className="w-full bg-transparent outline-none rounded-[10px] ring-0 border border-white/10 h-10 px-3 py-5 text-xs text-white/50 flex items-center justify-between">
                <input
                  className="p-0 bg-transparent text-[11px] leading-4 tracking-[1px] text-white/50 caret-[#A082F9] border-0 ring-0 outline-0"
                  style={{
                    width: `${1}ch`,
                    minWidth: "2ch",
                    maxWidth: "100%",
                  }}
                  // value={searchTag}
                  // onChange={(e) => setSearchTag(e.target.value.trim())}
                />
                <FaPlus width={8} className="ml-auto cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="space-y-3 text-white/50">
            <p
              onClick={() => {}}
              className="flex gap-2.5 items-center text-[11px] leading-4 tracking-[1px] cursor-pointer"
            >
              <span
                className={`size-4 rounded-full ${
                  false ? "bg-[#B39FF0]" : "border border-white/50"
                }`}
              />
              All
            </p>
            <p
              onClick={() => {}}
              className="flex gap-2.5 items-center text-[11px] leading-4 tracking-[1px] cursor-pointer"
            >
              <span
                className={`size-4 rounded-full ${
                  false ? "bg-[#B39FF0]" : "border border-white/50"
                }`}
              />
              Copiers
            </p>
            <p
              onClick={() => {}}
              className="flex gap-2.5 items-center text-[11px] leading-4 tracking-[1px] cursor-pointer"
            >
              <span
                className={`size-4 rounded-full ${
                  false ? "bg-[#B39FF0]" : "border border-white/50"
                }`}
              />
              Protraders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
