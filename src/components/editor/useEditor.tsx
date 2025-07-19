import {
  AtomicBlockUtils,
  CompositeDecorator,
  DraftEntityMutability,
  DraftHandleValue,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  RichUtils,
  SelectionState,
} from "draft-js";
import { useCallback, useMemo, useState } from "react";
import {
  AlignmentType,
  BlockType,
  COLOR_OPTIONS,
  EntityType,
  InlineStyle,
  KeyCommand,
} from "./config";
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
  applyColor: (color: InlineStyle) => void;
  getCurrentColor: () => InlineStyle | null;
  removeColor: () => void;
  toggleAlignment: (alignment: AlignmentType) => void;
  getCurrentAlignment: () => AlignmentType | null;
  hasAlignment: (alignment: AlignmentType) => boolean;
  addButton: (label: string, url: string) => void;
};

const decorator = new CompositeDecorator([LinkDecorator, ImageDecorator]);

export const useEditor = (html?: string): EditorApi => {
  const [state, setState] = useState(() =>
    html
      ? EditorState.createWithContent(HTMLtoState(html), decorator)
      : EditorState.createEmpty(decorator)
  );

  const toggleBlockType = useCallback((blockType: BlockType) => {
    if (blockType === BlockType.divider) {
      setState((currentState) => {
        const contentState = currentState.getCurrentContent();
        const selection = currentState.getSelection();

        const contentStateAfterSplit = Modifier.splitBlock(
          contentState,
          selection
        );

        const contentStateWithDivider = Modifier.setBlockType(
          contentStateAfterSplit,
          contentStateAfterSplit.getSelectionAfter(),
          BlockType.divider
        );

        const contentStateWithNewBlock = Modifier.splitBlock(
          contentStateWithDivider,
          contentStateWithDivider.getSelectionAfter()
        );

        const finalContentState = Modifier.setBlockType(
          contentStateWithNewBlock,
          contentStateWithNewBlock.getSelectionAfter(),
          BlockType.default
        );

        const newSelection = finalContentState.getSelectionAfter().merge({
          hasFocus: true,
        }) as SelectionState;

        const newEditorState = EditorState.push(
          currentState,
          finalContentState,
          "split-block"
        );

        return EditorState.forceSelection(newEditorState, newSelection);
      });
    } else
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

  const removeAllColorStyles = useCallback(
    (editorState: EditorState): EditorState => {
      const currentStyles = editorState.getCurrentInlineStyle();

      let newEditorState = editorState;

      currentStyles.forEach((style) => {
        if (style?.startsWith("COLOR_"))
          newEditorState = RichUtils.toggleInlineStyle(newEditorState, style);
      });

      return newEditorState;
    },
    []
  );

  const applyColor = useCallback(
    (color: InlineStyle) => {
      let newState = removeAllColorStyles(state);

      newState = RichUtils.toggleInlineStyle(newState, color);

      setState(newState);
    },
    [state, removeAllColorStyles]
  );

  const getCurrentColor = useCallback((): InlineStyle | null => {
    const currentStyles = state.getCurrentInlineStyle();

    for (const colorKey of Object.keys(COLOR_OPTIONS)) {
      if (currentStyles.has(colorKey)) return colorKey as InlineStyle;
    }

    return null;
  }, [state]);

  const removeColor = useCallback(() => {
    const newState = removeAllColorStyles(state);
    setState(newState);
  }, [state, removeAllColorStyles]);

  const toggleAlignment = useCallback((alignment: AlignmentType) => {
    setState((currentState) => {
      const selection = currentState.getSelection();
      const contentState = currentState.getCurrentContent();

      const startKey = selection.getStartKey();
      const endKey = selection.getEndKey();
      const blockMap = contentState.getBlockMap();

      let newContentState = contentState;

      blockMap
        .skipUntil((_, k) => k === startKey)
        .takeUntil((_, k) => k === endKey)
        .concat([[endKey, blockMap.get(endKey)]])
        .forEach((block, blockKey) => {
          if (block) {
            const currentData = block.getData();
            const currentAlignment = currentData.get("textAlign");

            const newAlignment =
              currentAlignment === alignment ? null : alignment;

            const newData = newAlignment
              ? currentData.set("textAlign", newAlignment)
              : currentData.remove("textAlign");

            const blockSelection = SelectionState.createEmpty(
              blockKey as string
            ).merge({
              anchorOffset: 0,
              focusOffset: block.getLength(),
            });

            newContentState = Modifier.setBlockData(
              newContentState,
              blockSelection,
              newData
            );
          }
        });

      const newEditorState = EditorState.push(
        currentState,
        newContentState,
        "change-block-data"
      );

      return EditorState.acceptSelection(newEditorState, selection);
    });
  }, []);

  const getCurrentAlignment = useCallback((): AlignmentType | null => {
    const selection = state.getSelection();
    const contentState = state.getCurrentContent();
    const block = contentState.getBlockForKey(selection.getStartKey());

    return block.getData().get("textAlign") as AlignmentType | null;
  }, [state]);

  const hasAlignment = useCallback(
    (alignment: AlignmentType) => {
      const currentAlignment = getCurrentAlignment();
      return currentAlignment === alignment;
    },
    [getCurrentAlignment]
  );

  const addButton = useCallback((label: string, url: string) => {
    setState((currentState) => {
      const contentState = currentState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        EntityType.button,
        "IMMUTABLE",
        { label, url }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      const newState = EditorState.set(currentState, {
        currentContent: contentStateWithEntity,
      });

      return AtomicBlockUtils.insertAtomicBlock(newState, entityKey, " ");
    });
  }, []);

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
      applyColor,
      getCurrentColor,
      removeColor,
      toggleAlignment,
      getCurrentAlignment,
      hasAlignment,
      addButton,
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
      applyColor,
      getCurrentColor,
      removeColor,
      toggleAlignment,
      getCurrentAlignment,
      hasAlignment,
      addButton,
    ]
  );
};
