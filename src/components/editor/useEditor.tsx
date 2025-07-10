import {
  AtomicBlockUtils,
  CompositeDecorator,
  DraftEntityMutability,
  DraftHandleValue,
  EditorState,
  KeyBindingUtil,
  RichUtils,
  getDefaultKeyBinding,
} from "draft-js";
import { useCallback, useMemo, useState } from "react";
import { BlockType, EntityType, InlineStyle, KeyCommand } from "./config";
import { HTMLtoState, stateToHTML } from "./convert";
import { ImageDecorator } from "./image-block";
import LinkDecorator from "./link";

export type EditorApi = {
  state: EditorState;
  onChange: (state: EditorState) => void;
  toggleBlockType: (blockType: BlockType) => void;
  currentBlockType: BlockType;
  toHtml: () => string;
  toggleInlineStyle: (inlineStyle: InlineStyle) => void;
  hasInlineStyle: (inlineStyle: InlineStyle) => boolean;
  addLink: (url: string) => void;
  addImg: (img: string) => void;
  addImgInline: (img: string) => void;
  setEntityData: (entityKey: string, data: Record<string, string>) => void;
  handleKeyCommand: (
    command: KeyCommand,
    editorState: EditorState
  ) => DraftHandleValue;
  handlerKeyBinding: (e: React.KeyboardEvent) => KeyCommand | null;
};

const decorator = new CompositeDecorator([LinkDecorator, ImageDecorator]);

export const useEditor = (html?: string): EditorApi => {
  const [state, setState] = useState(() =>
    html
      ? EditorState.createWithContent(HTMLtoState(html), decorator)
      : EditorState.createEmpty(decorator)
  );

  const toggleBlockType = useCallback((blockType: BlockType) => {
    setState((currentState) =>
      RichUtils.toggleBlockType(currentState, blockType)
    );
  }, []);

  const currentBlockType = useMemo(() => {
    const selection = state.getSelection();
    const content = state.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    console.log(block.toJS());

    return block.getType() as BlockType;
  }, [state]);

  const toggleInlineStyle = useCallback((inlineStyle: InlineStyle) => {
    setState((currentState) =>
      RichUtils.toggleInlineStyle(currentState, inlineStyle)
    );
  }, []);

  const hasInlineStyle = useCallback(
    (inlineStyle: InlineStyle) => {
      const currentStyle = state.getCurrentInlineStyle();
      return currentStyle.has(inlineStyle);
    },
    [state]
  );

  const setEntityData = useCallback((entityKey, data) => {
    setState((currentState) => {
      const content = currentState.getCurrentContent();
      const contentStateUpdated = content.mergeEntityData(entityKey, data);
      return EditorState.push(
        currentState,
        contentStateUpdated,
        "apply-entity"
      );
    });
  }, []);

  const addEntity = useCallback(
    (
      entityType: EntityType,
      data: Record<string, string>,
      mutability: DraftEntityMutability
    ) => {
      setState((currentState) => {
        const contentState = currentState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          entityType,
          mutability,
          data
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newState = EditorState.set(currentState, {
          currentContent: contentStateWithEntity,
        });
        return RichUtils.toggleLink(
          newState,
          newState.getSelection(),
          entityKey
        );
      });
    },
    []
  );

  const addLink = useCallback(
    (url: string) => {
      addEntity(EntityType.link, { url }, "MUTABLE");
    },
    [addEntity]
  );

  const addImg = useCallback((img: string) => {
    setState((currentState) => {
      const contentState = currentState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        EntityType.img,
        "IMMUTABLE",
        { img }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      const newState = EditorState.set(currentState, {
        currentContent: contentStateWithEntity,
      });

      return AtomicBlockUtils.insertAtomicBlock(newState, entityKey, " ");
    });
  }, []);

  const addImgInline = useCallback((img: string) => {
    setState((currentState) => {
      const contentState = currentState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        EntityType.img,
        "IMMUTABLE",
        { img }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newState = EditorState.set(currentState, {
        currentContent: contentStateWithEntity,
      });

      return RichUtils.toggleLink(newState, newState.getSelection(), entityKey);
    });
  }, []);

  const handleKeyCommand = useCallback(
    (command: KeyCommand, editorState: EditorState) => {
      // if (command === "accent") {
      //   toggleInlineStyle(InlineStyle.ACCENT);
      //   return "handled";
      // }

      const newState = RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        setState(newState);
        return "handled";
      }

      return "not-handled";
    },
    []
  );

  const handlerKeyBinding = useCallback((e: React.KeyboardEvent) => {
    if (e.keyCode === 81 && KeyBindingUtil.hasCommandModifier(e)) {
      return "accent";
    }

    return getDefaultKeyBinding(e);
  }, []);

  const toHtml = useCallback(
    () => stateToHTML(state.getCurrentContent()),
    [state]
  );

  return useMemo(
    () => ({
      state,
      onChange: setState,
      toggleBlockType,
      currentBlockType,
      toggleInlineStyle,
      hasInlineStyle,
      toHtml,
      addLink,
      addImg,
      addImgInline,
      setEntityData,
      handleKeyCommand,
      handlerKeyBinding,
    }),
    [
      state,
      toggleBlockType,
      currentBlockType,
      toggleInlineStyle,
      hasInlineStyle,
      toHtml,
      addLink,
      addImg,
      addImgInline,
      setEntityData,
      handleKeyCommand,
      handlerKeyBinding,
    ]
  );
};
