import React from "react";

const LinkifyText = ({ text }) => {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split text into parts based on URLs
  const parts = text.split(urlRegex);

  return (
    <span>
      {parts.map((part, index) =>
        urlRegex.test(part) ? (
          // Render matched URL as a link
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {part}
          </a>
        ) : (
          // Render plain text
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default LinkifyText;
