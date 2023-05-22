import "./CommentSidebar.css";

import { useCallback, useContext } from "react";
import classNames from "classnames";
import { useRecoilState, useRecoilValue } from "recoil";
import { Editor, Path, Text, Transforms } from "slate";
import { useEditor } from "slate-react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import CommentRow from "./CommentRow";
import {
  activeCommentThreadIDAtom,
  commentThreadIDsState,
  commentThreadsState,
} from "../utils/CommentState";
import {
  getCommentThreadsOnTextNode,
} from "../utils/EditorCommentUtils";
import IDsLocalContext from "../context/IDsLocalProvider";

export default function CommentsSidebar() {
  const allCommentThreadIDs = useRecoilValue(commentThreadIDsState);

  //! Render
  return (
    <Card className={"comments-sidebar"}>
      <Card.Header>Comments</Card.Header>
      <Card.Body>
        {allCommentThreadIDs &&
          Array.from(allCommentThreadIDs).map((id, index, ids) => (
            <Row key={id}>
              <Col>
                <CommentThread id={id} />
              </Col>
            </Row>
          ))}
      </Card.Body>
    </Card>
  );
}

function CommentThread({ id }) {
  const editor = useEditor();

  const [allIDs] = useContext(IDsLocalContext)

  const [activeCommentThreadID, setActiveCommentThreadID] = useRecoilState(
    activeCommentThreadIDAtom
  );
  const { comments, status } = useRecoilValue(commentThreadsState(id));

  //! Function
  const onClick = useCallback(() => {
    const textNodesWithThread = Editor.nodes(editor, {
      at: [],
      mode: "lowest",
      match: (n) => Text.isText(n) && getCommentThreadsOnTextNode(n).has(id),
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
        { edge: "end" }
      ),
    });

    setActiveCommentThreadID(id);
  }, [editor, id, setActiveCommentThreadID]);

  
  
  //! Render
  const [firstComment] = comments;
  const isHaveCommentInData = allIDs.includes(id);
  
  if (comments.length === 0) {
    return null;
  }
  
  return (
    isHaveCommentInData && (
      <Card
        body={true}
        className={classNames({
          "comment-thread-container": true,
          "is-resolved": status === "resolved",
          "is-active": activeCommentThreadID === id,
        })}
        onClick={onClick}
      >
        <CommentRow comment={firstComment} showConnector={false} />
      </Card>
    )
  );
}
