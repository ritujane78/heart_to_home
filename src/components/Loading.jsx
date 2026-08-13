import { BallTriangle } from "react-loader-spinner";

function Loading({
  message = "Please wait...",
  height = "100vh",
}) {
  return (
    <div
      className="flex items-center justify-center py-10"
      style={{ minHeight: height }}
    >
      <div className="flex h-96 w-full flex-col items-center justify-center rounded-xl shadow">
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#1e5146"
          ariaLabel="ball-triangle-loading"
          visible
        />

        <span className="mt-3 text-lg text-gray-600">
          {message}
        </span>
      </div>
    </div>
  );
}

export default Loading;