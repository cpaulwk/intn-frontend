import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position: { top: number; left: number } | null;
  triggerRef: React.RefObject<HTMLButtonElement> | undefined;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  position,
  triggerRef,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        triggerRef &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !position) return null;

  return createPortal(
    <div
      ref={modalRef}
      className="fixed z-50 rounded-2xl bg-white shadow-lg"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {children}
    </div>,
    document.body
  );
};

export default Modal;
