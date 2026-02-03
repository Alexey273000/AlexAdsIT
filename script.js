// --- СКРИПТ ДЛЯ КВЕСТА (ИСПРАВЛЕННЫЙ) ---
let selected = '';

// 1. Обработка первого шага (кнопка "IT-проект")
document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', () => {
        selected = button.textContent;
        const category = button.dataset.category;
        const current = document.querySelector('.step.active');
        if (current) current.classList.remove('active');
        const step2 = document.querySelector(`.step[data-step="2"][data-category="${category}"]`);
        if (step2) {
            step2.classList.add('active');
            step2.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// 2. Обработка второго шага (выбор тарифа)
document.querySelectorAll('.choice-btn').forEach(button => {
    button.addEventListener('click', () => {
        selected += ' → ' + button.textContent;
        const current = document.querySelector('.step.active');
        if (current) current.classList.remove('active');
        const step3 = document.querySelector('.step[data-step="3"]');
        if (step3) {
            step3.classList.add('active');
            step3.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Показываем сводку в блоке на третьем шаге
        document.getElementById('project-summary-display').textContent = selected;
        document.getElementById('project-summary-hidden').value = selected;
    });
});

// 3. Обработка третьего шага (отправка формы)
document.getElementById('order-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Отменяем стандартную отправку формы

    // Получаем данные из формы
    const userName = document.getElementById('user-name').value.trim();
    const phoneInput = document.getElementById('phone');
    const phoneValue = phoneInput.value.trim();
    const selectedMessenger = document.getElementById('selected-messenger').value;

    // Простая валидация
    if (!userName) {
        alert('Пожалуйста, введите ваше имя.');
        document.getElementById('user-name').focus();
        return;
    }

    const phoneDigits = phoneValue.replace(/\D/g, '');
    if (phoneDigits.length < 10) { // Минимум 10 цифр для российского номера
        alert('Пожалуйста, введите корректный номер телефона (минимум 10 цифр).');
        phoneInput.focus();
        return;
    }

    // Формируем сводку заказа (из шагов 1 и 2)
    const orderSummary = document.getElementById('project-summary-hidden').value;

    // Формируем сообщение для Telegram
    const message = `📋 Новая заявка с лендинга!\n\n` +
        `👤 Имя: ${userName}\n` +
        `📞 Телефон: ${phoneDigits}\n` +
        `💬 Предпочтительный мессенджер: ${selectedMessenger}\n` +
        `---\n` +
        `📦 Детали заказа: ${orderSummary}`;

    // URL вашей функции в Яндекс.Облаке
    const YANDEX_FUNCTION_URL = 'https://functions.yandexcloud.net/d4e0jgoq4npo6bkceckk';

    // Отправляем данные
    fetch(YANDEX_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, type: 'order' })
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Перенаправляем на страницу благодарности
                window.location.href = "thankyou.html";
            } else {
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
            }
        })
        .catch(error => {
            console.error('Ошибка сети:', error);
            alert('Ошибка соединения с сервером.');
        });
});

// <!-- JavaScript для чата (изменено 26.06.2025)-->
// 1. Получаем элементы DOM
const chatbox = document.getElementById('chatbox');// Окно чата
const chatMessages = document.getElementById('chat-messages');// Контейнер сообщений
const chatInput = document.getElementById('chat-input');// Поле ввода
const sendButton = document.getElementById('send-button');// Кнопка отправки

