export type MessageType = "success" | "error" | "warning" | "info";

export default interface MessageModalProps {
  message: string;
  type: MessageType;
  timeout?: number; // milliseconds
  marginTop?: number; // px
  onClose?: () => void;
}
