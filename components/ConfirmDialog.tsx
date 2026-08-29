"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Ha",
  cancelLabel = "Yo'q",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(20, 8, 14, 0.55)" }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="gilded-card p-6 sm:p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-elegant italic text-2xl font-medium mb-2"
              style={{ color: "var(--gold-light)" }}
            >
              {title}
            </h3>
            <p className="text-cream/70 mb-6">{message}</p>
            <div className="flex justify-center gap-3">
              <button className="btn-ghost" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button className="btn-gold" onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
