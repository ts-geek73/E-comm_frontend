import React from "react";

interface OneLinerCodeBlockProps {
  code: string;
}

const OneLinerCodeBlock: React.FC<OneLinerCodeBlockProps> = ({ code }) => {
  const trimmedCode = code.trim();

  return <code>{trimmedCode}</code>;
};

export default OneLinerCodeBlock;