// Авторасширение поля ВВЕРХ
chatInput.addEventListener('input', function() {
  // 1. Сброс высоты
  this.style.height = 'auto';
  
  // 2. Рассчитываем новую высоту (не более 5 строк = 100px)
  const newHeight = Math.min(this.scrollHeight, 100);
  this.style.height = newHeight + 'px';

  // Включаем прокрутку только если содержимое превышает 5 строк
  this.style.overflowY = this.scrollHeight > 100 ? 'auto' : 'hidden';
  
  // 3. Прокручиваем сообщения вниз
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Функция приветственного сообщения бота(изменено 25.06.2025)
function showWelcomeMessage() {
  // Создаём элемент сообщения
  const welcomeMessage = document.createElement('div');
  welcomeMessage.className = 'bot-message'; // Класс для стилей бота
  welcomeMessage.textContent = "👋 Здравствуйте! Чем могу помочь?\n\n• Ответим на вопросы\n• Подберём решение\n• Проконсультируем!\n\nОпишите задачу:"; // Устанавливаем текст

  // Добавляем в контейнер сообщений
  chatMessages.appendChild(welcomeMessage);
  
  chatMessages.scrollTop = chatMessages.scrollHeight;// Прокрутка вниз

  // Прокручиваем вниз
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

//Универсальная функция для обработки кнопок чата(изменено 25.06.2025)
function handleChatButtons() {
  const isOpening = !chatbox.classList.contains('show');// Проверяем, открывается ли чат
  chatbox.classList.toggle('show');// Переключаем видимость
  
  if (isOpening) {//Если чат открывается(изменено 25.06.2025)
    setTimeout(showWelcomeMessage, 300);// Показываем приветствие с задержкой
  }
}

// Назначаем обработчик на все кнопки открытия чата
document.querySelectorAll('.cta-button, .consult-button').forEach(btn => {
  btn.addEventListener('click', handleChatButtons);//При "клике" по кнопке, открывается чат и показывается приветствоие(изменено 26.06.2025)
});

// Обработчик для кнопки закрытия
document.getElementById('close-chat').addEventListener('click', () => {
  chatbox.classList.remove('show');// Просто скрываем чат
});

// 3. Функция отправки сообщения(изменено 23.06.2025)
let isFirstMessage = true; // Флаг для отслеживания первого сообщения

function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  // 1. Добавляем сообщение пользователя в чат
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);

   // 2. Безопасная отправка через Yandex Cloud Function
const YANDEX_FUNCTION_URL = 'https://functions.yandexcloud.net/d4e0jgoq4npo6bkceckk'; // URL вашей функции в Яндекс Облаке

fetch(YANDEX_FUNCTION_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Новый лид! ' + message + ' #ЛИД', // Формируем текст сообщения
    type: 'chat' // Указываем тип - сообщение из чата
  })
})
.catch(error => console.error('Ошибка:', error));

  // 3. Ответ бота зависит от порядка сообщений
  const botResponse = document.createElement('div');
  botResponse.className = 'bot-message';

  if (isFirstMessage) {
    botResponse.textContent = "Спасибо за сообщение! Отвечу вам сегодня. 📝 Напишите прямо здесь телефон, email или мессенджер для связи:";
    isFirstMessage = false; // Следующее сообщение будет считаться контактом
  } else {
    botResponse.textContent = "✅ Спасибо! Ваши данные получены. Свяжусь с вами в ближайшее время.";
    // Можно добавить задержку и закрытие чата
    setTimeout(() => {
      chatbox.classList.remove('show');
      isFirstMessage = true; // Сброс для нового диалога
    }, 3000);
  }

  chatMessages.appendChild(botResponse);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Прокрутка вниз
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 5. Обработчики событий
sendButton.addEventListener('click', sendMessage);// Клик на кнопку
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
    e.preventDefault();
    sendMessage();
    
    // Сброс высоты после отправки
    setTimeout(() => {
      chatInput.style.height = 'auto';
      chatInput.style.overflowY = 'hidden';
    }, 0);
  }
});

  // Функционал гамбургер-меню
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mainMenu = document.querySelector('.main-menu');

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    mainMenu.classList.toggle('mobile-active');
    
    // Меняем иконку гамбургера на крестик при открытии и обратно
    if (mainMenu.classList.contains('mobile-active')) {
      hamburgerBtn.textContent = '✕'; // Крестик
    } else {
      hamburgerBtn.textContent = '☰'; // Гамбургер
    }
  });

  // Закрываем меню при клике вне его
  document.addEventListener('click', (e) => {
    if (!mainMenu.contains(e.target) && e.target !== hamburgerBtn) {
      mainMenu.classList.remove('mobile-active');
      hamburgerBtn.textContent = '☰'; // Возвращаем иконку гамбургера
    }
  });

  // Закрываем меню при клике на ссылку в нем
  mainMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      mainMenu.classList.remove('mobile-active');
      hamburgerBtn.textContent = '☰'; // Возвращаем иконку гамбургера
    }
  });

  // Закрываем меню при изменении ориентации экрана или resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      mainMenu.classList.remove('mobile-active');
      hamburgerBtn.textContent = '☰';
    }
  });
