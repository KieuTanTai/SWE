"use client";
import { useContext } from "react";
import { MessageModalContext } from "@/contexts/message/messageModalContext";

export function useMessageModalProvider() {
  const context = useContext(MessageModalContext);
  if (!context) {
    throw new Error(
      "useMessageModal must be used within a MessageModalProvider"
    );
  }
  return context;
}
