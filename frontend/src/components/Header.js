import React, { useState } from 'react';
import logo from '../images/header-logo.svg';
import burgerButton from '../../src/images/header-burger-button.svg';
import closeButton from '../../src/images/header-menu-close-button.svg';
import { Link, useLocation } from 'react-router-dom';

function Header({ userEmail, loggedIn, onLogout }) {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // Функция обработки клика по ссылке
  const handleLinkClick = () => {
    if (loggedIn) {
      onLogout();
    }
  };

  // Функция переключения состояния меню
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const linkName = loggedIn ? 'Выйти' : location.pathname === '/sign-in' ? 'Регистрация' : 'Вход';
  const linkPath = loggedIn ? '/sign-in' : location.pathname === '/sign-in' ? '/sign-up' : '/sign-in';

  return (
    <header className={`header ${loggedIn ? '' : 'header__authorization'}`}>
      {loggedIn ? (
        <>
          <div className={`header__content ${menuOpen ? 'header__content_open' : ''}`}>
            <p className="header__email">{userEmail}</p>
            <Link className="header__logout" onClick={handleLinkClick} to={linkPath}>
              {linkName}
            </Link>
          </div>
          <div className="header__mobile_content">
            <img className="header__logo" src={logo} alt="Место Россия" />
            <button onClick={toggleMenu} className="header__burger-button" style={{ backgroundImage: `url(${menuOpen ? closeButton : burgerButton})` }}></button>
          </div>
        </>
      ) : (
        <>
          <img className="header__logo" src={logo} alt="Место Россия" />
          <Link className="header__link" to={linkPath}>
            {linkName}
          </Link>
        </>
      )}
    </header>
  );
}

export default Header;