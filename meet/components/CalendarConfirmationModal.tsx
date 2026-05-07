"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type CalendarConfirmationModalProps = {
  isOpen: boolean;
  calendarName: string;
  invitedCount: number;
  onClose: () => void;
  onConfirm: () => void;
};

export default function CalendarConfirmationModal({
  isOpen,
  calendarName,
  invitedCount,
  onClose,
  onConfirm,
}: CalendarConfirmationModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Create calendar?
          </h2>

          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            You are about to create{" "}
            <span className="font-medium text-gray-800">"{calendarName}"</span>{" "}
            and invite {invitedCount} {invitedCount === 1 ? "person" : "people"}
            .
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
