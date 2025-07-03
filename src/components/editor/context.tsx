import { createContext, useContext, useState } from "react";
import { EditorApi, useEditor } from "./useEditor";

const TextEditorContext = createContext<
  | (EditorApi & {
      openLinkForm: boolean;
      setOpenLinkForm: React.Dispatch<React.SetStateAction<boolean>>;
    })
  | undefined
>(undefined);

export const TextEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const editorApi = useEditor();

  const [openLinkForm, setOpenLinkForm] = useState(false);

  return (
    <TextEditorContext.Provider
      value={{ ...editorApi, openLinkForm, setOpenLinkForm }}
    >
      {children}
    </TextEditorContext.Provider>
  );
};

export const useEditorApi = () => {
  const context = useContext(TextEditorContext);
  if (context === undefined) {
    throw new Error("useEditorApi must be used within TextEditorProvider");
  }

  return context;
};
