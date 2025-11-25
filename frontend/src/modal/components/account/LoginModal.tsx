import Modal from "react-modal";
import LoginForm from "@/components/account/LoginForm";
import { LoginModalProps } from "@/props/modal-props/account-props/LoginModalProps";
// import the correct type for LoginForm props if available

function LoginModal({ isOpen, onRequestClose, onSuccess, dictLinksClick }: LoginModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Login Form"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      className="relative bg-white rounded-xl min-w-[350px] shadow-lg flex flex-col"
      bodyOpenClassName="overflow-hidden"
      ariaHideApp={false}
    >
      <button
        className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full text-red-500 text-lg transition bg-transparent! p-1!"
        onClick={onRequestClose}
        aria-label="close"
      >
        X
      </button>
      <LoginForm
        onSuccess={onSuccess}
        onRegisterLinkClick={dictLinksClick ? dictLinksClick.signup : () => { }}
        onForgotPasswordLinkClick={dictLinksClick ? dictLinksClick.forgotPassword : () => { }} />
    </Modal>
  );
}

export default LoginModal;
