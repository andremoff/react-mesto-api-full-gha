import { api } from '../utils/Api';
import { checkToken, register, login } from '../utils/Auth';
import React, { useState, useEffect } from 'react';
import { CurrentUserContext } from '../components/contexts/CurrentUserContext';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import ImagePopup from './ImagePopup';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from '../components/ProtectedRoute';
import successImage from '../images/successImage.svg';
import failImage from '../images/failImage.svg';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteAddCardPopupOpen, setDeleteAddCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [cards, setCards] = useState([]);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [infoTooltipData, setInfoTooltipData] = useState({ isSuccess: false, message: '' });
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const navigate = useNavigate();

  //Проверяем токен и загружаем данные пользователя
  useEffect(() => {
    checkToken()
      .then((data) => {
        if (data) {
          setLoggedIn(true);
          setCurrentUserEmail(data.data.email);
          navigate('/');
          return Promise.all([api.getUserInfo(), api.getInitialCards()]);
        }
      })
      .then(([userData, initialCards]) => {
        setCurrentUser(userData);
        setCards(initialCards);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setIsCheckingToken(false);
      });
  }, [navigate]);

  // Обрабатывает вход в систему
  const handleLogin = (email, password) => {
    return login(email, password)
      .then(() => {
        setCurrentUserEmail(email);
        return Promise.all([api.getUserInfo(), api.getInitialCards()]);
      })
      .then(([userData, initialCards]) => {
        setCurrentUser({ ...userData });
        setCards(initialCards);
        setLoggedIn(true);
      });
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser({});
    setCurrentUserEmail('');
    navigate('/logout', { replace: true });
  };

  // Обработчик отправки формы регистрации
  const handleRegister = (email, password) => {
    setIsLoading(true);
    if (email && password) {
      register(email, password)
        .then((res) => {
          if (!res || res.statusCode === 400)
            throw new Error('Произошла ошибка при регистрации');
          setInfoTooltipData({
            isSuccess: true,
            message: 'Вы успешно зарегистрировались!',
          });
          setInfoTooltipOpen(true);
          handleLogin(email, password);
          navigate('/sign-in');
        })
        .catch((err) => {
          setInfoTooltipData({
            isSuccess: false,
            message: 'Что-то пошло не так! Попробуйте ещё раз.',
          });
          setInfoTooltipOpen(true);
        })
        .finally(() => setIsLoading(false));
    }
  };

  // Открывает попап "Редактировать профиль"
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  // Открывает попап "Редактировать аватар"
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  // Открывает попап "Новое место"
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  // Открывает попап с изображением карточки
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  // Открывает попап "Подтверждение удаления карточки"
  const handleDeleteCardClick = (card) => {
    setCardToDelete(card);
    setDeleteAddCardPopupOpen(true);
  };

  // Общая функция закрытия попап
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setDeleteAddCardPopupOpen(false);
    setSelectedCard(null);
    setInfoTooltipOpen(false);
  };

  // Обработчик удаления карточки
  const handleConfirmDelete = () => {
    api.deleteCard(cardToDelete._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== cardToDelete._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Обработчик Лайков
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) => cards.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Обработчик данных пользователя
  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api.setUserInfo({ name, about })
      .then((userData) => {
        setCurrentUser({ ...currentUser, name: userData.name, about: userData.about });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Обработчик аватара пользователя
  function handleUpdateAvatar(userAvatar) {
    setIsLoading(true);
    return api
      .changeAvatar({ userAvatar })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Обработчик добавления новой карточки
  function handleAddPlaceCard({ name, link }) {
    setIsLoading(true);
    api.addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Закрытие попап окон через оверлей
  const handleOverlayClose = (e) => {
    if (e.target.classList.contains('popup_opened')) {
      closeAllPopups();
    }
  };

  //Хук для закрытия попап окон через Escape
  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };
    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, []);

  if (isCheckingToken) {
    return (
      <div className="popup popup_opened">
        <div className="popup__loader"></div>
      </div>
    )
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header
          userEmail={currentUserEmail}
          path={loggedIn ? '/' : '/sign-in'}
          onLogout={handleLogout}
          loggedIn={loggedIn}
        />
        <Routes>
          <Route
            path="/sign-in"
            element={
              <Login
                handleLogin={handleLogin}
                setInfoTooltipData={setInfoTooltipData}
                setInfoTooltipOpen={setInfoTooltipOpen}
              />
            }
          />
          <Route
            path="/sign-up"
            element={
              <Register
                handleRegister={handleRegister}
                setInfoTooltipData={setInfoTooltipData}
                setInfoTooltipOpen={setInfoTooltipOpen}
                navigate={navigate}
              />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Main
                  onEditProfile={handleEditProfileClick}
                  onEditAvatar={handleEditAvatarClick}
                  onAddPlace={handleAddPlaceClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardClick={handleCardClick}
                  onCardDelete={handleDeleteCardClick}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          handleOverlayClose={handleOverlayClose}
          isLoading={isLoading}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceCard}
          handleOverlayClose={handleOverlayClose}
          isLoading={isLoading}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          handleOverlayClose={handleOverlayClose}
          isLoading={isLoading}
        />

        <ConfirmDeletePopup
          isOpen={isDeleteAddCardPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleConfirmDelete}
          handleOverlayClose={handleOverlayClose}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip
          name="info"
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          statusImage={infoTooltipData.isSuccess ? successImage : failImage}
          status={infoTooltipData.isSuccess ? 'Успех' : 'Ошибка'}
          title={infoTooltipData.message}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

function AppContainer() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppContainer;