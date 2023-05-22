import "./CommentedText.css";

import { useEditor } from "slate-react";
import { useRecoilState } from "recoil";
import classNames from "classnames";

import { activeCommentThreadIDAtom } from "../utils/CommentState";
import { getSmallestCommentThreadAtTextNode } from "../utils/EditorCommentUtils";

export default function CommentedText(props) {
  const editor = useEditor();

  const { commentThreads, textNode, ...otherProps } = props;

  const [activeCommentThreadID, setActiveCommentThreadID] = useRecoilState(
    activeCommentThreadIDAtom
  );

  //! Function
  const onClick = () => {
    setActiveCommentThreadID(
      getSmallestCommentThreadAtTextNode(editor, textNode)
    );
  };

  return (
    <span
      {...otherProps}
      className={classNames({
        comment: true,
        "is-active": commentThreads.has(activeCommentThreadID),
      })}
      onClick={onClick}
    >
      {props.children}
    </span>
  );
}
