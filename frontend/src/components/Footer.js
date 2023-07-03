function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="root">
      <footer className="footer">
        <p className="footer__copyright">&copy; {currentYear} Mesto Russia</p>
      </footer>
    </div>
  );
}

export default Footer;