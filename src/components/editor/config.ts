import { DefaultDraftBlockRenderMap, DraftEditorCommand } from "draft-js";
import Immutable from "immutable";
import { createElement } from "react";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaList,
  FaListOl,
} from "react-icons/fa6";
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
  divider = "divider",
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

export enum AlignmentType {
  LEFT = "ALIGN_LEFT",
  CENTER = "ALIGN_CENTER",
  RIGHT = "ALIGN_RIGHT",
  JUSTIFY = "ALIGN_JUSTIFY",
}

export const InlineStyle_LABELS: Record<
  "BOLD" | "ITALIC" | "UNDERLINE",
  React.ReactNode
> = {
  [InlineStyle.BOLD]: createElement(LuBold),
  [InlineStyle.ITALIC]: createElement(GoItalic),
  [InlineStyle.UNDERLINE]: createElement(RiUnderline),
};

export const Align_LABELS = {
  [AlignmentType.LEFT]: createElement(FaAlignLeft),
  [AlignmentType.CENTER]: createElement(FaAlignCenter),
  [AlignmentType.RIGHT]: createElement(FaAlignRight),
  [AlignmentType.JUSTIFY]: createElement(FaAlignJustify),
};

export const LIST_LABELS = {
  [BlockType.list]: createElement(FaList),
  [BlockType.orderList]: createElement(FaListOl),
};

export const COLOR_OPTIONS = {
  [InlineStyle.COLOR_BLACK]: "#111111",
  [InlineStyle.COLOR_PURPLE]: "#A082F9",
  [InlineStyle.COLOR_BLUE]: "#28175F",
  [InlineStyle.COLOR_YELLOW]: "#F4E90E",
  [InlineStyle.COLOR_GREY]: "#666666",
  [InlineStyle.COLOR_WHITE]: "#FFFFFF",
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

export const ALIGNMENT_STYLES = {
  [AlignmentType.LEFT]: { textAlign: "left" },
  [AlignmentType.CENTER]: { textAlign: "center" },
  [AlignmentType.RIGHT]: { textAlign: "right" },
  [AlignmentType.JUSTIFY]: { textAlign: "justify" },
} as const;
