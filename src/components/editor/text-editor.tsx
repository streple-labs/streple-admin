import cn from "classnames";
import { ContentBlock, Editor } from "draft-js";
import { blockRenderer } from "./block-renderer";
import { AlignmentType, BLOCK_RENDER_MAP, CUSTOM_STYLE_MAP } from "./config";
import { useEditorApi } from "./context";

export type TextEditorProps = {
  className?: string;
};

const TextEditor: React.FC<TextEditorProps> = ({ className }) => {
  const editorApi = useEditorApi();

  const getBlockStyle = (block: ContentBlock): string => {
    const alignment = block.getData().get("textAlign") as AlignmentType;

    switch (alignment) {
      case AlignmentType.CENTER:
        return "text-center";
      case AlignmentType.RIGHT:
        return "text-right";
      case AlignmentType.JUSTIFY:
        return "text-justify";
      case AlignmentType.LEFT:
      default:
        return "text-left";
    }
  };

  return (
    <div className={cn("min-h-40 caret-white cursor-pointer", className)}>
      <Editor
        spellCheck
        handleKeyCommand={editorApi.handleKeyCommand}
        customStyleMap={CUSTOM_STYLE_MAP}
        blockRenderMap={BLOCK_RENDER_MAP}
        blockStyleFn={getBlockStyle}
        blockRendererFn={(block) =>
          blockRenderer(block, {
            getContentState: () => editorApi.state.getCurrentContent(),
          })
        }
        editorState={editorApi.state}
        onChange={editorApi.onChange}
        keyBindingFn={editorApi.handlerKeyBinding}
      />
    </div>
  );
};

export default TextEditor;
