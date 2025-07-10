import { DefaultDraftBlockRenderMap, DraftEditorCommand } from "draft-js";
import Immutable from "immutable";
import { createElement } from "react";
import { GoItalic } from "react-icons/go";
import { LuBold } from "react-icons/lu";
import { RiUnderline } from "react-icons/ri";

export enum EntityType {
  link = "link",
  img = "img",
}

export enum BlockType {
  h1 = "header-one",
  h2 = "header-two",
  h3 = "header-three",
  h4 = "header-four",
  h5 = "header-five",
  h6 = "header-six",
  blockquote = "blockquote",
  code = "code-block",
  list = "unordered-list-item",
  orderList = "ordered-list-item",
  cite = "cite",
  default = "unstyled",
}

export enum InlineStyle {
  BOLD = "BOLD",
  ITALIC = "ITALIC",
  UNDERLINE = "UNDERLINE",
}

export const InlineStyle_LABELS: Record<InlineStyle, React.ReactNode> = {
  [InlineStyle.BOLD]: createElement(LuBold),
  [InlineStyle.ITALIC]: createElement(GoItalic),
  [InlineStyle.UNDERLINE]: createElement(RiUnderline),
};

export const BLOCK_LABELS = {
  [BlockType.h1]: "Heading 1",
  [BlockType.h2]: "Heading 2",
  [BlockType.h3]: "Heading 3",
  [BlockType.h4]: "Heading 4",
  [BlockType.h5]: "Heading 5",
  [BlockType.h6]: "Heading 6",
  [BlockType.blockquote]: "Quote",
  [BlockType.code]: "Code Block",
  [BlockType.list]: "Bulleted List",
  [BlockType.orderList]: "Numbered List",
  [BlockType.cite]: "Citation",
  [BlockType.default]: "Body",
};

export const HEADING_BLOCK_LABELS = {
  [BlockType.h1]: "Heading 1",
  [BlockType.h2]: "Heading 2",
  [BlockType.h3]: "Heading 3",
  [BlockType.default]: "Body",
};

export type KeyCommand = DraftEditorCommand | "accent";

const CUSTOM_BLOCK_RENDER_MAP = Immutable.Map({
  [BlockType.cite]: {
    element: "cite",
  },
});

export const BLOCK_RENDER_MAP = DefaultDraftBlockRenderMap.merge(
  CUSTOM_BLOCK_RENDER_MAP
);

export const CUSTOM_STYLE_MAP = {};
