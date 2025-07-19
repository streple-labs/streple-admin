import { ContentBlock, ContentState } from "draft-js";

interface ButtonBlockProps {
  contentState: ContentState;
  block: ContentBlock;
}

const ButtonBlock: React.FC<ButtonBlockProps> = ({ contentState, block }) => {
  const entityKey = block.getEntityAt(0);
  const entity = contentState.getEntity(entityKey);
  const { label, url } = entity.getData();

  const handleClick = () => {
    if (url) window.open(url, "_blank");
  };

  return (
    <div contentEditable={false}>
      <button onClick={handleClick}>{label || "Button"}</button>
    </div>
  );
};

export default ButtonBlock;
