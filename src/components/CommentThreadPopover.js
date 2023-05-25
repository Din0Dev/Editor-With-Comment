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
import { v4 as uuidv4 } from "uuid";

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
import useRemoveAllCommentThreadCallback from "../hooks/useRemoveAllCommentThreadCallback";

export default function CommentThreadPopover({
  editorOffsets,
  selection,
  threadID,
}) {
  const editor = useEditor();

  const [allComments, setAllComments] = useContext(AllCommentContext);

  const [idCommentSelection, setIDCommentSelection] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const textNode = getFirstTextNodeAtSelection(editor, selection);
  const setActiveCommentThreadID = useSetRecoilState(activeCommentThreadIDAtom);
  const [threadDataLoadable, setCommentThreadData] = useRecoilStateLoadable(
    commentThreadsState(threadID)
  );
  const threadData = threadDataLoadable.contents;

  const removeAllCommentThreadData =
    useRemoveAllCommentThreadCallback(threadID);

  //! Function
  const selectNode = useCallback(() => {
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
  }, [editor, threadID]);

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
    [editor, setActiveCommentThreadID, threadData, selectNode, threadID]
  );

  const onAddNewComment = useCallback(() => {
    // Create ID for comment
    const idComment = uuidv4();
    const commentNew = {
      id: idComment,
      text: commentText,
      author: "Shalabh",
      creationTime: new Date(),
    };
    // Set comment To Recoil for Local
    setCommentThreadData((threadData) => ({
      ...threadData,
      comments: [...threadData.comments, commentNew],
    }));
    // Set comment to send API
    setAllComments((prev) => {
      const itemSelected = prev.find((item) => item.id === threadID);
      if (itemSelected) {
        const filterPrev = prev.filter((item) => item.id !== threadID);
        itemSelected.comments.push(commentNew);
        itemSelected.creationTime = new Date();
        const result = [...filterPrev, itemSelected];
        return result;
      } else {
        return [
          ...allComments,
          {
            id: threadID,
            ...threadData,
            comments: [
              ...threadData.comments,
              {
                id: idComment,
                text: commentText,
                author: "Shalabh",
                creationTime: new Date(),
              },
            ],
          },
        ];
      }
    });
    setCommentText("");
  }, [
    commentText,
    setCommentThreadData,
    threadData,
    allComments,
    setAllComments,
    threadID,
  ]);

  const onEdit = useCallback(
    (comment) => {
      setIsEdit(!isEdit);
      setIDCommentSelection(comment.id);
      setCommentText(comment.text);
    },
    [isEdit]
  );

  const onEditComment = useCallback(
    (comment) => {
      setIsEdit(!isEdit);
      // Set Comment to Recoil for Local
      const commentEdited = {
        id: idCommentSelection,
        text: commentText,
        author: "Shalabh",
        creationTime: new Date(),
      };

      setCommentThreadData((threadData) => {
        const filterThreadData = threadData.comments.filter(
          (item) => item.id !== idCommentSelection
        );

        return {
          ...threadData,
          comments: [...filterThreadData, commentEdited],
        };
      });
      // Set Comment to Send Api
      setAllComments((prev) => {
        const itemSelected = prev.find((item) => item.id === threadID);
        // Find comment with ID selection then replace
        const filterComments = itemSelected.comments.filter(
          (comment) => comment.id !== idCommentSelection
        );
        itemSelected.comments = [...filterComments, commentEdited];
        itemSelected.creationTime = new Date();
        const filterPrev = prev.filter((item) => item.id !== threadID);
        const result = [...filterPrev, itemSelected];
        return result;
      });
      setCommentText("");
      setIsEdit(!isEdit);
      setIDCommentSelection(null);
      return;
    },
    [
      commentText,
      setCommentThreadData,
      isEdit,
      idCommentSelection,
      threadID,
      setAllComments,
    ]
  );

  // Delete All Comment
  const onDeleteAll = () => {
    removeAllCommentThreadData();
    selectNode();
    removeCommentThread(editor, threadID);
    // Turn Off Popover
    setActiveCommentThreadID(null);
  };
  // Delete Comment with Select
  const onDeleteComment = useCallback(
    (comment) => {
      selectNode();
      // Delete comment to Recoil For Local
      setCommentThreadData((threadData) => {
        const filterThreadData = threadData.comments.filter(
          (item) => item.id !== comment.id
        );
        return {
          ...threadData,
          comments: [...filterThreadData],
        };
      });
      // Delete comment to SendAPI
      setAllComments((prev) => {
        const itemSelected = prev.find((item) => item.id === threadID);
        // Find comment with ID selection then replace
        const filterComments = itemSelected.comments.filter(
          (item) => item.id !== comment.id
        );
        itemSelected.comments = [...filterComments];
        const filterPrev = prev.filter((item) => item.id !== threadID);
        const result = [...filterPrev, itemSelected];
        return result;
      });
      return;
    },
    [threadID, selectNode, setAllComments, setCommentThreadData]
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
          onToggleStatus={onDeleteAll}
          threadData={threadData}
        />
      }
      onClickOutside={onClickOutside}
    >
      <>
        <div className={"comment-list"}>
          {threadData.comments.map((comment, index) => (
            <CommentRow
              onlyOneComment={threadData.comments.length === 1}
              key={index}
              indexComment={index}
              comment={comment}
              onToggleEditComment={() => onEdit(comment)}
              onToggleDeleteComment={() => onDeleteComment(comment)}
            />
          ))}
        </div>
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
            onClick={isEdit ? onEditComment : onAddNewComment}
          >
            {isEdit ? "Edit" : "Comment"}
          </Button>
        </div>
      </>
    </NodePopover>
  );
}

function Header({ onToggleStatus, status, threadData }) {
  return (
    <div className={"comment-thread-popover-header"}>
      {!status ? (
        <>
          <Button size="sm" variant="danger" onClick={onToggleStatus}>
            {threadData.comments.length === 1 ? "Delete" : "Delete All"}
          </Button>
        </>
      ) : (
        "Comment"
      )}
    </div>
  );
}
