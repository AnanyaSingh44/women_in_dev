import React, { useEffect } from 'react';
import { X } from 'lucide-react';

// Define your theme color values here
const BORDER_COLOR = "#f3f4f6";      // gray-200
const TEXT_DARK = "#111827";         // gray-900
const TEXT_LIGHT = "#6b7280";        // gray-500
const BACKGROUND_DARK = "#f3f4f6";   // gray-100

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = ''
}) => {
  if (!isOpen) return null;
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        className={`
          ${sizes[size]} 
          w-full
          max-h-[90vh]
          bg-white
          rounded-lg 
          shadow-xl 
          overflow-hidden 
          flex flex-col
          ${className}
        `}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="px-6 py-4 text-black-800 flex justify-between items-center sticky top-0 z-10 bg-white shadow-sm border-b"
          style={{ borderColor: BORDER_COLOR, borderBottomWidth: 1 }}
        >
          <h3
            className="text-lg font-medium pr-8"
            style={{ color: TEXT_DARK }}
          >
            {title}
          </h3>
          {showCloseButton && (
            <button 
              onClick={onClose}
              className="absolute right-4 focus:outline-none rounded-full h-8 w-8 flex items-center justify-center transition-colors"
              style={{
                color: TEXT_DARK,
                backgroundColor: "transparent"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = TEXT_DARK;
                e.currentTarget.style.backgroundColor = BACKGROUND_DARK;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = TEXT_LIGHT;
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;