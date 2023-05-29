import "./LinkEditor.css";

import { useCallback, useEffect, useState } from "react";
import { Editor, Element, Transforms } from "slate";
import { useEditor } from "slate-react";
import { isEmpty } from "lodash";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import NodePopover from "./NodePopover";
import { getFirstTextNodeAtSelection } from "../utils/EditorUtils";

export default function LinkEditor({
  editorOffsets,
  selectionForLink,
  setIsOpenEditText,
}) {
  const editor = useEditor();
  const textNode = getFirstTextNodeAtSelection(editor, selectionForLink);
  const [node, path] = Editor.above(editor, {
    at: selectionForLink,
    match: (n) => n.type === "link",
  });
  const [linkURL, setLinkURL] = useState(node.url);
  const [hasEdit, setHasEdit] = useState(!linkURL);

  //! Function
  const onLinkURLChange = useCallback(
    (event) => setLinkURL(event.target.value),
    [setLinkURL]
  );

  const onApply = useCallback(
    (event) => {
      Transforms.setNodes(editor, { url: linkURL }, { at: path });
      setIsOpenEditText(false)
    },
    [editor, linkURL, path]
  );

  const onDelete = () => {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "link",
    });
  };

  const onClickOutside = () => {
    if (isEmpty(node.url)) {
      onDelete();
    }
  };

  //! Effect
  useEffect(() => {
    setLinkURL(node.url);
  }, [node]);

  //! Render
  return (
    <NodePopover
      editorOffsets={editorOffsets}
      node={node}
      className={"link-editor"}
      header={
        <Header
          onToggleEdit={() => setHasEdit(!hasEdit)}
          onToggleDelete={onDelete}
        />
      }
      onClickOutside={onClickOutside}
    >
      {linkURL && (
        <div className={"link-editor-view"}>
          <span className="link-editor-wrong-text">{textNode.text}</span>
          <span className="link-editor-icon">➙</span>
          <span className="link-editor-edited-text">{linkURL}</span>
        </div>
      )}
      {hasEdit && (
        <>
          <Form.Control
            size="sm"
            type="text"
            value={linkURL}
            onChange={onLinkURLChange}
          />
          <Button
            className={"link-editor-btn"}
            size="sm"
            variant="primary"
            disabled={!linkURL}
            onClick={onApply}
          >
            Apply
          </Button>
        </>
      )}
    </NodePopover>
  );

  function Header({ onToggleEdit, onToggleDelete }) {
    return (
      <div className={"link-editor-header"}>
        {hasEdit ? (
          <span>Edit</span>
        ) : (
          <>
            <Button size="sm" variant="primary" onClick={onToggleEdit}>
              Edit
            </Button>
            <Button size="sm" variant="danger" onClick={onToggleDelete}>
              Delete
            </Button>
          </>
        )}
      </div>
    );
  }
}
