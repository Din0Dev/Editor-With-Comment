import "./CommentRow.css";

import { format } from "date-fns";
import { useState } from "react";
import { Button } from "react-bootstrap";

import Popover from "./Popover";

export default function CommentRow({
  comment: { author, text, creationTime },
  isShowSideBar,
  onToggleEditComment = () => {},
  onToggleDeleteComment = () => {},
  onlyOneComment,
}) {
  const [showPopover, setShowPopover] = useState(false);
  //! Function
  const onEdit = () => {
    onToggleEditComment();
    setShowPopover(false);
  };

  const onDelete = () => {
    onToggleDeleteComment();
    setShowPopover(false);
  };

  //! Render
  return (
    <div className={"comment-row"}>
      <div className="comment-author-photo">
        <i className="bi bi-person-circle comment-author-photo"></i>
      </div>
      <div>
        <span className="comment-author-name">{author}</span>
        <span className="comment-creation-time">
          {format(creationTime, "eee MM/dd H:mm")}
        </span>
        <div className="comment-text">{text}</div>
      </div>
      {!isShowSideBar && (
        <div
          className={`comment-tooltip bi bi-three-dots-vertical ${
            showPopover ? "is-active-tooltip" : ""
          }`}
          onClick={() => setShowPopover(!showPopover)}
        />
      )}

      {showPopover && (
        <Popover
          className="comment-popover"
          isBodyFullWidth={true}
          onClickOutside={() => setShowPopover(!showPopover)}
        >
          <div className="comment-popover-inner">
            <ActionButton icon="edit" label="Edit" onClick={onEdit} />
            {!onlyOneComment && (
              <ActionButton icon="delete" label="Delete" onClick={onDelete} />
            )}
          </div>
        </Popover>
      )}
    </div>
  );
}

function getIconForButton(style) {
  switch (style) {
    case "edit":
      return "bi-pencil-square";
    case "delete":
      return "bi-trash";
    default:
      throw new Error(`Unhandled style in getIconForButton: ${style}`);
  }
}

function ActionButton(props) {
  const { label, icon, ...otherProps } = props;

  return (
    <Button className="action-button" {...otherProps}>
      <i className={`bi ${getIconForButton(`${icon}`)}`} />
      <span>{label}</span>
    </Button>
  );
}
