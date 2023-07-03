import React, { useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../components/contexts/CurrentUserContext.js';
import { useFormAndValidation } from '../components/hooks/useFormAndValidation';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, handleOverlayClose, isLoading }) {
  const { values, handleChange, errors, isValid, resetForm, setValues } = useFormAndValidation();
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    resetForm();
    setValues({ name: currentUser?.name || '', about: currentUser?.about || '' });
  }, [currentUser, isOpen, setValues, resetForm]);

  // Функция обработки отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser(values);
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="edit-profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      handleOverlayClose={handleOverlayClose}
      isDisabled={!isValid}
    >
      {isLoading ? (
        <div className='popup__loader'></div>
      ) : (
        <fieldset className="popup__fieldset">
          <input
            type="text"
            className="popup__input popup__input_data_name"
            id="name-input"
            name="name"
            value={values.name || ''}
            onChange={handleChange}
            placeholder="Имя"
            minLength="2"
            maxLength="40"
            required
          />
          <span className={`popup__input-error name-input-error ${errors.name && 'popup__input-error_active'}`} id="name-input-error">{errors.name}</span>
          <input
            type="text"
            className="popup__input popup__input_data_description"
            id="description-input"
            name="about"
            value={values.about || ''}
            onChange={handleChange}
            placeholder="О себе"
            minLength="2"
            maxLength="200"
            required
          />
          <span className={`popup__input-error description-input-error ${errors.about && 'popup__input-error_active'}`} id="about-input-error">{errors.about}</span>
        </fieldset>
      )}
    </PopupWithForm>
  );
}

export default EditProfilePopup;