"use client";

import { createContext, useCallback, useContext, useState } from "react";

type WvModalContextValue = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const WvModalContext = createContext<WvModalContextValue | null>(null);

/** Gedeelde state voor de "Controleer jullie datum"-popup (nav, hero, modal). */
export function WvModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <WvModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
    </WvModalContext.Provider>
  );
}

export function useWvModal(): WvModalContextValue {
  const ctx = useContext(WvModalContext);
  if (!ctx) {
    throw new Error("useWvModal must be used within WvModalProvider");
  }
  return ctx;
}
