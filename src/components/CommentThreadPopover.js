import "./CommentThreadPopover.css";

import { ReactEditor, useEditor } from "slate-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRecoilStateLoadable, useSetRecoilState } from "recoil";
import Button from "react-bootstrap/Button";
import CommentRow from "./CommentRow";
import Form from "react-bootstrap/Form";
import NodePopover from "./NodePopover";
import { isEmpty } from "lodash";
import { Editor, Path, Text, Transforms } from "slate";

import {
  activeCommentThreadIDAtom,
  commentThreadsState,
} from "../utils/CommentState";
import {
  getCommentThreadsOnTextNode,
  removeCommentThread,
} from "../utils/EditorCommentUtils";
import { getFirstTextNodeAtSelection } from "../utils/EditorUtils";
import AllCommentContext from "../context/AllCommentProvider";
import useRemoveCommentThreadCallback from "../hooks/useRemoveCommentThreadCallback";

export default function CommentThreadPopover({
  editorOffsets,
  selection,
  threadID,
}) {
  const editor = useEditor();

  const [allComments, setAllComments] = useContext(AllCommentContext);
  const [commentText, setCommentText] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const textNode = getFirstTextNodeAtSelection(editor, selection);
  const setActiveCommentThreadID = useSetRecoilState(activeCommentThreadIDAtom);
  const [threadDataLoadable, setCommentThreadData] = useRecoilStateLoadable(
    commentThreadsState(threadID)
  );
  const threadData = threadDataLoadable.contents;
  const removeCommentThreadData = useRemoveCommentThreadCallback(threadID);
  const selectNode = () => {
    const textNodesWithThread = Editor.nodes(editor, {
      at: [],
      mode: "lowest",
      match: (n) =>
        Text.isText(n) && getCommentThreadsOnTextNode(n).has(threadID),
    });

    let textNodeEntry = textNodesWithThread.next().value;
    const allTextNodePaths = [];
    while (textNodeEntry != null) {
      allTextNodePaths.push(textNodeEntry[1]);
      textNodeEntry = textNodesWithThread.next().value;
    }
    allTextNodePaths.sort((p1, p2) => Path.compare(p1, p2));

    Transforms.select(editor, {
      anchor: Editor.point(editor, allTextNodePaths[0], { edge: "start" }),
      focus: Editor.point(
        editor,
        allTextNodePaths[allTextNodePaths.length - 1],
        {
          edge: "end",
        }
      ),
    });
    return;
  };

  //! Function
  const onClick = useCallback(() => {
    if (isEdit) {
      setCommentThreadData((threadData) => ({
        comments: [
          { text: commentText, author: "Shalabh", creationTime: new Date() },
        ],
      }));

      setAllComments((prev) => {
        const itemSelected = prev.find((item) => item.id === threadID);
        const filterPrev = prev.filter((item) => item.id !== threadID);

        itemSelected.comments = [
          { text: commentText, author: "Shalabh", creationTime: new Date() },
        ];
        itemSelected.creationTime = new Date();
        const result = [...filterPrev, itemSelected];
        return result;
      });
      setCommentText("");
      setIsEdit(!isEdit);
      return;
    }
    setCommentThreadData((threadData) => ({
      ...threadData,
      comments: [
        ...threadData.comments,
        { text: commentText, author: "Shalabh", creationTime: new Date() },
      ],
    }));
    setAllComments([
      ...allComments,
      {
        id: threadID,
        ...threadData,
        comments: [
          ...threadData.comments,
          { text: commentText, author: "Shalabh", creationTime: new Date() },
        ],
      },
    ]);
    setCommentText("");
  }, [commentText, setCommentThreadData, threadData]);

  const onDelete = useCallback(() => {
    selectNode();
    // Remove Data
    removeCommentThreadData();
    // Turn Off Popover
    setActiveCommentThreadID(null);
    removeCommentThread(editor, threadID);
    setAllComments((prev) => {
      const filterPrev = prev.filter((item) => item.id !== threadID);
      const result = [...filterPrev];
      return result;
    });
  }, [editor, threadID]);

  const onEdit = useCallback(() => {
    setIsEdit(!isEdit);
  }, []);

  const onCommentTextChange = useCallback(
    (event) => setCommentText(event.target.value),
    [setCommentText]
  );

  const onClickOutside = useCallback(
    (event) => {
      const slateDOMNode = event.target.hasAttribute("data-slate-node")
        ? event.target
        : event.target.closest(`[data-slate-node]`);

      // The click event was somewhere outside the Slate hierarchy
      if (slateDOMNode == null) {
        setActiveCommentThreadID(null);
        return;
      }

      const slateNode = ReactEditor.toSlateNode(editor, slateDOMNode);
      // Click is on another commented text node => do nothing.
      if (
        Text.isText(slateNode) &&
        getCommentThreadsOnTextNode(slateNode).size > 0
      ) {
        return;
      }

      setActiveCommentThreadID(null);
      // Delete mark when no comment
      if (isEmpty(threadData.comments)) {
        // Remove Comment Thread
        selectNode();
        removeCommentThread(editor, threadID);
      } else {
        Transforms.deselect(editor);
      }
    },
    [editor, setActiveCommentThreadID, threadData]
  );

  //! Effect
  // Change Another Popover when editing [Clear field]
  useEffect(() => {
    setIsEdit(false);
    setCommentText("");
  }, [threadID]);

  useEffect(() => {
    return () => {
      setActiveCommentThreadID(null);
    };
  }, [setActiveCommentThreadID]);

  //! Render
  return (
    <NodePopover
      editorOffsets={editorOffsets}
      isBodyFullWidth={true}
      node={textNode}
      className={"comment-thread-popover"}
      header={
        <Header
          status={isEmpty(threadData.comments)}
          onToggleStatus={onDelete}
          onToggleEdit={onEdit}
        />
      }
      onClickOutside={onClickOutside}
    >
      <>
        <div className={"comment-list"}>
          {threadData.comments.map((comment, index) => (
            <CommentRow key={index} comment={comment} />
          ))}
        </div>
        {(isEmpty(threadData.comments) || isEdit) && (
          <div className={"comment-input-wrapper"}>
            <Form.Control
              bsPrefix={"comment-input form-control"}
              placeholder={"Type a comment"}
              type="text"
              value={commentText}
              onChange={onCommentTextChange}
            />
            <Button
              size="sm"
              variant="primary"
              disabled={commentText.length === 0}
              onClick={onClick}
            >
              {isEdit ? "Edit" : "Comment"}
            </Button>
          </div>
        )}
      </>
    </NodePopover>
  );
}

function Header({ onToggleStatus, onToggleEdit, status }) {
  return (
    <div className={"comment-thread-popover-header"}>
      {!status ? (
        <>
          <Button size="sm" variant="primary" onClick={onToggleEdit}>
            Edit
          </Button>

          <Button size="sm" variant="danger" onClick={onToggleStatus}>
            Delete
          </Button>
        </>
      ) : (
        "Comment"
      )}
    </div>
  );
}
