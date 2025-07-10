import cn from "classnames";
import { Editor } from "draft-js";
import { blockRenderer } from "./block-renderer";
import { BLOCK_RENDER_MAP, CUSTOM_STYLE_MAP } from "./config";
import { useEditorApi } from "./context";

export type TextEditorProps = {
  className?: string;
};

const TextEditor: React.FC<TextEditorProps> = ({ className }) => {
  const editorApi = useEditorApi();

  return (
    <div className={cn("min-h-40 caret-white cursor-pointer", className)}>
      <Editor
        spellCheck
        handleKeyCommand={editorApi.handleKeyCommand}
        customStyleMap={CUSTOM_STYLE_MAP}
        blockRenderMap={BLOCK_RENDER_MAP}
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
