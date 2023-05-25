import { ReactEditor, useEditor } from "slate-react";
import { useCallback, useEffect, useRef } from "react";

import Card from "react-bootstrap/Card";

export default function Popover({
  header,
  children,
  className,
  isBodyFullWidth,
  onClickOutside,
}) {
  const popoverRef = useRef(null);

  const onMouseDown = useCallback(
    (event) => {
      if (
        popoverRef.current != null &&
        !popoverRef.current.contains(event.target) &&
        onClickOutside != null
      ) {
        onClickOutside(event);
      }
    },
    [onClickOutside]
  );

  useEffect(() => {
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [onMouseDown]);


  return (
    <Card ref={popoverRef} className={className}>
      {header != null ? <Card.Header>{header}</Card.Header> : null}
      <Card.Body style={isBodyFullWidth ? { padding: 0 } : undefined}>
        {children}
      </Card.Body>
    </Card>
  );
}
