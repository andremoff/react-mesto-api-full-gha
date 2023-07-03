import React from 'react';

function ImagePopup({ card, onClose }) {
  const handlePopupClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`popup popup-image ${card ? 'popup_opened' : ''}`} onClick={handlePopupClick}>
      <figure className="popup__figure">
        <img src={card?.link} alt={card?.name} className="popup__figure-image" />
        <figcaption className="popup__figure-caption">{card?.name}</figcaption>
        <button className="popup__close" type="button" aria-label="Закрыть" onClick={onClose}></button>
      </figure>
    </div>
  );
}

export default ImagePopup;