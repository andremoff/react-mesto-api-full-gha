import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormAndValidation } from '../components/hooks/useFormAndValidation';

function Login(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();

  useEffect(() => {
    if (!props.isOpen) {
      resetForm();
    }
  }, [props.isOpen, resetForm]);

  // Функция обработки отправки формы входа
  const handleSigninSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = values;
    props.handleLogin(email, password)
      .then(() => {
        props.setInfoTooltipData({ isSuccess: true, message: 'Вы успешно вошли в систему!' });
        props.setInfoTooltipOpen(true);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        props.setInfoTooltipData({ isSuccess: false, message: 'Что-то пошло не так! Попробуйте ещё раз.' });
        props.setInfoTooltipOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="authorization" onSubmit={handleSigninSubmit}>
      <h1 className="authorization__title">Вход</h1>
      <input
        className="authorization__email_input"
        type="email"
        value={values.email || ''}
        onChange={handleChange}
        placeholder="Email"
        name="email"
        required
      />
      <span className={`popup__input-error ${errors.email && 'popup__input-error_active'}`}>{errors.email}</span>
      <input
        className="authorization__password_input"
        type="password"
        value={values.password || ''}
        onChange={handleChange}
        placeholder="Пароль"
        minLength="6"
        maxLength="30"
        name="password"
        required
      />
      <span className={`popup__input-error ${errors.password && 'popup__input-error_active'}`}>{errors.password}</span>
      <button type="submit" className="authorization__submit-button" disabled={!isValid}>
        {isLoading ? 'Загружается...' : 'Войти'}
      </button>
    </form>
  );
}

export default Login;