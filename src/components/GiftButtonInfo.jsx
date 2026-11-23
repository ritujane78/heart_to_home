
import { X, Info } from "lucide-react";
import { useEffect } from "react";

function GiftButtonInfo({ setShowGiftInfo }) {
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setShowGiftInfo(false);
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
  
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setShowGiftInfo]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={() => setShowGiftInfo(false)}
    >
      <div
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-info-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShowGiftInfo(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
          aria-label="Close information"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex items-center gap-2 text-[#1F6F5C]">
          <Info size={22} className="mt-[-5px]"/>
          <h3
            id="gift-info-title"
            className="text-lg font-semibold"
          >
            Button Enable
          </h3>
        </div>

        <div className="text-sm leading-relaxed text-gray-600">
          <p>
            The <strong className="text-gray-800">Gift Now</strong> button
            will be enabled only after you:
          </p>

          <ul className="mt-3 space-y-2 pl-5 list-disc">
            <li>Log in to your account.</li>
            <li>Select one or more healthcare services.</li>
          </ul>

          <div className="mt-4 rounded-lg bg-gray-100 p-3">
            Once both conditions are met, you can proceed to complete
            your gift purchase.
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiftButtonInfo;
