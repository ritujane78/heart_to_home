
import { X, Info } from "lucide-react";

function PhoneInfo({ setShowPhoneInfo }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => setShowPhoneInfo(false)}
    >
      <div
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShowPhoneInfo(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
          aria-label="Close information"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex items-center gap-2 text-[#1F6F5C]">
          <Info size={22} className="mt-[-5px]"/>
          <h3 className="text-lg font-semibold">
            Phone Number Format
          </h3>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p>
            Please enter one of the following Nepal phone number formats:
          </p>

          <div className="rounded-lg bg-gray-100 p-3">
            <p className="font-medium text-gray-800">
              Kathmandu Landline
            </p>
            <p className="font-mono mt-1">01XXXXXX</p>
            <p className="text-gray-500">
              Example: 01423456
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 p-3">
            <p className="font-medium text-gray-800">
              Nepal Mobile
            </p>
            <p className="font-mono mt-1">97XXXXXXXX</p>
            <p className="font-mono">98XXXXXXXX</p>
            <p className="text-gray-500">
              Example: 9801234567
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Only Kathmandu landline numbers and Nepal mobile
            numbers are accepted.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPhoneInfo(false)}
          className="mt-6 w-full rounded-lg bg-[#1F6F5C] px-4 py-2.5 font-medium text-white transition hover:bg-[#174d40]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default PhoneInfo;
