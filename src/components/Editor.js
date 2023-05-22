import "./Editor.css";

import React, {
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
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
import SelectionForLinkContext from "../context/SelectionForLinkProvider";

export default function Editor({ document, onChange }) {
  const [isOpenSideBar] = useContext(CommentSidebarContext);
  const [allComments, setAllComments] = useContext(AllCommentContext);
  const [allIDs, setAllIds] = useContext(IDsLocalContext);
  const [selectionForLink, setSelectionForLink] = useContext(SelectionForLinkContext);

  const editorRef = useRef(null);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const { renderLeaf, renderElement, KeyBindings } = useEditorConfig(editor);

  const [previousSelection, selection, setSelection] = useSelection(editor);
  const activeCommentThreadID = useRecoilValue(activeCommentThreadIDAtom);
  const addCommentThread = useAddCommentThreadCallback();

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
      identifyLinksInTextIfAny(editor);
    },
    [onChange, setSelection, editor, allComments]
  );

  //! Function
  useEffect(() => {
    initializeStateWithAllCommentThreads(
      editor,
      addCommentThread,
      mockDataCommentFromApi
    );
  }, [editor, addCommentThread]);

  //! Call API

  useEffect(() => {
    setAllIds(findAllIDWithCommentThread(document));
  }, [document]);
  useEffect(() => {
    setAllComments(...allComments, mockDataCommentFromApi);
  }, [editor]);

  //! Send to API
  console.log("Send:", document, allComments);

  //! Effect
  useEffect(() => {
    if (isLinkNodeAtSelection(editor, selection)) {
      setSelectionForLink(selection);
    } else if (
      selection == null &&
      isLinkNodeAtSelection(editor, previousSelection)
    ) {
      setSelectionForLink(previousSelection);
    }
  }, [editor, selection]);
  //! Render
  const editorOffsets =
    editorRef.current != null
      ? {
          x: editorRef.current.getBoundingClientRect().x,
          y: editorRef.current.getBoundingClientRect().y,
        }
      : null;

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
                {selectionForLink != null ? (
                  <LinkEditor
                    editorOffsets={editorOffsets}
                    selectionForLink={selectionForLink}
                    setSelectionForLink={setSelectionForLink}
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
