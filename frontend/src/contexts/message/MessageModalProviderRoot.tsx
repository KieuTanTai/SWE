import { MessageModalProvider } from "./MessageModalProvider";

export default function MessageModalProviderRoot({ children }: { children: React.ReactNode }) {
  return <MessageModalProvider>{children}</MessageModalProvider>;
}
