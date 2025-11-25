import AbsoluteArrowProps from "@/props/modal-props/absolute-arrows/AbsoluteArrowsModalProps";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

function AbsoluteArrowNavigationModal({ onNext, onPrev }: AbsoluteArrowProps) {
    return (
        <div className="flex justify-between items-center absolute right-0 left-0 top-0 h-full px-2">
            {/* Nút trái */}
            <ArrowLeftIcon
                className="w-6 h-6 rounded-full bg-white/70 text-gray-700 hover:bg-white/90 p-1 cursor-pointer opacity-60 hover:opacity-100 transition"
                onClick={onPrev}
            />
            {/* Nút phải */}
            <ArrowRightIcon
                className="w-6 h-6 rounded-full bg-white/70 text-gray-700 hover:bg-white/90 p-1 cursor-pointer opacity-60 hover:opacity-100 transition"
                onClick={onNext}
            />
        </div>
    );
}

export default AbsoluteArrowNavigationModal;