import React, { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { useFormAndValidation } from '../components/hooks/useFormAndValidation';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, handleOverlayClose, isLoading }) {
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation()

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  async function handleSubmit(e) {
    e.preventDefault();
    await onUpdateAvatar(values.userAvatar);
    resetForm();
    onClose();
  }

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="edit-avatar"
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
            type="url"
            className="popup__input popup__input_data_avatar"
            id="avatar-input"
            name="userAvatar"
            placeholder="Ссылка на аватар"
            required
            onChange={handleChange}
            value={values.userAvatar || ''}
          />
          <span className={`popup__input-error avatar-input-error ${errors.userAvatar && 'popup__input-error_active'}`}>{errors.userAvatar}</span>
        </fieldset>
      )}
    </PopupWithForm>
  );
}

export default EditAvatarPopup;