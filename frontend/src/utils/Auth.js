const BASE_URL = 'https://api.mesto.andremoff.nomoreparties.sbs';

// Функция для обработки ответа сервера
function handleResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(`Ошибка: ${response.status}`);
  }
}

// Функция для регистрации пользователя
export function register(email, password) {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
    .then(response => handleResponse(response));
}

// Функция для входа пользователя
export function login(email, password) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
    .then(response => handleResponse(response));
}

// Функция для проверки токена
export function checkToken() {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then(response => handleResponse(response));
}