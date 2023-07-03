import React from 'react';

function InfoTooltip(props) {
  return (
    <div className={props.isOpen ? 'popup popup_opened' : 'popup'} id={`popup-${props.name}`} onClick={props.onClose}>
      <div className="popup__content popup__content_mobile">
        <button type="button" className="popup__close" aria-label="закрыть" onClick={props.onClose}></button>
        <img className="popup__status-image" src={props.statusImage} alt={`Статуса регистрации: ${props.status}`} />
        <p className="popup__status-caption">{props.title}</p>
      </div>
    </div>
  )
}

export default InfoTooltip;