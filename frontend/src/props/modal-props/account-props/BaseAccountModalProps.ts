export interface BaseAccountModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onRequestClose: () => void;
  dictLinksClick: { [key: string]: () => void };
}
