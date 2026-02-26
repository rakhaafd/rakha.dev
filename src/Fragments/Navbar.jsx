import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOpenInNew } from "react-icons/md";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const internalMenu = ['Home', 'About', 'Skills', 'Project', 'Certificates', 'Contact'];
  const externalMenu = { name: 'Blog', url: 'https://medium.com/@rakhafausta07' };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavigation = (e, item, type = 'internal') => {
    e.preventDefault();
    setIsOpen(false);

    if (type === 'external') {
      window.open(item.url, '_blank');
      return;
    }

    const sectionId = item.toLowerCase();
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate('/', { state: { scrollTo: sectionId }, replace: true });
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo && location.pathname === '/') {
      const element = document.getElementById(location.state.scrollTo);
      if (element) element.scrollIntoView({ behavior: "smooth" });
      navigate('/', { state: {}, replace: true });
    }
  }, [location, navigate]);

  return (
    <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[var(--color-bg)]/80 backdrop-blur-md shadow-lg shadow-[var(--color-accent)]/5' 
        : 'bg-[var(--color-bg)]/60 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">

        <h1 
          onClick={() => navigate('/')}
          className="text-xl font-bold relative group cursor-pointer"
        >
          rakha.dev
        </h1>

        <ul className="hidden md:flex items-center gap-1 text-sm font-medium mx-auto">
          {internalMenu.map((item) => (
            <li key={item}>
              <a 
                href={location.pathname === '/' ? `#${item.toLowerCase()}` : '/'}
                onClick={(e) => handleNavigation(e, item)}
                className="relative px-4 py-2 rounded-lg text-white/70 hover:text-[var(--color-accent)] transition-colors duration-300"
              >
                {item}
                <span className="absolute inset-0 bg-[var(--color-accent)]/0 hover:bg-[var(--color-accent)]/10 rounded-lg transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center">
          <a
            href={externalMenu.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-50 px-4 py-2 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium
                       hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent-hover)] transition-all duration-300
                       border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 flex items-center gap-1"
          >
            {externalMenu.name}
            <MdOpenInNew className="text-md" />
          </a>
        </div>

        <button 
          onClick={toggleMenu} 
          className="md:hidden focus:outline-none relative p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/30 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-[var(--color-bg)]/80 backdrop-blur-md border-t border-[var(--color-accent)]/20 shadow-inner">
          <ul className="flex flex-col text-center py-2">
            {internalMenu.map((item) => (
              <li key={item}>
                <a 
                  href={location.pathname === '/' ? `#${item.toLowerCase()}` : '/'}
                  onClick={(e) => handleNavigation(e, item)}
                  className="block px-4 py-3 text-white/70 hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
            <li className="px-4 py-2">
              <a 
                href={externalMenu.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg 
                           bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium
                           hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent-hover)] 
                           transition-all duration-300 border border-[var(--color-accent)]/20 
                           hover:border-[var(--color-accent)]/40 w-full"
              >
                {externalMenu.name}
                <MdOpenInNew className="text-md" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
