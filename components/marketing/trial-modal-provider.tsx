"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { TrialForm } from "@/components/forms/trial-form";

const TrialContext = createContext<{ openTrial: () => void }>({
  openTrial: () => {},
});

export function useTrialModal() {
  return useContext(TrialContext);
}

/**
 * Site-wide "Book Free Trial" modal. Any component can open it via
 * useTrialModal().openTrial(). Rendered once, in the marketing layout.
 */
export function TrialModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openTrial = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <TrialContext.Provider value={{ openTrial }}>
      {children}
      <Modal open={open} onClose={close} label="Book a free trial session">
        <TrialForm onDone={close} />
      </Modal>
    </TrialContext.Provider>
  );
}
