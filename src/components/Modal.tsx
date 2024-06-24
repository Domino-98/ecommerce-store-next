import React, { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icon";
import Action from "./Action";

interface ModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  heading: string;
  children: ReactNode;
  action?: ReactNode;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function Modal({
  showModal,
  setShowModal,
  heading,
  children,
  action,
}: ModalProps) {
  const modalRoot = useRef<Element | null>(null);

  useEffect(() => {
    modalRoot.current = document.getElementById("modal-root");
    if (!modalRoot.current) {
      const root = document.createElement("div");
      root.setAttribute("id", "modal-root");
      document.body.appendChild(root);
      modalRoot.current = root;
    }

    return () => {
      if (modalRoot.current) {
        document.body.removeChild(modalRoot.current);
      }
    };
  }, []);

  if (!modalRoot.current) return null;

  return createPortal(
    <AnimatePresence>
      {showModal && (
        <motion.div
          key="modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-lg w-full overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between bg-slate-50 p-5">
              <h2 className="text-xl">{heading}</h2>
              <Icon
                name="X"
                size={20}
                className="cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </header>
            <div className="p-5 text-center">{children}</div>
            <footer className="flex justify-center gap-4 p-5 pt-0">
              {action}
              <Action
                actiontype="button"
                variant="danger-outline"
                onClick={() => setShowModal(false)}
              >
                Close
              </Action>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot.current
  );
}
