import Link from "next/link";
import { FaUserFriends, FaCalendar } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

export default function Header() {
  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      {/* Left side - Logo */}
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700">AP</span>
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center gap-3 sm:gap-5 text-gray-700">
        <Link href="/friends" aria-label="Friends" className="hover:text-black transition-colors">
          <FaUserFriends size={32} />
        </Link>
        <Link href="/home" aria-label="Calendars" className="hover:text-black transition-colors">
          <FaCalendar size={32} />
        </Link>
        <Link href="/" aria-label="Profile" className="hover:text-black transition-colors">
          <BsPersonCircle size={32} />
        </Link>
      </div>
    </div>
  );
}
