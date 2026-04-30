import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sessionModel } from '../models/sessionModel';
import logo from '../views/images/logo.png';

export default function BrandHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const user = sessionModel.getUser();
  const homePath = user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : user?.role === 'customer' ? '/customer' : '/';

  const handleLogout = () => {
    sessionModel.clearSession();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`home-brand-bar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to={homePath} className="home-brand-link" aria-label="MedHealth home">
        <img src={logo} alt="MedHealth logo" className="home-brand-logo" />
        <span className="home-brand-mark">MedHealth</span>
      </Link>
      {sessionModel.getToken() ? (
        <button type="button" className="home-logout-btn" onClick={handleLogout}>
          Log out
        </button>
      ) : null}
    </header>
  );
}