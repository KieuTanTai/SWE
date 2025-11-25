"use client";
import { useEffect } from "react";
import Modal from "react-modal";

export default function AppModalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);
  return <>{children}</>;
}
