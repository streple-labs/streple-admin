import { convertFromHTML, convertToHTML } from "draft-convert";
import {
  AlignmentType,
  BlockType,
  COLOR_OPTIONS,
  EntityType,
  InlineStyle,
} from "./config";

export const stateToHTML = convertToHTML<InlineStyle | "a", BlockType>({
  styleToHTML: (style) => {
    switch (style) {
      case InlineStyle.BOLD:
        return <strong />;
      case InlineStyle.ITALIC:
        return <em />;
      case InlineStyle.UNDERLINE:
        return (
          <span className="underline" style={{ textDecoration: "underline" }} />
        );
      default:
        if (style.startsWith("COLOR_")) {
          const colorValue = COLOR_OPTIONS[style as keyof typeof COLOR_OPTIONS];
          if (colorValue) return <span style={{ color: colorValue }} />;
        }
        return null;
    }
  },
  blockToHTML: (block) => {
    const alignment = block.data?.textAlign as AlignmentType;
    const alignmentStyle = alignment
      ? { textAlign: getAlignmentValue(alignment) }
      : {};

    switch (block.type) {
      case BlockType.cite:
        return <cite style={alignmentStyle as React.CSSProperties} />;
      case BlockType.h1:
        return <h1 style={alignmentStyle as React.CSSProperties} />;
      case BlockType.h2:
        return <h2 style={alignmentStyle as React.CSSProperties} />;
      case BlockType.h3:
        return <h3 style={alignmentStyle as React.CSSProperties} />;
      case BlockType.h4:
        return <h4 style={alignmentStyle as React.CSSProperties} />;
      case BlockType.h5:
        return <h5 style={alignmentStyle as React.CSSProperties} />;
      case BlockType.h6:
        return <h6 style={alignmentStyle as React.CSSProperties} />;
      case BlockType.orderList:
        return {
          element: <li style={alignmentStyle as React.CSSProperties} />,
          nest: <ol />,
        };
      case BlockType.list:
        return {
          element: <li style={alignmentStyle as React.CSSProperties} />,
          nest: <ul />,
        };
      case BlockType.blockquote:
        return <blockquote style={alignmentStyle as React.CSSProperties} />;
      case BlockType.default:
        return <p style={alignmentStyle as React.CSSProperties} />;
      case BlockType.divider:
        return <hr />;
      default:
        return null;
    }
  },
  entityToHTML: (entity, originalText) => {
    if (entity.type === EntityType.link)
      return <a href={entity.data.url}>{originalText}</a>;

    if (entity.type === EntityType.img)
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entity.data.img}
          alt="image"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      );

    return originalText;
  },
});

export const HTMLtoState = convertFromHTML<DOMStringMap, BlockType>({
  htmlToStyle: (nodeName, node, currentStyle) => {
    if (nodeName === "strong") return currentStyle.add(InlineStyle.BOLD);

    if (nodeName === "em") return currentStyle.add(InlineStyle.ITALIC);

    if (nodeName === "span" && node.classList.contains("underline"))
      return currentStyle.add(InlineStyle.UNDERLINE);

    if (nodeName === "h1") return currentStyle.add(BlockType.h1);

    if (nodeName === "h2") return currentStyle.add(BlockType.h2);

    if (nodeName === "h3") return currentStyle.add(BlockType.h3);

    return currentStyle;
  },

  // @ts-expect-error //some versions of draft-convert have this parameter
  htmlToBlock(nodeName, node, last) {
    const blockType = (() => {
      switch (nodeName) {
        case "h1":
          return BlockType.h1;
        case "h2":
          return BlockType.h2;
        case "h3":
          return BlockType.h3;
        case "h4":
          return BlockType.h4;
        case "h5":
          return BlockType.h5;
        case "h6":
          return BlockType.h6;
        case "li":
          if (last === "ol") return BlockType.orderList;
          return BlockType.list;
        case "blockquote":
          return BlockType.blockquote;
        case "cite":
          return BlockType.cite;
        case "div":
        case "p":
          return BlockType.default;
        case "hr":
          return BlockType.divider;
        default:
          return null;
      }
    })();

    if (blockType && node.style && node.style.textAlign) {
      const alignment = getAlignmentEnum(node.style.textAlign);
      if (alignment) {
        return {
          type: blockType,
          data: { textAlign: alignment },
        };
      }
    }

    return blockType;
  },
  htmlToEntity: (nodeName, node, createEntity) => {
    if (nodeName === "a" && node.href)
      return createEntity(EntityType.link, "MUTABLE", { url: node.href });
    if (nodeName === "img" && node.src)
      return createEntity(EntityType.img, "MUTABLE", { img: node.src });

    return undefined;
  },
});

function getAlignmentValue(alignment: AlignmentType): string {
  switch (alignment) {
    case AlignmentType.CENTER:
      return "center";
    case AlignmentType.RIGHT:
      return "right";
    case AlignmentType.JUSTIFY:
      return "justify";
    case AlignmentType.LEFT:
    default:
      return "left";
  }
}

function getAlignmentEnum(textAlign: string): AlignmentType | null {
  switch (textAlign) {
    case "center":
      return AlignmentType.CENTER;
    case "right":
      return AlignmentType.RIGHT;
    case "justify":
      return AlignmentType.JUSTIFY;
    case "left":
      return AlignmentType.LEFT;
    default:
      return null;
  }
}
