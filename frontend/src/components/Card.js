import React, { useContext } from 'react';
import { CurrentUserContext } from '../components/contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  // Определяем владельца карточки
  const isOwn = card?.owner?._id === currentUser?._id;

  // Определяем лайк у карточки текущего пользователя
  const isLiked = card?.likes?.some((like) => like === currentUser?._id) ?? false;

  // Кнопка лайка
  const cardLikeButton = `card__heart ${isLiked && 'card__heart_active'}`;

  // Обработчик открытия изображения
  function handleClick() {
    onCardClick(card);
  }

  // Обработчик "Лайка"
  function handleLikeClick() {
    onCardLike(card);
  }

  // Обработчик "Удаление карточки"
  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="card">
      <img className="card__foto" src={card?.link} alt={card?.name} onClick={handleClick} />
      <div className="card__caption">
        <h2 className="card__title">{card?.name}</h2>
        <div className="card__heart-block">
          <button type="button" className={cardLikeButton} aria-label="лайк" onClick={handleLikeClick}></button>
          <span className="card__hearts-counter">{card?.likes?.length ?? 0}</span>
        </div>
      </div>
      {isOwn && <button className="card__btn-delete" aria-label="удалить" onClick={handleDeleteClick}></button>}
    </li>
  );
}

export default Card;