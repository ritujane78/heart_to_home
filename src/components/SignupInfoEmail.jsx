import { Info } from "lucide-react";
import { useEffect } from "react";

function SignupEmailInfo({ setShowEmailInfo }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowEmailInfo(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowEmailInfo]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => setShowEmailInfo(false)}
    >
      <div
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShowEmailInfo(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
          aria-label="Close information"
        >
          ✕
        </button>

        <div className="mb-4 flex items-center gap-2 text-[#1F6F5C]">
          <Info size={22} />
          <h3 className="text-lg font-semibold">
            Active Email Address
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-gray-600">
          Please provide an active email address that you can access. We will
          send you a welcome email after you sign up. If you don't see our email
          in your inbox, please check your{" "}
          <strong className="font-semibold text-gray-700">spam</strong> or{" "}
          <strong className="font-semibold text-gray-700">junk</strong> folder.
        </p>
      </div>
    </div>
  );
}

export default SignupEmailInfo;
