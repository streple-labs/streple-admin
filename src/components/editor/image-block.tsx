/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { ContentState } from "draft-js";
import { EntityType } from "./config";

interface ImageBlockProps {
  contentState: ContentState;
  block: any;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ contentState, block }) => {
  const entityKey = block.getEntityAt(0);

  if (!entityKey) return null;

  const entity = contentState.getEntity(entityKey);
  const { img } = entity.getData();

  return (
    <div
      className="image-block"
      style={{ textAlign: "center", margin: "10px 0" }}
    >
      <img
        src={img}
        alt="Uploaded image"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};

export default ImageBlock;

export const ImageDecorator = {
  strategy: (contentBlock: any, callback: any, contentState: ContentState) => {
    contentBlock.findEntityRanges((character: any) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === EntityType.img
      );
    }, callback);
  },
  component: ({
    contentState,
    entityKey,
  }: {
    contentState: ContentState;
    entityKey: string;
  }) => {
    const entity = contentState.getEntity(entityKey);
    const { img } = entity.getData();

    return (
      <img
        src={img}
        alt="Uploaded image"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    );
  },
};
