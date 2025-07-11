import { useState } from "react";
import { COLOR_OPTIONS, InlineStyle } from "./config";
import { useEditorApi } from "./context";

const ColorPicker = () => {
  const {
    applyColor,
    getCurrentColor,
    // removeColor
  } = useEditorApi();
  const [isOpen, setIsOpen] = useState(false);
  const currentColor = getCurrentColor();
  console.log(currentColor);

  const handleColorSelect = (color: InlineStyle) => {
    applyColor(color);
    setIsOpen(false);
  };

  // const handleRemoveColor = () => {
  //   removeColor();
  //   setIsOpen(false);
  // };

  return (
    <div className="relative">
      <div
        className="shrink-0 cursor-pointer relative rounded-full size-5"
        style={{
          backgroundColor: COLOR_OPTIONS[currentColor as InlineStyle] || "#fff",
        }}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-10 left-0 z-20 w-[110px] rounded-[10px] p-3 bg-[#252326] shadow-xl">
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(COLOR_OPTIONS).map(([colorKey, colorValue]) => (
                <button
                  key={colorKey}
                  className="size-5 rounded-full hover:scale-105"
                  style={{ backgroundColor: colorValue }}
                  onClick={() => handleColorSelect(colorKey as InlineStyle)}
                  title={colorKey.replace("COLOR_", "").toLowerCase()}
                />
              ))}
            </div>

            {/* <button
              onClick={handleRemoveColor}
              className="w-full text-xs mt-3 text-center py-2 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white/90 transition-colors"
            >
              Remove Color
            </button> */}
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker;
