import { Editor, Element } from "slate";
import { Point, Range, Text, Transforms } from "slate";

import isUrl from "is-url";

export function getActiveStyles(editor) {
  return new Set(Object.keys(Editor.marks(editor) ?? {}));
}

export function toggleStyle(editor, style) {
  const activeStyles = getActiveStyles(editor);
  if (activeStyles.has(style)) {
    Editor.removeMark(editor, style);
  } else {
    Editor.addMark(editor, style, true);
  }
}

export function hasActiveLinkAtSelection(editor) {
  return isLinkNodeAtSelection(editor, editor.selection);
}

export function toggleLinkAtSelection(editor) {
  if(editor.selection == null) {
    return;
  }
  
  if (hasActiveLinkAtSelection(editor)) {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "link",
    });
  } else {
    const isSelectionCollapsed =
      editor.selection == null || Range.isCollapsed(editor.selection);
    if (isSelectionCollapsed) {
      // createLinkForRange(editor, null, "link", "", true /*isInsertion*/);
      return
    } else {
      createLinkForRange(editor, editor.selection, "", "");
    }
  }
}

export function isLinkNodeAtSelection(editor, selection) {
  if (selection == null) {
    return false;
  }

  return (
    Editor.above(editor, {
      at: selection,
      match: (n) => n.type === "link",
    }) != null
    );
}

export function identifyLinksInTextIfAny(editor) {
  // if selection is not collapsed, we do not proceed with the link detection.
  if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
    return;
  }
  
  const [node] = Editor.parent(editor, editor.selection);
  // if we are already inside a link, exit early.
  if (node.type === "link") {
    return;
  }
  
  const [currentNode, currentNodePath] = Editor.node(editor, editor.selection);
  if (!Text.isText(currentNode)) {
    return;
  }
  
  let [start] = Range.edges(editor.selection);
  const cursorPoint = start;
  
  const startPointOfLastCharacter = Editor.before(editor, editor.selection, {
    unit: "character",
  });
  let lastCharacter = Editor.string(
    editor,
    Editor.range(editor, startPointOfLastCharacter, cursorPoint)
    );
    
    if (lastCharacter !== " ") {
      return;
    }
    
    let end = startPointOfLastCharacter;
  start = Editor.before(editor, end, {
    unit: "character",
  });

  const startOfTextNode = Editor.point(editor, currentNodePath, {
    edge: "start",
  });

  lastCharacter = Editor.string(editor, Editor.range(editor, start, end));

  while (lastCharacter !== " " && !Point.isBefore(start, startOfTextNode)) {
    end = start;
    start = Editor.before(editor, end, { unit: "character" });
    lastCharacter = Editor.string(editor, Editor.range(editor, start, end));
  }

  const lastWordRange = Editor.range(editor, end, startPointOfLastCharacter);
  const lastWord = Editor.string(editor, lastWordRange);

  if (isUrl(lastWord)) {
    Promise.resolve().then(() =>
      createLinkForRange(editor, lastWordRange, lastWord, lastWord)
    );
  }
}

export function createLinkForRange(editor, range, linkText, linkURL, isInsertion) {
  isInsertion
    ? Transforms.insertNodes(
        editor,
        {
          type: "link",
          url: linkURL,
          children: [{ text: linkText }],
        },
        range != null ? { at: range } : undefined
      )
    : Transforms.wrapNodes(
        editor,
        { type: "link", url: linkURL, children: [{ text: linkText }] },
        { split: true, at: range }
      );
}

export function getFirstTextNodeAtSelection(editor, selection) {
  const selectionForNode = selection ?? editor.selection;

  if (selectionForNode == null) {
    return null;
  }

  const textNodeEntry = Editor.nodes(editor, {
    at: selectionForNode,
    mode: "lowest",
  }).next().value;

  return textNodeEntry != null && Text.isText(textNodeEntry[0])
    ? textNodeEntry[0]
    : null;
}
