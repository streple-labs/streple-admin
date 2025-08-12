import cn from "classnames";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa6";
import { GoLink } from "react-icons/go";
import { IoImageOutline } from "react-icons/io5";
import ColorPicker from "./color-picker";
import {
  Align_LABELS,
  AlignmentType,
  BLOCK_LABELS,
  BlockType,
  HEADING_BLOCK_LABELS,
  InlineStyle,
  InlineStyle_LABELS,
  LIST_LABELS,
} from "./config";
import { useEditorApi } from "./context";

const ToolPanel = ({
  title,
  setTitle,
  close,
  handlePublish,
  saveAsDraft,
  isEditing,
  content,
}: {
  title: string;
  setTitle: (title: string) => void;
  close: () => void;
  handlePublish: (text: string) => void;
  saveAsDraft: (text: string) => void;
  isEditing: boolean;
  content?: string;
}) => {
  const {
    toHtml,
    addLink,
    addImg,
    toggleBlockType,
    currentBlockType,
    toggleInlineStyle,
    hasInlineStyle,
    openLinkForm,
    setOpenLinkForm,
    hasAlignment,
    toggleAlignment,
    loadFromHTML,
  } = useEditorApi();

  useEffect(() => {
    if (isEditing && content) loadFromHTML(content);
  }, [isEditing, content, loadFromHTML]);

  const [showHeadingOptions, setShowHeadingOptions] = useState(false);

  const [url, setUrl] = useState("");

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex gap-8 justify-between pb-4 border-b border-b-white/5">
        <div className="flex items-center gap-6">
          <span className="cursor-pointer" onClick={close}>
            <FaArrowLeft className="w-5 stroke-white/80" />
          </span>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center"
          >
            <input
              value={title}
              type="text"
              className="text-xl text-white/80 font-semibold bg-transparent border-none outline-none"
              placeholder="Untitled document"
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Document title"
            />
          </form>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              saveAsDraft(toHtml());
            }}
            title="save as draft"
            aria-label="save as draft"
            className="text-xs font-normal text-[#CFCFD3] border-[#FAF2F24D] border rounded-[10px] h-10 p-3 flex items-center justify-center gap-2.5"
          >
            Save as draft
          </button>
          <button
            onClick={() => {
              handlePublish(toHtml());
            }}
            title="publish document"
            aria-label="publish document"
            className="text-xs text-[#2B2B37] font-normal bg-[#A082F9] rounded-[10px] h-10 p-3 flex items-center justify-center gap-2.5"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="shrink-0 flex items-center gap-3">
          <label
            htmlFor="image-input"
            className="shrink-0 px-3 py-2 rounded-[4px] bg-[#CBB0FD0D] cursor-pointer"
          >
            <IoImageOutline color="#D28BF6CC" width={12} />
            <input
              id="image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64 = reader.result as string;
                    addImg(base64);
                  };
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }
              }}
            />
          </label>
          <span className="shrink-0 px-3 py-2 rounded-[4px] bg-[#F4E90E0D] cursor-pointer relative">
            <span
              onClick={() => {
                setOpenLinkForm(true);
              }}
            >
              <GoLink color="#F4E90ECC" width={12} />
            </span>
            {openLinkForm && (
              <div className="absolute top-8 left-0 w-[300px] rounded-[15px] p-3 flex flex-col gap-3 bg-[#252326]">
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
            )}
          </span>
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

          {Object.values(AlignmentType).map((alignment) => (
            <button
              key={alignment}
              className={cn(
                "shrink-0 my-2.5 mr-1.5",
                hasAlignment(alignment) ? "text-[#A082F9]" : "text-[#FFFFFF99]"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleAlignment(alignment);
              }}
            >
              {Align_LABELS[alignment]}
            </button>
          ))}

          {Object.entries(LIST_LABELS).map(([type, label]) => (
            <button
              key={type}
              className={cn(
                "shrink-0 my-2.5 mr-1.5",
                currentBlockType === type
                  ? "text-[#A082F9]"
                  : "text-[#FFFFFF99]"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlockType(type as BlockType);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolPanel;
