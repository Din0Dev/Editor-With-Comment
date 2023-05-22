import "./App.css";

import React, { useEffect, useState } from "react";
import { RecoilRoot, useRecoilSnapshot } from "recoil";

import Navbar from "react-bootstrap/Navbar";

import Editor from "./components/Editor";

import { CommentSideBarProvider } from "./context/CommentSideBarProvider";
import { AllCommentProvider } from "./context/AllCommentProvider";
import { IDsLocalProvider } from "./context/IDsLocalProvider";
import { ExampleDocument } from "./utils/ExampleDocument";
import { SelectionForLinkProvider } from "./context/SelectionForLinkProvider";

function App() {
  const [document, updateDocument] = useState(ExampleDocument);

  return (
    <SelectionForLinkProvider>
      <IDsLocalProvider>
        <AllCommentProvider>
          <CommentSideBarProvider>
            <Navbar bg="dark" variant="dark">
              <Navbar.Brand href="#">Izone Editor</Navbar.Brand>
            </Navbar>
            <div className="App">
              <RecoilRoot>
                <Editor document={document} onChange={updateDocument} />
                <DebugObserver />
              </RecoilRoot>
            </div>
          </CommentSideBarProvider>
        </AllCommentProvider>
      </IDsLocalProvider>
    </SelectionForLinkProvider>
  );
}

function DebugObserver() {
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    console.debug("The following atoms were modified:");
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}

export default App;
