import "./Toolbar.css";

import { useCallback, useContext } from "react";
import { useSetRecoilState } from "recoil";
import { useEditor } from "slate-react";

import Button from "react-bootstrap/Button";

import { activeCommentThreadIDAtom } from "../utils/CommentState";
import {
  getActiveStyles,
  hasActiveLinkAtSelection,
  toggleLinkAtSelection,
  toggleStyle,
} from "../utils/EditorUtils";
import {
  insertCommentThread,
  shouldAllowNewCommentThreadAtSelection,
} from "../utils/EditorCommentUtils";

import useAddCommentThreadCallback from "../hooks/useAddCommentThreadCallback";
import CommentSidebarContext from "../context/CommentSideBarProvider";

const CHARACTER_STYLES = ["bold", "italic", "underline"];

export default function Toolbar({ selection, previousSelection }) {
  const editor = useEditor();
  const [isOpenSideBar, setIsOpenSideBar] = useContext(CommentSidebarContext);
  const setActiveCommentThreadID = useSetRecoilState(activeCommentThreadIDAtom);
  const addCommentThread = useAddCommentThreadCallback();

  //! Function
  const onInsertComment = useCallback(() => {
    const newCommentThreadID = insertCommentThread(editor, addCommentThread);
    setActiveCommentThreadID(newCommentThreadID);
  }, [editor, addCommentThread, setActiveCommentThreadID]);

  const onToggleComment = () => {
    setIsOpenSideBar(!isOpenSideBar);
  };

  const onInsertEdit = () => {
    toggleLinkAtSelection(editor);
  };
  
  //! Render
  return (
    <div className="toolbar">
      {/* Buttons for character styles */}
      {CHARACTER_STYLES.map((style) => (
        <ToolBarStyleButton
          key={style}
          style={style}
          icon={<i className={`bi ${getIconForButton(style)}`} />}
        />
      ))}
      {/* Edit Button */}
      <ToolBarButton
        isActive={hasActiveLinkAtSelection(editor)}
        disabled={!!hasActiveLinkAtSelection(editor)}
        label={<i className={`bi ${getIconForButton("link")}`} />}
        onMouseDown={onInsertEdit}
      />
      {/* Comment Button */}
      <ToolBarButton
        isActive={false}
        disabled={!shouldAllowNewCommentThreadAtSelection(editor, selection)}
        label={<i className={`bi ${getIconForButton("comment")}`} />}
        onMouseDown={onInsertComment}
      />
      {/* Toggle Comment Button */}
      <ToolBarButton
        isActive={false}
        label={<i className={`bi ${getIconForButton("toggle-comment")}`} />}
        onMouseDown={onToggleComment}
      />
    </div>
  );
}

function ToolBarStyleButton({ as, style, icon }) {
  const editor = useEditor();
  return (
    <ToolBarButton
      as={as}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleStyle(editor, style);
      }}
      isActive={getActiveStyles(editor).has(style)}
      label={icon}
    />
  );
}

function ToolBarButton(props) {
  const { label, isActive, ...otherProps } = props;
  return (
    <Button
      variant="outline-primary"
      className="toolbar-btn"
      active={isActive}
      {...otherProps}
    >
      {label}
    </Button>
  );
}

function getIconForButton(style) {
  switch (style) {
    case "bold":
      return "bi-type-bold";
    case "italic":
      return "bi-type-italic";
    case "underline":
      return "bi-type-underline";
    case "link":
      return "bi-pen";
    case "comment":
      return "bi-chat-left-text";
    case "toggle-comment":
      return "bi-chat-left";
    default:
      throw new Error(`Unhandled style in getIconForButton: ${style}`);
  }
}
