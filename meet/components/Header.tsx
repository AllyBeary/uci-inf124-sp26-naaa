import Link from "next/link";
import { FaUserFriends, FaBell } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { GoogleCalendarLoginButton } from "./GoogleCalendarIntegration";

interface HeaderProps {
  onAccessTokenChange?: (token: string | null) => void;
  onUserChange?: (user: { name: string; email: string } | null) => void;
}

export default function Header({ onAccessTokenChange, onUserChange }: HeaderProps) {
  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      {/* Left side - Logo & Setup */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <GoogleCalendarLoginButton
          onAccessTokenChange={onAccessTokenChange || (() => {})}
          onUserChange={onUserChange || (() => {})}
        />
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center gap-3 sm:gap-5 text-gray-700">
        <Link href="/friends" aria-label="Friends" className="hover:text-black transition-colors">
          <FaUserFriends size={32} />
        </Link>
        <button aria-label="Notifications" className="hover:text-black transition-colors">
          <FaBell size={32} />
        </button>
        <button aria-label="Profile" className="hover:text-black transition-colors">
          <BsPersonCircle size={32} />
        </button>
      </div>
    </div>
  );
}
