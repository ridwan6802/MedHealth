import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sessionModel } from '../models/sessionModel';
import logo from '../views/images/logo.png';

export default function BrandHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = sessionModel.getUser();
  const isLoggedIn = Boolean(sessionModel.getToken());
  const homePath = user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : user?.role === 'customer' ? '/customer' : '/';
  const showCustomerNav = user?.role === 'customer' || location.pathname === '/';
  const showNavLinks = isLoggedIn || location.pathname === '/' || location.pathname === '/about';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isStaffPage = user?.role === 'staff' || location.pathname.startsWith('/staff');
  const isProfilePage = location.pathname === '/profile';
  const showOrderHistoryButton = user?.role === 'customer' && ['/customer', '/customer/cart', '/customer/checkout'].includes(location.pathname);
  const profilePath = isLoggedIn ? '/profile' : '/login';
  const allNavLinks = [
    { label: 'Home', to: homePath },
    { label: 'Profile', to: profilePath },
    { label: 'About', to: '/about' },
    { label: 'Support', to: isLoggedIn ? (user?.role === 'customer' ? '/customer/messages' : '/about') : '/login' }
  ];
  const navLinks = isStaffPage
    ? allNavLinks.filter((link) => link.label === 'Home' || link.label === 'Profile' || link.label === 'About')
    : isAdminPage
      ? allNavLinks.filter((link) => link.label === 'Home' || link.label === 'Profile' || link.label === 'About')
      : user?.role === 'admin' && isProfilePage
        ? allNavLinks.filter((link) => link.label !== 'Support')
      : allNavLinks;

  const isActiveLink = (to) => {
    const [pathname, hash = ''] = to.split('#');
    if (!hash) {
      return location.pathname === pathname;
    }

    return location.pathname === pathname && location.hash === `#${hash}`;
  };

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
      {showNavLinks ? (
        <nav className="home-brand-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className={`home-nav-btn${isActiveLink(link.to) ? ' active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
      <div className="home-brand-actions">
        {showOrderHistoryButton ? (
          <Link to="/customer/orders" className="home-orders-btn">
            Order History
          </Link>
        ) : null}
        {sessionModel.getToken() ? (
          <button type="button" className="home-logout-btn" onClick={handleLogout}>
            Log out
          </button>
        ) : null}
      </div>
    </header>
  );
}