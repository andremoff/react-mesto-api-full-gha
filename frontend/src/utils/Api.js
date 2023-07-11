class Api {
  constructor(settings) {
    this._mainUrl = settings.mainUrl;
    this._headers = settings.headers;
  }

  // Проверяем ответ сервера 
  async _checkResponse(res) {
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // Получаем информацию о пользователе
  getUserInfo() {
    return fetch(`${this._mainUrl}/users/me`, {
      headers: this._headers,
      credentials: 'include'
    })
      .then((res) => this._checkResponse(res))
      .then((data) => data.data);
  }

  // Меняем профиль пользователя 
  setUserInfo({ name, about }) {
    return fetch(`${this._mainUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({ name, about })
    })
      .then(this._checkResponse)
      .then(data => data.data);
  }

  // Меняем аватар 
  changeAvatar(inputValues) {
    return fetch(`${this._mainUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar: inputValues.userAvatar
      })
    })
      .then(this._checkResponse);
  }

  // Получаем готовые карточки с сервера 
  getInitialCards() {
    return fetch(`${this._mainUrl}/cards`, {
      headers: this._headers,
      credentials: 'include'
    })
      .then(this._checkResponse)
      .then(data => data.data);
  }

  // Добавляем карточку 
  addCard({ name, link }) {
    return fetch(`${this._mainUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({ name, link })
    })
      .then(this._checkResponse);
  }

  // Удаляем карточку
  deleteCard(cardId) {
    return fetch(`${this._mainUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
      .then(this._checkResponse);
  }

  // Меняем статус лайка
  changeLikeCardStatus(cardId, isLiked) {
    const method = isLiked ? 'DELETE' : 'PUT';
    return fetch(`${this._mainUrl}/cards/${cardId}/likes`, {
      method: method,
      headers: this._headers,
      credentials: 'include'
    })
      .then(this._checkResponse);
  }
}

// Подключение к серверу 
export const api = new Api({
  mainUrl: 'https://api.mesto.andremoff.nomoreparties.sbs',
  headers: {
    'Content-Type': 'application/json'
  }
});
