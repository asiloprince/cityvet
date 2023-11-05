import React from "react";

const BoxHeader: React.FC<{
  title: string;
  subtitle: string;
  sideText: string;
}> = ({ title, subtitle, sideText }) => {
  return (
    <div className="bg-white p-4 shadow-default mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          <p className="text-sm text-text-secondary">{subtitle}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-green-500">
            {sideText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoxHeader;
