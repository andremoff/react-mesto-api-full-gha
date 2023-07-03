import React from "react";

function PopupWithForm({ name, title, isOpen, onClose, onSubmit, handleOverlayClose, submitButtonText, children, isDisabled }) {
  return (
    <div className={`popup popup_${name} ${isOpen ? 'popup_opened' : ''}`} onClick={handleOverlayClose}>
      <div className="popup__content">
        <button type="button" className="popup__close" aria-label="закрыть" onClick={onClose}></button>
        <h2 className="popup__title">{title}</h2>
        <form className="popup__form" name={name} onSubmit={onSubmit}>
          {children}
          <button
            type="submit"
            className={`popup__btn-save ${isDisabled ? 'popup__btn-save_inactive' : ''}`}
            disabled={isDisabled}
          >
            {submitButtonText || 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;