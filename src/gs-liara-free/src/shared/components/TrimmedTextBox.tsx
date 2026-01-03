import type { ElementType, ReactNode } from "react";

const TrimmedTextBox = ({
  children,
  as = "span",
}: {
  children: ReactNode;
  as?: ElementType;
}) => {
  const Element = as;
  return <Element className="text-box-trim">{children}</Element>;
};

export default TrimmedTextBox;