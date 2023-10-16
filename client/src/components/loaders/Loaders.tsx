import { FC } from "react";
import Logo from "../../assets/logo.png";
interface FullPageLoaderProps {
  text?: string;
}

export const FullPageLoader: FC<FullPageLoaderProps> = ({ text }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-200">
      <div className="text-center">
        <div className="mx-auto ml-6 mb-4 w-48">
          <img
            src={Logo}
            alt="Cityvet Logo"
            className="h-full w-full object-contain"
          />
        </div>

        {text && <p className="font-bold text-primary">{text}</p>}
      </div>
    </div>
  );
};
