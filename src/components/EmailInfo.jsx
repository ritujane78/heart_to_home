import { Info } from "lucide-react"

function EmailInfo({setShowEmailInfo}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">

      <button
        type="button"
        onClick={() => setShowEmailInfo(false)}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        aria-label="Close information"
      >
        ✕
      </button>

      <div className="mb-4 flex items-center gap-2 text-[#1F6F5C]">
        <Info size={22} className="mt-[-5px]" />
        <h3 className="text-lg font-semibold">
          Important: Active Email Address
        </h3>
      </div>

      <p className="text-sm leading-relaxed text-gray-600">
        Please provide an active email address that you can access.
        We will send order confirmations and updates about your
        gift's status to this email address.
      </p>

      <button
        type="button"
        onClick={() => setShowEmailInfo(false)}
        className="mt-6 w-full rounded-lg bg-[#1F6F5C] px-4 py-2.5 font-medium text-white transition hover:bg-[#174d40]"
      >
        Got it
      </button>
    </div>
  </div>
  )
}

export default EmailInfo
