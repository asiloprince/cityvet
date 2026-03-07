import { X } from 'lucide-react'
import React from 'react'

interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, setIsOpen }) => {
  return (
    <>
      <div className="dark:bg-[#020817] bg-red dark:text-white">
        {isOpen && (
          <div
            className="fixed z-10 inset-0 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-2 text-center sm:block sm:p-0 dark:bg-[#020817] bg-white">
              <div
                className="fixed inset-0 bg-opacity-20 bg-gray-400 backdrop:opacity-20 transition-opacity"
                aria-hidden="true"
              ></div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              ></span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden drop-shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-2 pt-5 pb-4 sm:pb-4">{children}</div>

                <button onClick={() => setIsOpen(false)} className="absolute top-0 right-0 p-4">
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
export default Modal
