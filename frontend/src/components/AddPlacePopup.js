import React, { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { useFormAndValidation } from '../components/hooks/useFormAndValidation';

function AddPlacePopup({ isOpen, onClose, onAddPlace, handleOverlayClose, isLoading }) {
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation()

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace(values);
  }

  return (
    <PopupWithForm
      name="add-foto"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      handleOverlayClose={handleOverlayClose}
      submitButtonText="Создать"
      isDisabled={!isValid}
    >
      {isLoading ? (
        <div className='popup__loader'></div>
      ) : (
        <fieldset className="popup__fieldset">
          <input
            type="text"
            className="popup__input popup__input_data_caption"
            id="caption-input"
            name="name"
            placeholder="Название"
            minLength="2"
            maxLength="30"
            required
            onChange={handleChange}
            value={values.name || ''}
          />
          <span className={`popup__input-error caption-input-error ${errors.name && 'popup__input-error_active'}`} id="title-input-error">
            {errors.name}
          </span>
          <input
            type="url"
            className="popup__input popup__input_data_image"
            id="foto-input"
            name="link"
            placeholder="Ссылка на картинку"
            required
            onChange={handleChange}
            value={values.link || ''}
          />
          <span className={`popup__input-error foto-input-error ${errors.link && 'popup__input-error_active'}`} id="link-input-error">
            {errors.link}
          </span>
        </fieldset>
      )}
    </PopupWithForm>
  );
}

export default AddPlacePopup;