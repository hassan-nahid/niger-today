import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, description, duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, description, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      showToast({ type: "success", title, description });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      showToast({ type: "error", title, description });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, success, error, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Exact Figma Toast Container & Component
const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-7 right-6 sm:right-10 z-[100] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

// Exact Figma Toast/success (1:2246) and Toast/error (1:2387)
const ToastCard: React.FC<{
  toast: ToastItem;
  onDismiss: () => void;
}> = ({ toast, onDismiss }) => {
  const isSuccess = toast.type === "success";

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 w-[330px] sm:w-[350px] min-h-[70px] px-4 py-3.5 rounded-[14px] bg-white shadow-xl transition-all animate-in fade-in slide-in-from-top-3 duration-200 ${
        isSuccess ? "border border-[#16A34A]" : "border border-[#DC2626]"
      }`}
      style={{
        boxShadow: "0px 10px 25px -5px rgba(15, 23, 42, 0.1), 0px 8px 10px -6px rgba(15, 23, 42, 0.06)",
      }}
    >
      {/* 36x36px Icon Circle */}
      {isSuccess ? (
        <div className="w-9 h-9 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#16A34A"
            />
            <path
              d="M6.66663 10L9.16663 12.5L13.3333 7.5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#16A34A"
            />
          </svg>
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M9.99984 2.5L1.6665 16.6667H18.3332L9.99984 2.5Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#DC2626"
            />
            <path
              d="M10 8.33337V11.6667"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#DC2626"
            />
            <path
              d="M10 14.1666H10.0083"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#DC2626"
            />
          </svg>
        </div>
      )}

      {/* Text Container: Title (14px Medium #0F172A) + Description (12px Regular #64748B) */}
      <div className="flex-1 min-w-0 pr-1">
        <h4 className="text-sm font-medium text-[#0F172A] leading-snug truncate">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-xs font-normal text-[#64748B] leading-tight mt-0.5 truncate">
            {toast.description}
          </p>
        )}
      </div>

      {/* 18x18px Close X Button */}
      <button
        onClick={onDismiss}
        type="button"
        className="p-1 -mr-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
        aria-label="Close notification"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M13.5 4.5L9 9M9 9L4.5 13.5M9 9L4.5 4.5M9 9L13.5 13.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#94A3B8"
          />
        </svg>
      </button>
    </div>
  );
};
