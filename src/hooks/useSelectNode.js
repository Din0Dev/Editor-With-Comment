import { Editor, Path, Text, Transforms } from "slate";
import { getCommentThreadsOnTextNode } from "../utils/EditorCommentUtils";

const useSelectNode = (editor, threadID) => {
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
  return 
}

export default useSelectNode;