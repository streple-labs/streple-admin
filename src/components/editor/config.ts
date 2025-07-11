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
  COLOR_BLACK = "COLOR_BLACK",
  COLOR_PURPLE = "COLOR_PURPLE",
  COLOR_BLUE = "COLOR_BLUE",
  COLOR_YELLOW = "COLOR_YELLOW",
  COLOR_GREY = "COLOR_GREY",
  COLOR_WHITE = "COLOR_WHITE",
}

export const InlineStyle_LABELS: Record<
  "BOLD" | "ITALIC" | "UNDERLINE",
  React.ReactNode
> = {
  [InlineStyle.BOLD]: createElement(LuBold),
  [InlineStyle.ITALIC]: createElement(GoItalic),
  [InlineStyle.UNDERLINE]: createElement(RiUnderline),
};

export const COLOR_OPTIONS = {
  COLOR_BLACK: "#111111",
  COLOR_PURPLE: "#A082F9",
  COLOR_BLUE: "#28175F",
  COLOR_YELLOW: "#F4E90E",
  COLOR_GREY: "#666666",
  COLOR_WHITE: "#FFFFFF",
};

export const CUSTOM_STYLE_MAP = {
  COLOR_BLACK: { color: COLOR_OPTIONS.COLOR_BLACK },
  COLOR_PURPLE: { color: COLOR_OPTIONS.COLOR_PURPLE },
  COLOR_BLUE: { color: COLOR_OPTIONS.COLOR_BLUE },
  COLOR_YELLOW: { color: COLOR_OPTIONS.COLOR_YELLOW },
  COLOR_GREY: { color: COLOR_OPTIONS.COLOR_GREY },
  COLOR_WHITE: { color: COLOR_OPTIONS.COLOR_WHITE },
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
