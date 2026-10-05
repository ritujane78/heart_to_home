import { Heart } from "lucide-react";


const Footer = () => {
  return (
    <footer className="flex items-center justify-center gap-1 py-4">
      <p>&copy; All Rights Reserved by</p>

      <div className="relative flex items-center justify-center">
        <div className="absolute h-5 w-5 rounded-full bg-red-500/5 blur-xl animate-pulse" />

        <Heart
          className="h-5 w-5 fill-red-500 text-red-500 animate-heartbeat"
          strokeWidth={2}
        />
      </div>

      <span>Heart To Home</span>
    </footer>
  );
};

export default Footer;