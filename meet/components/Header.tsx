import Link from "next/link";
import { GoogleCalendarLoginButton } from "./GoogleCalendarIntegration";
import { FaUserFriends, FaBell } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

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
      <div className="flex items-center gap-6">
        {/* Friends icon */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900">
          <FaUserFriends size={24} />
        </button>

        {/* Notification bell icon */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900">
          <FaBell size={24} />
        </button>

        {/* Profile icon */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900">
          <BsPersonCircle size={24} />
        </button>
      </div>
    </div>
  );
}
