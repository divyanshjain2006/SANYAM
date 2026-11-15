import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Menu, X } from 'lucide-react';
import { PersonaSwitcher } from './PersonaSwitcher';
import logoImg from '../../assets/logo.jpg';

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Our Users', href: '#our-users' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Proposed Solution', href: '#proposed-solution' },
    { label: 'Example Use Cases', href: '#case-studies' },
    { label: 'Conclusion', href: '#conclusion' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Application Logo & Name */}
        <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm ring-1 ring-slate-200/80 group-hover:scale-105 transition-transform bg-slate-900">
            <img 
              src={logoImg} 
              alt="SANYAM Satellite Fire Observation Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[17px] tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors">
              SANYAM
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[13.5px] font-medium text-slate-700 hover:text-blue-600 transition-colors no-underline cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Dashboard Persona Switcher (if on dashboard) + Explore Dashboard Pill CTA */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          {isDashboard ? (
            <div className="flex items-center gap-2">
              <PersonaSwitcher />
              <Link
                to="/"
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors no-underline"
              >
                Home
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 pl-4 pr-3 py-2 rounded-full font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#00629B] via-[#0077BE] to-[#0091DF] hover:opacity-95 shadow-md shadow-blue-500/15 hover:shadow-lg transition-all active:scale-95 no-underline"
            >
              <span>Explore Dashboard</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600 shadow-sm sm:hidden no-underline"
          >
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 shadow-xl animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block text-sm font-medium text-slate-700 hover:text-blue-600 py-1.5 transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#00629B] via-[#0077BE] to-[#0091DF] shadow-md no-underline"
            >
              <span>Explore Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default TopBar;
