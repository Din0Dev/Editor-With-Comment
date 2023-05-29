import "./Editor.css";

import React, {
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor } from "slate";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useRecoilValue } from "recoil";

import CommentThreadPopover from "./CommentThreadPopover";
import CommentsSidebar from "./CommentsSidebar";
import LinkEditor from "./LinkEditor";
import Toolbar from "./Toolbar";
import { activeCommentThreadIDAtom } from "../utils/CommentState";
import {
  identifyLinksInTextIfAny,
  isLinkNodeAtSelection,
} from "../utils/EditorUtils";
import {
  findAllIDWithCommentThread,
  initializeStateWithAllCommentThreads,
} from "../utils/EditorCommentUtils";

import useAddCommentThreadCallback from "../hooks/useAddCommentThreadCallback";
import useEditorConfig from "../hooks/useEditorConfig";
import useSelection from "../hooks/useSelection";

import CommentSidebarContext from "../context/CommentSideBarProvider";
import AllCommentContext from "../context/AllCommentProvider";
import IDsLocalContext from "../context/IDsLocalProvider";
import { mockDataCommentFromApi } from "../utils/ExampleDocument";

export default function Editor({ document, onChange }) {
  const [isOpenSideBar] = useContext(CommentSidebarContext);
  const [allComments, setAllComments] = useContext(AllCommentContext);
  const [allIDs, setAllIds] = useContext(IDsLocalContext);
  const [isOpenEditText, setIsOpenEditText] = useState(false);

  const editorRef = useRef(null);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const { renderLeaf, renderElement, KeyBindings } = useEditorConfig(editor);

  const [previousSelection, selection, setSelection] = useSelection(editor);
  const activeCommentThreadID = useRecoilValue(activeCommentThreadIDAtom);
  const addCommentThread = useAddCommentThreadCallback();

  let selectionForLink = null;
  if (isLinkNodeAtSelection(editor, selection)) {
    selectionForLink = selection;
  } else if (
    selection == null &&
    isLinkNodeAtSelection(editor, previousSelection)
  ) {
    selectionForLink = previousSelection;
  }

  const editorOffsets =
    editorRef.current != null
      ? {
          x: editorRef.current.getBoundingClientRect().x,
          y: editorRef.current.getBoundingClientRect().y,
        }
      : null;

  //! Function
  const onKeyDown = useCallback(
    (event) => KeyBindings.onKeyDown(editor, event),
    [KeyBindings, editor]
  );

  // we update selection here because Slate fires an onChange even on pure selection change.
  const onChangeLocal = useCallback(
    (doc) => {
      onChange(doc);
      setSelection(editor.selection);
      // identifyLinksInTextIfAny(editor);
    },
    [onChange, setSelection, editor]
  );

  //! Function

  //! Call API
  useEffect(() => {
    setAllIds(findAllIDWithCommentThread(document));
  }, [document]);

  useEffect(() => {
    setAllComments(...allComments, mockDataCommentFromApi);
  }, [editor]);

  //! Send to API
  // Lấy tất cả ID từ local và filter mảng
  const commentToSendAPI =
    allComments &&
    allComments?.filter((item) => allIDs.map((item) => item).includes(item.id));
  console.log("Send:", document, commentToSendAPI);

  //! Effect
  useEffect(() => {
    initializeStateWithAllCommentThreads(
      editor,
      addCommentThread,
      mockDataCommentFromApi
    );
  }, [editor, addCommentThread]);

  useEffect(() => {
    if (selectionForLink != null) {
      setIsOpenEditText(true);
    }
  }, [selectionForLink]);

  //! Render
  return (
    <Slate editor={editor} value={document} onChange={onChangeLocal}>
      <div className={"editor-wrapper"} fluid={"true"}>
        <Container className={"editor-container"}>
          <Row>
            <Col>
              <Toolbar
                selection={selection}
                previousSelection={previousSelection}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="editor" ref={editorRef}>
                {selectionForLink != null && isOpenEditText ? (
                  <LinkEditor
                    editorOffsets={editorOffsets}
                    selectionForLink={selectionForLink}
                    setIsOpenEditText={setIsOpenEditText}
                  />
                ) : null}
                {activeCommentThreadID != null ? (
                  <CommentThreadPopover
                    editorOffsets={editorOffsets}
                    threadID={activeCommentThreadID}
                    selection={selection ?? previousSelection}
                  />
                ) : null}
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  onKeyDown={onKeyDown}
                />
              </div>
            </Col>
          </Row>
        </Container>
        {isOpenSideBar && (
          <div className={"sidebar-wrapper"}>
            <CommentsSidebar document={document} />
          </div>
        )}
      </div>
    </Slate>
  );
}
