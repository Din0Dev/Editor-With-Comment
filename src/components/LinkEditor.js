import "./LinkEditor.css";

import { useCallback, useEffect, useState } from "react";
import { Editor, Element, Transforms } from "slate";
import { useEditor } from "slate-react";
import { isEmpty } from "lodash";

import {
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import NodePopover from "./NodePopover";
import { getFirstTextNodeAtSelection } from "../utils/EditorUtils";

export default function LinkEditor({
  editorOffsets,
  selectionForLink,
  setIsOpenEditText,
}) {
  const editor = useEditor();
  const textNode = getFirstTextNodeAtSelection(editor, selectionForLink);
  const [node, path] = Editor.above(editor, {
    at: selectionForLink,
    match: (n) => n.type === "link",
  });
  const [linkURL, setLinkURL] = useState(node.url);
  const [hasEdit, setHasEdit] = useState(!linkURL);
  const [articleData, setArticleData] = useState(node?.articleData);

  //! Call API for Dropdown
  const data = [
    {
      id: 1,
      title: "Mạo từ",
      url: "google.com",
      children: [
        {
          id: 1,
          url: "google.com",
          title: "the",
        },
        {
          id: 2,
          url: "google.com",
          title: "another",
        },
        {
          id: 3,
          url: "google.com",
          title: "another",
        },
      ],
    },
    {
      id: 2,
      title: "Giới từ",
      url: "google.com",
    },

    {
      id: 3,
      title: "Tính từ",
      url: "google.com",
      children: [
        {
          id: 1,
          url: "google.com",
          title: "a",
        },
        {
          id: 2,
          url: "google.com",
          title: "an",
        },
        {
          id: 3,
          url: "google.com",
          title: "at",
        },
      ],
    },
  ];

  //! Function
  const onLinkURLChange = useCallback(
    (event) => setLinkURL(event.target.value),
    [setLinkURL]
  );

  const onApply = useCallback(
    (event) => {
      Transforms.setNodes(
        editor,
        { url: linkURL, articleData: articleData },
        { at: path }
      );
      // const newPath = path.slice(); // Sao chép đường dẫn ban đầu
      // newPath[newPath.length - 1]++; // Tăng chỉ số cuối cùng trong đường dẫn lên 1
      // const newNode = {
      //   type: 'paragraph',
      //   url: linkURL,
      //   children: [{ text: linkURL }],
      // };
      // Transforms.insertNodes(ditor, newNode, { at: [0,1] });
      setIsOpenEditText(false);
    },
    [editor, linkURL, path]
  );

  const onDelete = () => {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "link",
    });
  };

  const onClickOutside = () => {
    if (isEmpty(node.url)) {
      onDelete();
    }
  };

  const onSelectArticle = (event) => {
    const findData = data.find((item) => {
      return item.id === Number(event);
    });
    setArticleData(findData);
  };

  //! Effect
  useEffect(() => {
    setLinkURL(node.url);
    setArticleData(node.articleData);
  }, [node]);

  //! Render
  return (
    <NodePopover
      editorOffsets={editorOffsets}
      node={node}
      className={"link-editor"}
      header={
        <Header
          onToggleEdit={() => setHasEdit(!hasEdit)}
          onToggleDelete={onDelete}
        />
      }
      onClickOutside={onClickOutside}
    >
      {linkURL && (
        <div className={"link-editor-view"}>
          <span className="link-editor-title"> Thay Thế: </span>
          <span className="link-editor-wrong-text">{textNode.text}</span>
          <span className="link-editor-icon">➙</span>
          <span className="link-editor-edited-text">{linkURL}</span>
        </div>
      )}

      {articleData && (
        <div className={"link-article-view"}>
          <span className="link-article-title"> Chi tiết: </span>
          <a
            href={articleData.url}
            target="blank"
            className="link-article-link"
          >
            {articleData?.title}
          </a>
        </div>
      )}

      {hasEdit && (
        <>
          <Form.Control
            size="sm"
            type="text"
            value={linkURL}
            onChange={onLinkURLChange}
          />
          {/* Button */}
          <div className="link-editor-btn">
            <Button
              className={"link-apply-btn"}
              size="sm"
              variant="primary"
              disabled={!linkURL}
              onClick={onApply}
            >
              Apply
            </Button>
            <DropdownButton
              className={"link-article-btn"}
              id="article-text"
              title={articleData ? articleData.title : "Select"}
              onSelect={onSelectArticle}
              autoClose="outside"
            >
              {data.map((item) => (
                <MenuItem
                  item={item}
                  key={item.id}
                  onSelect={onSelectArticle}
                />
              ))}
            </DropdownButton>
          </div>
        </>
      )}
    </NodePopover>
  );

  function Header({ onToggleEdit, onToggleDelete }) {
    return (
      <div className={"link-editor-header"}>
        {hasEdit ? (
          <span>Comments</span>
        ) : (
          <>
            <Button size="sm" variant="primary" onClick={onToggleEdit}>
              Edit
            </Button>
            <Button size="sm" variant="danger" onClick={onToggleDelete}>
              Delete
            </Button>
          </>
        )}
      </div>
    );
  }
}

const MenuItem = ({ item, onSelect }) => {
  if (item.children) {
    return <MenuSubItem item={item} onSelect={onSelect} />;
  } else {
    return (
      <Dropdown.Item eventKey={item.id} key={item.id} onSelect={onSelect}>
        {item.title}
      </Dropdown.Item>
    );
  }
};

const MenuSubItem = ({ item, onSelect }) => {
  const [openSubItems, setOpenSubItems] = useState(false);
  //! Function

  //! Render
  return (
    <Dropdown className="menu-sub-item">
      <Dropdown.Item
        variant="success"
        id={`dropdown-${item.id}`}
        eventKey={item.id}
        onSelect={onSelect}
        className="menu-sub-item-button"
      >
        <span>{item.title}</span>
        <i
          className="bi bi bi-caret-right-fill"
          onClick={() => setOpenSubItems(!openSubItems)}
        ></i>
      </Dropdown.Item>

      {openSubItems && (
        <div className="menu-sub-item-item">
          {item.children.map((child) => (
            <Dropdown.Item eventKey={item.id} key={child.id}>
              {child.title}
            </Dropdown.Item>
          ))}
        </div>
      )}
    </Dropdown>
  );
};
