import { isEmpty } from "lodash";
import "./Link.css";

export default function Link({ element, attributes, children }) {
  return (
    <span className="link-container">
      <span {...attributes} className={"link-text-error"}>
        {children}
      </span>
      {!isEmpty(element?.url) && (
        <span className="link-is-hover link-text-fixed"><b>➙</b>{`${element.url}`}</span>
      )}
    </span>
  );
}
