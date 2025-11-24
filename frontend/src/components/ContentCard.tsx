import React from "react";

interface ContentCardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, children }) => {
  const marginTop = title ? "b-8 pt-10" : "";

  return (
    <div
      className={`relative w-full bg-gray-900  
      shadow-lg p-6 mx-auto mb-4
      ${marginTop}`}
    >
      {title ? (
        <h2 className="absolute top-4 left-4 text-xl font-semibold text-white mb-4">
          {title}
        </h2>
      ) : null}

      <div className="text-gray-300 mt-2">{children}</div>
    </div>
  );
};

export default ContentCard;
