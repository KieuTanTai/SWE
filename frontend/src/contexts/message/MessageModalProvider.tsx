"use client";
import { useCallback, useState, type ReactNode } from "react";
import { MessageModal } from "@/modal/components/message/PopupMessage";
import { MessageModalContext } from "./messageModalContext";
import { MessageType } from "@/props/modal-props/popup-message/MessageModalProps";


const getTimeoutValue = async () => {
    return 3000;
}

export const MessageModalProvider = ({ children, headerId = "header-container" }:
    { children: ReactNode; headerId?: string }) => {
    const [modalProps, setModalProps] = useState<{
        message: string;
        type: MessageType;
        timeout: number;
        marginTop: number;
    } | null>(null);

    const showMessage = useCallback(async (message: string,
        type: MessageType = "info") => {
        const timeout: number = await getTimeoutValue();
        const header = document.getElementById(headerId);
        const marginTop = header?.offsetHeight ?? 0;
        setModalProps({ message, type, timeout, marginTop });
    }, [headerId]);

    const handleClose = () => setModalProps(null);

    return (
        <MessageModalContext.Provider value={{ showMessage }}>
            {children}
            {modalProps && (
                <MessageModal
                    message={modalProps?.message}
                    type={modalProps.type}
                    timeout={modalProps.timeout}
                    marginTop={modalProps.marginTop}
                    onClose={handleClose}
                />
            )}
        </MessageModalContext.Provider>
    );
}

// Remove the hook from this file. It will be placed in a separate file.