import React from "react";

interface ContentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, children }) => {
  return (
    <div className="relative w-full bg-white rounded-xl
    shadow-md border border-gray-200 p-6 mx-auto
    b-8 mb-4 pt-10">
      <h2 className="absolute top-4 left-4 text-xl
      font-semibold text-gray-900 mb-4">
        {title}
      </h2>
      <hr />
      <div className="text-gray-700 mt-2">{children}</div>
    </div>
  );
};

export default ContentCard;
