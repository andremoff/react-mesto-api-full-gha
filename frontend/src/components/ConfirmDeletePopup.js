import React from 'react';

function ConfirmDeletePopup({ isOpen, onClose, onSubmit, handleOverlayClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className={`popup popup-image ${isOpen ? 'popup_opened' : ''}`} id="popup-submit-delete" onClick={handleOverlayClose}>
      <div className="popup__content">
        <h2 className="popup__title">Вы уверены?</h2>
        <form className="popup__form" name="delete-form" onSubmit={handleSubmit}>
          <button type="submit" className="popup__btn-save" id="popup__btn-submit-delete">Да</button>
        </form>
        <button type="button" className="popup__close" aria-label="закрыть всплывающее окно" onClick={onClose}></button>
      </div>
    </div>
  );
}

export default ConfirmDeletePopup;