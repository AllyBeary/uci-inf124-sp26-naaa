import Link from "next/link";
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
      <div className="flex items-center gap-6">
        {/* Friends icon */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>

        {/* Notification bell icon */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* Profile icon */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 100-16 8 8 0 000 16z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
