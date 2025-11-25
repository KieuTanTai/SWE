import { MessageType } from "@/props/modal-props/popup-message/MessageModalProps";
import { createContext } from "react";

export type MessageModalContextType = {
    showMessage: (
        message: string,
        type?: MessageType,
        timeout?: number
    ) => void;
};

export const defaultMessageModalContext: MessageModalContextType = {
    showMessage: () => { }
};

export const MessageModalContext = createContext<MessageModalContextType>(defaultMessageModalContext);