import { ContentBlock, ContentState } from "draft-js";
import { EntityType } from "./config";
import ImageBlock from "./image-block";

export const blockRenderer = (
  contentBlock: ContentBlock,
  { getContentState }: { getContentState: () => ContentState }
) => {
  const type = contentBlock.getType();

  if (type === "atomic") {
    const entityKey = contentBlock.getEntityAt(0);
    if (entityKey) {
      const contentState = getContentState();
      const entity = contentState.getEntity(entityKey);

      if (entity.getType() === EntityType.img)
        return {
          component: ImageBlock,
          editable: false,
          props: {
            contentState: contentState,
          },
        };
    }
  }

  return null;
};
