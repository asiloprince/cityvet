import React, { useState } from "react";

interface AccessLevelButtonProps {
  initialLabel: string;
  icons: { [key: string]: React.ReactElement };
  colors?: { [key: string]: string };
}

const defaultColors: { [key: string]: string } = {
  Admin: "cyan-600",
  ProgramManager: "cyan-600",
  Coordinator: "cyan-600",
};

const AccessLevelButton: React.FC<AccessLevelButtonProps> = ({
  initialLabel,
  icons,
  colors = defaultColors,
}) => {
  const [currentLabel, setCurrentLabel] = useState(initialLabel);

  const toggleAccess = () => {
    if (currentLabel === "Admin") {
      setCurrentLabel("ProgramManager");
    } else if (currentLabel === "ProgramManager") {
      setCurrentLabel("Coordinator");
    } else {
      setCurrentLabel("Admin");
    }
  };

  const currentIcon = icons[currentLabel as keyof typeof defaultColors];
  const currentColor = colors[currentLabel as keyof typeof defaultColors];

  return (
    <div
      className={`w-62 h-10 flex items-center justify-center rounded-md bg-${currentColor} cursor-pointer`}
      onClick={toggleAccess}
    >
      {currentIcon}
      <span className="ml-2 text-white">{currentLabel}</span>
    </div>
  );
};

export default AccessLevelButton;
