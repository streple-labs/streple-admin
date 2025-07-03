import { ContentBlock, ContentState, DraftDecorator } from "draft-js";
import { EntityType } from "./config";
import { useEditorApi } from "./context";

type LinkProps = {
  children: React.ReactNode;
  contentState: ContentState;
  entityKey: string;
};

const Link: React.FC<LinkProps> = ({ contentState, entityKey, children }) => {
  const { setOpenLinkForm } = useEditorApi();
  const { url, className } = contentState.getEntity(entityKey).getData();

  return (
    <a
      href={url}
      onClick={() => setOpenLinkForm(true)}
      className={className}
      style={{
        textDecoration: "underline",
        color: "#A082F9",
        cursor: "pointer",
      }}
    >
      {children}
    </a>
  );
};

function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
): void {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === EntityType.link
    );
  }, callback);
}

const decorator: DraftDecorator = {
  strategy: findLinkEntities,
  component: (props) => <Link {...props} />,
};

export default decorator;
