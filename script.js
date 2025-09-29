<script>// Скрипт для квеста
  let selected = '';// Переменная для хранения выбранных опций
  document.querySelectorAll('.next-btn').forEach(button => {// Находим все кнопки "Далее"
    button.addEventListener('click', () => {// Вешаем обработчик клика
      selected = button.textContent;// Запоминаем текст кнопки
      const category = button.dataset.category;// Получаем категорию из data-атрибута

     const current = document.querySelector('.step.active');// Находим активный шаг
      if (current) current.classList.remove('active');// Деактивируем текущий шаг

      const step2 = document.querySelector(`.step[data-step="2"][data-category="${category}"]`);// Находим шаг 2 нужной категории
      if (step2) {// Если шаг 2, то:
        step2.classList.add('active');// Активируем шаг 2
        step2.scrollIntoView({ behavior: 'smooth', block: 'center' });//Плавная прокрутка к шагу
      }
    });
  });

  document.querySelectorAll('.choice-btn').forEach(button => {// Находим все кнопки выбора
    button.addEventListener('click', () => {// Вешаем обработчик клика
      selected += ' → ' + button.textContent;// Добавляем выбор к строке

       const current = document.querySelector('.step.active');// Находим активный шаг
      if (current) current.classList.remove('active');// Деактивируем текущий шаг

      const step3 = document.querySelector('.step[data-step="3"]');// Находим шаг 3
      if (step3) {// Если шаг 3, то:
        step3.classList.add('active');// Активируем шаг 3
        step3.scrollIntoView({ behavior: 'smooth', block: 'center' });//Плавная прокрутка
      }

      document.getElementById('project-summary-display').textContent = selected;// Выводим выбор в блок
document.getElementById('project-summary-hidden').value = selected;// Сохраняем в скрытое поле
    });
  });
document.querySelectorAll('input[name="method"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const emailField = document.getElementById('email-field');
    const phoneField = document.getElementById('phone-field');
    
    if (radio.value === 'email') {
      emailField.style.display = 'block';
      phoneField.style.display = 'none';
    } else {
      emailField.style.display = 'none';
      phoneField.style.display = 'block';
    }
  });
});

 document.getElementById('order-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Получаем данные
  const selectedOptions = document.getElementById('project-summary-hidden').value;
  const contactMethod = document.querySelector('input[name="method"]:checked').value;
  
  // Получаем значение контакта с валидацией
  let contactValue = '';
  let isValid = true;
  
  if (contactMethod === 'email') {
    const emailInput = document.querySelector('input[name="email"]');
    contactValue = emailInput.value.trim();
    
    // Простая валидация email
    if (!contactValue || !contactValue.includes('@') || !contactValue.includes('.')) {
      alert('Пожалуйста, введите корректный email');
      isValid = false;
    }
  } else {
    const phoneInput = document.querySelector('input[name="phone"]');
    contactValue = phoneInput.value.trim();
    
    // Улучшенная валидация телефона
    const phoneDigits = contactValue.replace(/\D/g, '');
    
    // Проверяем, что введено достаточно цифр И что значение не похоже на email
    if (phoneDigits.length < 5 || contactValue.includes('@')) {
      alert('Пожалуйста, введите корректный телефон (только цифры, минимум 5)');
      isValid = false;
    } else {
      contactValue = phoneDigits; // Оставляем только цифры
    }
}
  
  if (!isValid) return;
  
  // Формируем сообщение для Telegram
  const message = `📌 Новый заказ!\n\n` +
                 `🔹 Детали заказа:\n${selectedOptions}\n\n` +
                 `🔹 Контакт (${contactMethod}): ${contactValue}`;
  
 // Безопасная отправка через Yandex Cloud
const YANDEX_FUNCTION_URL = 'https://functions.yandexcloud.net/d4e0jgoq4npo6bkceckk'; // URL вашей функции в Яндекс Облаке

fetch(YANDEX_FUNCTION_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: message, // Передаем текст сообщения
    type: 'order' // Указываем тип - заказ из квеста
  })
})

  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      window.location.href = "thankyou.html";
    } else {
      alert('Ошибка при отправке. Попробуйте ещё раз.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Ошибка соединения. Попробуйте позже.');
  });
});
</script>

<!-- JavaScript для чата (изменено 26.06.2025)-->
<script>
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
</script>

<script>
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
</script>
