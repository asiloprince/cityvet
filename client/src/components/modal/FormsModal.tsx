import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const FormsModal: React.FC<ModalProps> = ({ children, isOpen, setIsOpen }) => {
  return (
    <div>
      {isOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-white/70 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              ​
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {children}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-0 right-0 p-4"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsModal;
