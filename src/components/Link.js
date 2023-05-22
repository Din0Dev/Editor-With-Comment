import "./Link.css";

export default function Link({ element, attributes, children }) {
  return (
    <span href={element.url} {...attributes} className={"link"}>
      {children}
    </span>
  );
}
