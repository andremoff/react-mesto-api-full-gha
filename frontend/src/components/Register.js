import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormAndValidation } from '../components/hooks/useFormAndValidation';

function Register(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();

  useEffect(() => {
    if (!props.isOpen) {
      resetForm();
    }
  }, [props.isOpen, resetForm]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { registerEmail: email, registerPassword: password } = values;
    props.handleRegister(email, password, navigate);
  };

  return (
    <div>
      <form className="authorization" onSubmit={handleRegisterSubmit}>
        <h1 className="authorization__title">Регистрация</h1>
        <input
          className="authorization__email_input"
          name="registerEmail"
          id="registerEmail"
          type="email"
          value={values.registerEmail || ''}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <span className={`popup__input-error ${errors.registerEmail && 'popup__input-error_active'}`}>{errors.registerEmail}</span>
        <input
          className="authorization__password_input"
          name="registerPassword"
          id="registerPassword"
          type="password"
          value={values.registerPassword || ''}
          onChange={handleChange}
          placeholder="Пароль"
          minLength="6"
          maxLength="30"
          required
        />
        <span className={`popup__input-error ${errors.registerPassword && 'popup__input-error_active'}`}>{errors.registerPassword}</span>
        <button type="submit" className="authorization__submit-button" disabled={!isValid}>
          {isLoading ? 'Загружается...' : 'Зарегистрироваться'}
        </button>
        <p className="authorization__caption">
          Уже зарегистрированы?{' '}
          <Link className="authorization__link" to="/sign-in">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;