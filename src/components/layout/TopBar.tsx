import { Link } from 'react-router-dom';
import { PersonaSwitcher } from './PersonaSwitcher';

export function TopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-6"
      style={{
        height: '56px',
        background: '#192234',
        borderBottom: '1px solid rgba(148,163,184,0.14)',
      }}
    >
      {/* Left: Logo */}
      <div className="flex flex-col leading-tight min-w-0 flex-shrink-0">
        <span className="text-[#F59E0B] font-bold text-base tracking-tight">
          🔥 SANYAM
        </span>
        <span className="text-[#64748B] text-xs">MODIS × VIIRS Harmonization</span>
      </div>

      {/* Center: Persona switcher */}
      <div className="flex-1 flex justify-center">
        <PersonaSwitcher />
      </div>

      {/* Right: Nav links */}
      <nav className="flex items-center gap-1 flex-shrink-0">
        <Link
          to="/dashboard"
          className="px-3 py-1.5 rounded-lg text-sm text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/"
          className="px-3 py-1.5 rounded-lg text-sm text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors"
        >
          Home
        </Link>
      </nav>
    </header>
  );
}

export default TopBar;
