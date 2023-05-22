import { DefaultElement } from "slate-react";
import Link from "../components/Link";
import LinkEditor from "../components/LinkEditor";
import React from "react";
import StyledText from "../components/StyledText";
import isHotkey from "is-hotkey";
import { toggleStyle } from "../utils/EditorUtils";

export default function useEditorConfig(editor) {
  editor.isInline = (element) => ["link"].includes(element.type);

  return { renderElement, renderLeaf, KeyBindings };
}

function renderElement(props) {
  const { element } = props;
  switch (element.type) {
    case "link":
      return <Link {...props} url={element.url} />;
    case "link-editor":
      return <LinkEditor {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}

function renderLeaf(props) {
  return <StyledText {...props} />;
}

const KeyBindings = {
  onKeyDown: (editor, event) => {
    if (isHotkey("mod+b", event)) {
      toggleStyle(editor, "bold");
      return;
    }
    if (isHotkey("mod+i", event)) {
      toggleStyle(editor, "italic");
      return;
    }
    if (isHotkey("mod+k", event)) {
      toggleStyle(editor, "code");
      return;
    }
    if (isHotkey("mod+u", event)) {
      toggleStyle(editor, "underline");
      return;
    }
  },
};
