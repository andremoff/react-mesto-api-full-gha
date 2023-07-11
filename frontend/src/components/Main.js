import React, { useContext } from 'react';
import { CurrentUserContext } from '../components/contexts/CurrentUserContext';
import Card from '../components/Card.js';
import profileFoto from '../images/profile-foto.jpg';

function Main({ onEditProfile, onAddPlace, onEditAvatar, cards, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__content">
          <button className="profile__btn-avatar" onClick={onEditAvatar}>
            <img className="profile__foto" style={{ backgroundImage: `url(${currentUser.avatar || profileFoto})` }} alt="Фото профиля" />
          </button>
          <div className="profile__info">
            <div className="profile__name-field">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button type="button" className="profile__btn-modify" aria-label="редактирование профиля" onClick={onEditProfile}></button>
            </div>
            <p className="profile__description">{currentUser.about}</p>
          </div>
        </div>
        <button type="button" className="profile__add-button" aria-label="добавить фото с описанием" onClick={onAddPlace}></button>
      </section>

      <section className="elements">
        <ul className='elements__list'>
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;